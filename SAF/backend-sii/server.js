const express = require('express');
const cors = require('cors');
const multer = require('multer');
const forge = require('node-forge');
const axios = require('axios');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuración de CORS - Permitir peticiones desde el frontend
const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:8100'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Variables globales para almacenar la configuración
let certificadoConfig = {
  pfx: null,
  password: '',
  rut: '',
  ambiente: 'certificacion'
};

let tokenSII = null;
let tokenExpiracion = null;

// URLs del SII
const SII_URLS = {
  certificacion: 'https://maullin.sii.cl/DTEWS',
  produccion: 'https://palena.sii.cl/DTEWS'
};

/**
 * Obtiene la URL base según el ambiente
 */
function getBaseUrl() {
  return SII_URLS[certificadoConfig.ambiente];
}

/**
 * Calcula el dígito verificador de un RUT
 */
function calcularDV(rut) {
  const rutLimpio = rut.replace(/[^0-9]/g, '');
  let suma = 0;
  let multiplicador = 2;

  for (let i = rutLimpio.length - 1; i >= 0; i--) {
    suma += parseInt(rutLimpio.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
}

/**
 * Obtiene la semilla del SII
 */
async function obtenerSemilla() {
  try {
    const url = `${getBaseUrl()}/CrSeed.jws?WSDL`;
    const response = await axios.get(url);
    
    const match = response.data.match(/<SEMILLA>(\d+)<\/SEMILLA>/);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('No se pudo obtener la semilla');
  } catch (error) {
    console.error('Error obteniendo semilla:', error);
    throw error;
  }
}

/**
 * Firma la semilla con el certificado digital
 */
function firmarSemilla(semilla) {
  try {
    // Cargar el certificado PFX
    const p12Der = forge.util.decode64(certificadoConfig.pfx);
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certificadoConfig.password);

    // Obtener la clave privada y el certificado
    const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const certBag = bags[forge.pki.oids.certBag][0];
    const certificate = certBag.cert;

    const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
    const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    const privateKey = keyBag.key;

    // Crear el XML de la semilla
    const xmlSemilla = `<?xml version="1.0" encoding="UTF-8"?>
<getToken>
  <item>
    <Semilla>${semilla}</Semilla>
  </item>
</getToken>`;

    // Crear la firma
    const md = forge.md.sha1.create();
    md.update(xmlSemilla, 'utf8');
    
    const signature = privateKey.sign(md);
    const signatureB64 = forge.util.encode64(signature);

    // Construir el XML firmado
    const xmlFirmado = `<?xml version="1.0" encoding="UTF-8"?>
<getToken>
  <item>
    <Semilla>${semilla}</Semilla>
  </item>
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" />
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" />
      <Reference URI="">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />
        <DigestValue>${forge.util.encode64(md.digest().bytes())}</DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>${signatureB64}</SignatureValue>
    <KeyInfo>
      <KeyValue>
        <RSAKeyValue>
          <Modulus>${forge.util.encode64(certificate.publicKey.n.toByteArray())}</Modulus>
          <Exponent>${forge.util.encode64(certificate.publicKey.e.toByteArray())}</Exponent>
        </RSAKeyValue>
      </KeyValue>
      <X509Data>
        <X509Certificate>${forge.util.encode64(forge.asn1.toDer(forge.pki.certificateToAsn1(certificate)).getBytes())}</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
</getToken>`;

    return xmlFirmado;
  } catch (error) {
    console.error('Error firmando semilla:', error);
    throw error;
  }
}

/**
 * Obtiene el token del SII
 */
async function obtenerTokenSII(semillaFirmada) {
  try {
    const url = `${getBaseUrl()}/GetTokenFromSeed.jws?WSDL`;
    
    const soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
      <soapenv:Header/>
      <soapenv:Body>
        <def:getToken>
          <def:pszXml><![CDATA[${semillaFirmada}]]></def:pszXml>
        </def:getToken>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const response = await axios.post(url, soapRequest, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': ''
      }
    });

    const match = response.data.match(/<TOKEN>([^<]+)<\/TOKEN>/);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('No se pudo obtener el token');
  } catch (error) {
    console.error('Error obteniendo token:', error);
    throw error;
  }
}

/**
 * Verifica si el token es válido
 */
function tokenValido() {
  if (!tokenSII || !tokenExpiracion) {
    return false;
  }
  // Los tokens del SII duran aproximadamente 6 horas
  return new Date() < tokenExpiracion;
}

/**
 * Obtiene o renueva el token
 */
async function getToken() {
  if (tokenValido()) {
    return tokenSII;
  }

  const semilla = await obtenerSemilla();
  const semillaFirmada = firmarSemilla(semilla);
  tokenSII = await obtenerTokenSII(semillaFirmada);
  
  // El token expira en 6 horas
  tokenExpiracion = new Date(Date.now() + 6 * 60 * 60 * 1000);
  
  return tokenSII;
}

// ==================== ENDPOINTS ====================

/**
 * Configurar certificado
 */
app.post('/api/sii/configurar', (req, res) => {
  try {
    const { rut, certificado, password, ambiente } = req.body;
    
    if (!rut || !certificado || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    certificadoConfig = {
      pfx: certificado,
      password,
      rut: rut.replace(/[^0-9]/g, ''),
      ambiente: ambiente || 'certificacion'
    };

    // Limpiar token anterior
    tokenSII = null;
    tokenExpiracion = null;

    res.json({ success: true, mensaje: 'Certificado configurado correctamente' });
  } catch (error) {
    console.error('Error configurando certificado:', error);
    res.status(500).json({ error: 'Error configurando certificado', detalles: error.message });
  }
});

/**
 * Subir archivo PFX
 */
app.post('/api/sii/subir-certificado', upload.single('certificado'), async (req, res) => {
  try {
    const { rut, password, ambiente } = req.body;
    
    if (!req.file || !rut || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Leer el archivo y convertirlo a base64
    const pfxBuffer = fs.readFileSync(req.file.path);
    const pfxBase64 = pfxBuffer.toString('base64');

    certificadoConfig = {
      pfx: pfxBase64,
      password,
      rut: rut.replace(/[^0-9]/g, ''),
      ambiente: ambiente || 'certificacion'
    };

    // Eliminar el archivo temporal
    fs.unlinkSync(req.file.path);

    // Limpiar token anterior
    tokenSII = null;
    tokenExpiracion = null;

    res.json({ success: true, mensaje: 'Certificado cargado correctamente' });
  } catch (error) {
    console.error('Error subiendo certificado:', error);
    res.status(500).json({ error: 'Error subiendo certificado', detalles: error.message });
  }
});

/**
 * Obtener token
 */
app.get('/api/sii/token', async (req, res) => {
  try {
    if (!certificadoConfig.pfx) {
      return res.status(400).json({ error: 'Certificado no configurado' });
    }

    const token = await getToken();
    res.json({ token });
  } catch (error) {
    console.error('Error obteniendo token:', error);
    res.status(500).json({ error: 'Error obteniendo token', detalles: error.message });
  }
});

/**
 * Consultar facturas emitidas
 */
app.post('/api/sii/facturas', async (req, res) => {
  try {
    if (!certificadoConfig.pfx) {
      return res.status(400).json({ error: 'Certificado no configurado' });
    }

    const { fechaDesde, fechaHasta, estado } = req.body;
    
    const token = await getToken();
    const url = `${getBaseUrl()}/QueryEstDte.jws?WSDL`;
    
    const dv = calcularDV(certificadoConfig.rut);
    
    const soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
      <soapenv:Header/>
      <soapenv:Body>
        <def:queryEstDte>
          <def:RutConsultante>${certificadoConfig.rut}</def:RutConsultante>
          <def:DvConsultante>${dv}</def:DvConsultante>
          <def:RutCompania>${certificadoConfig.rut}</def:RutCompania>
          <def:DvCompania>${dv}</def:DvCompania>
          <def:RutReceptor></def:RutReceptor>
          <def:DvReceptor></def:DvReceptor>
          <def:FechaDesde>${fechaDesde}</def:FechaDesde>
          <def:FechaHasta>${fechaHasta}</def:FechaHasta>
          <def:Estado>${estado || ''}</def:Estado>
          <def:Token>${token}</def:Token>
        </def:queryEstDte>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const response = await axios.post(url, soapRequest, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': ''
      }
    });

    res.json({ data: response.data });
  } catch (error) {
    console.error('Error consultando facturas:', error);
    res.status(500).json({ error: 'Error consultando facturas', detalles: error.message });
  }
});

/**
 * Consultar estado de DTE
 */
app.post('/api/sii/estado-dte', async (req, res) => {
  try {
    if (!certificadoConfig.pfx) {
      return res.status(400).json({ error: 'Certificado no configurado' });
    }

    const { tipoDTE, folio, rutEmisor, rutReceptor, fechaEmision, montoTotal } = req.body;
    
    const token = await getToken();
    const url = `${getBaseUrl()}/QueryEstDte.jws?WSDL`;
    
    const soapRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:def="http://DefaultNamespace">
      <soapenv:Header/>
      <soapenv:Body>
        <def:getEstDte>
          <def:RutConsultante>${certificadoConfig.rut}</def:RutConsultante>
          <def:DvConsultante>${calcularDV(certificadoConfig.rut)}</def:DvConsultante>
          <def:RutCompania>${rutEmisor}</def:RutCompania>
          <def:DvCompania>${calcularDV(rutEmisor)}</def:DvCompania>
          <def:RutReceptor>${rutReceptor}</def:RutReceptor>
          <def:DvReceptor>${calcularDV(rutReceptor)}</def:DvReceptor>
          <def:TipoDte>${tipoDTE}</def:TipoDte>
          <def:FolioDte>${folio}</def:FolioDte>
          <def:FechaEmisionDte>${fechaEmision}</def:FechaEmisionDte>
          <def:MontoDte>${montoTotal}</def:MontoDte>
          <def:Token>${token}</def:Token>
        </def:getEstDte>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const response = await axios.post(url, soapRequest, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': ''
      }
    });

    res.json({ data: response.data });
  } catch (error) {
    console.error('Error consultando estado DTE:', error);
    res.status(500).json({ error: 'Error consultando estado DTE', detalles: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor SII Backend corriendo en puerto ${PORT}`);
  console.log(`📋 Ambiente: ${certificadoConfig.ambiente}`);
});
