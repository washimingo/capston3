import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonRefresher, IonRefresherContent, IonSpinner, IonBadge, AlertController } from '@ionic/angular/standalone';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Factura } from 'src/app/models/factura.model';
import * as ExcelJS from 'exceljs';
import { ActivatedRoute } from '@angular/router';
import { Db } from 'src/app/services/Database/db';
import { ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    HeaderComponent
  ]
})
export class InvoicesPage implements OnInit {
  // Normaliza el estado para usarlo como data-status en el HTML
  normalizarEstado(estado: string): string {
    return (estado || '').toLowerCase().split(' ').join('-');
  }
  onHeaderButtonClick(action: any): void {
    // Puedes personalizar la acción aquí si lo necesitas
    console.log('Acción de botón en header:', action);
  }
  // Método público para calcular la fecha de vencimiento
  calcularFechaVencimiento(factura: Factura | null): string | null {
    if (!factura) return null;
    const fechaBase = factura.fechaRecepcion || factura.fecha || null;
    if (!fechaBase) return null;
    const fechaRecepcion = new Date(fechaBase);
    if (isNaN(fechaRecepcion.getTime())) return null;
    const fechaVencimiento = new Date(fechaRecepcion);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 8);
    const dia = fechaVencimiento.getDate().toString().padStart(2, '0');
    const mes = (fechaVencimiento.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaVencimiento.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  // Método público para obtener la fecha y hora actual
  getCurrentDateTime(): string {
    return new Date().toLocaleString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }  

  // Método público para trackBy en *ngFor
  trackByFolio(index: number, factura: Factura): any {
    return factura.folio || factura.id || index;
  }

  route = inject(ActivatedRoute);
  dbService = inject(Db);
  sanitizer = inject(DomSanitizer);
  toastController = inject(ToastController);
  alertController = inject(AlertController);

  getNombreArchivo(): string {
    if (!this.archivoSeleccionado) return '';
    if (typeof this.archivoSeleccionado === 'string') return this.archivoSeleccionado;
    return this.archivoSeleccionado.name;
  }
  ngOnInit() {
    // Recuperar archivo guardado
    const archivoGuardado = localStorage.getItem('archivoCSV');
    this.archivoSeleccionado = archivoGuardado ? archivoGuardado : null;

    // Leer query param para mostrar facturas por vencer o aplicar filtros iniciales
    this.route.queryParams.subscribe(params => {
      if (params['porVencer'] === 'true') {
        this.mostrarPorVencer = true;
        this.categoriaSeleccionada = null;
      } else if (params['estado']) {
        this.categoriaSeleccionada = params['estado'];
        this.mostrarPorVencer = false;
      } else if (params['fecha']) {
        this.filtroFecha = params['fecha'];
        this.categoriaSeleccionada = null;
        this.mostrarPorVencer = false;
      } else if (params['proveedor']) {
        this.filtroBusqueda = params['proveedor'];
        this.campoBusqueda = 'rut';
        this.categoriaSeleccionada = null;
        this.mostrarPorVencer = false;
      } else {
        this.categoriaSeleccionada = null;
        this.filtroFecha = '';
        this.mostrarPorVencer = false;
      }
    });

    // Cargar facturas al inicializar
    this.cargarFacturas();
  }
  quitarArchivo() {
    this.archivoSeleccionado = null;
    this.facturas = [];
    this.exitoCarga = '';
    this.errorCarga = '';
    // Limpiar localStorage para que la próxima carga venga desde la base de datos
    localStorage.removeItem('facturasCSV');
    localStorage.removeItem('archivoCSV');
    localStorage.removeItem('contenidoCSV');
    // Recargar facturas desde la base de datos
    this.cargarFacturas();
  }
  getValorFactura(factura: any, header: string): any {
    // Log para depuración
    if (factura && header) {
      console.log('Renderizando celda:', { header, factura });
    }
    if (!factura || !header) return '';
    // Prueba con el header original
    if (factura[header] !== undefined && factura[header] !== null && factura[header] !== '') return factura[header];
    // Prueba con minúsculas
    const lower = header.toLowerCase();
    if (factura[lower] !== undefined && factura[lower] !== null && factura[lower] !== '') return factura[lower];
    // Prueba sin espacios
    const noSpaces = header.replace(/\s+/g, '');
    if (factura[noSpaces] !== undefined && factura[noSpaces] !== null && factura[noSpaces] !== '') return factura[noSpaces];
    return '';
  }
  /**
   * Determina si la factura está por vencer (en los próximos 7 días)
   */
  esPorVencer = (fechaDocto: string): boolean => {
    if (!fechaDocto) return false;
    // Formato esperado: dd-mm-yyyy
    const partes = fechaDocto.split('-');
    if (partes.length !== 3) return false;
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const anio = parseInt(partes[2], 10);
    const fechaFactura = new Date(anio, mes, dia);
    const hoy = new Date();
    const diferencia = (fechaFactura.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    return diferencia >= 0 && diferencia <= 7;
  }
  // Encabezados dinámicos del CSV
  // Columnas fijas según el CSV esperado
  csvHeaders: string[] = [
    'Nro.',
    'RUT Emisor',
    'Folio',
    'Fecha Docto.',
    'Monto Neto',
    'Monto Exento',
    'Monto IVA',
    'Monto Total',
    'Fecha Recep.',
    'Evento Receptor',
    'Codigo Otro Impto',
    'Valor Otro Impto',
    'Tasa Otro Impto'
  ];
  // Filtros avanzados
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';
  filtroMontoMin: number | null = null;
  filtroMontoMax: number | null = null;
  filtroEstados: string[] = [];

  aplicarFiltrosAvanzados() {
    // Solo refresca la vista, el filtrado se hace en getFacturasFiltradas
  }

  limpiarFiltrosAvanzados() {
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.filtroMontoMin = null;
    this.filtroMontoMax = null;
    this.filtroEstados = [];
    // Limpiar los checkboxes de estados
    this.categoriasResumen.forEach(cat => cat.selected = false);
  }
  getGoogleDocsViewerUrl(fileUrl: string | SafeResourceUrl | null): string | null {
    let urlString = '';
    if (typeof fileUrl === 'string') {
      urlString = fileUrl;
    } else {
      // SafeResourceUrl: extraer el valor interno
      urlString = (fileUrl as any).changingThisBreaksApplicationSecurity || '';
    }
    return 'https://docs.google.com/gview?url=' + encodeURIComponent(urlString) + '&embedded=true';
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validarYSeleccionarArchivo(input.files[0]);
      // Si es CSV, leer encabezados
      const file = input.files[0];
      if (file && file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const text = e.target.result;
          const lines = text.split(/\r?\n/).filter((l: string) => l.trim() !== '');
          if (lines.length > 0) {
            // Detectar delimitador: coma o punto y coma
            // Guardar el contenido del CSV en localStorage
            localStorage.setItem('contenidoCSV', text);
            let delimiter = ',';
            if (lines[0].includes(';')) delimiter = ';';
            // Usar los encabezados tal cual vienen del CSV
            // Leer encabezados reales del CSV
            const normalize = (str: string) => str
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') // quitar tildes
              .replace(/\s+/g, '')
              .replace(/\./g, '')
              .replace(/-/g, '')
              .replace(/_/g, '');

            const csvRealHeaders = lines[0].split(delimiter).map((h: string) => h.replace(/^"|"$/g, '').trim());
            // Mostrar encabezados reales del CSV en consola
            console.log('Encabezados reales del CSV:', csvRealHeaders);
            // Crear un mapa entre header normalizado y su índice en el CSV
            const headerMap: { [key: string]: number } = {};
            // Mostrar el mapeo normalizado en consola
            console.log('HeaderMap (normalizado):', headerMap);
            csvRealHeaders.forEach((h: string, idx: number) => {
              headerMap[normalize(h)] = idx;
            });

            // Mapear los datos a las columnas fijas
            const facturasCSV = [];
            for (let i = 1; i < lines.length; i++) {
              let row = lines[i].trim();
              if (!row) continue; // Ignorar filas vacías
              let values: string[] = [];
              if (delimiter === ';') {
                values = row.split(delimiter).map((v: string) => v.replace(/^"|"$/g, '').trim());
              } else {
                values = row.split(delimiter).map((v: string) => v.replace(/^"|"$/g, '').trim());
              }
              // Si la fila tiene más columnas que headers, rellenar los headers faltantes
              while (values.length < csvRealHeaders.length) {
                values.push('');
              }
              if (values.length > 0) {
                const factura: any = {};
                this.csvHeaders.forEach((header: string) => {
                  const normHeader = normalize(header);
                  const realIdx = headerMap[normHeader];
                  factura[header] = realIdx !== undefined && values[realIdx] !== undefined ? values[realIdx] : '';
                });
                // Asignar el folio correctamente si existe en el CSV
                factura.folio = factura['Folio'] || factura['Nro.'] || '';
                // Asignar el estado exactamente como viene en el CSV (sin forzar 'Pendiente')
                // Asignar el estado con el valor de 'Evento Receptor' del CSV
                factura.estado = factura['Evento Receptor'] || factura['evento receptor'] || factura['estado'] || factura['Estado'] || 'Pendiente';
                // Mapear fechas para visualización y alertas
                factura.fechaEmision = factura['Fecha Docto.'] || '';
                // Normalizar fecha de recepción al formato ISO yyyy-MM-dd
                if (factura['Fecha Recep.']) {
                  const partes = factura['Fecha Recep.'].split(/[\/\-]/);
                  if (partes.length === 3) {
                    // Si viene como dd/MM/yyyy o dd-MM-yyyy
                    const dia = partes[0].padStart(2, '0');
                    const mes = partes[1].padStart(2, '0');
                    const anio = partes[2].length === 2 ? '20' + partes[2] : partes[2];
                    factura.fechaRecepcion = `${anio}-${mes}-${dia}`;
                  } else {
                    factura.fechaRecepcion = factura['Fecha Recep.'];
                  }
                } else {
                  factura.fechaRecepcion = '';
                }
                // Guardar también la fecha de vencimiento para alertas
                factura._porVencer = this.esPorVencer(factura['Fecha Docto.']);
                // Intentar detectar si existe una columna relacionada con cesión/cedida y marcar el estado
                try {
                  // normalizar keys del headerMap para buscar coincidencias como 'cedida' o 'cesion'
                  const cedKeys = Object.keys(headerMap || {}).filter(k => /ced|cesi|cedid/i.test(k));
                  if (cedKeys.length > 0) {
                    const cedVal = values[headerMap[cedKeys[0]]];
                    if (cedVal && /^(si|sí|true|1|cedida|cedido|cesion)$/i.test(String(cedVal).trim())) {
                      factura.estado = 'Cedida';
                    } else if (cedVal && String(cedVal).trim() !== '') {
                      factura.cedida = String(cedVal).trim();
                    }
                  }
                } catch (err) {
                  console.warn('Error detectando columna cedida:', err);
                }
                if (i < 6) {
                  console.log('Factura generada:', factura);
                }
                facturasCSV.push(factura);
              }
            }
            this.facturas = facturasCSV;
            // Guardar facturas y archivo en localStorage
            localStorage.setItem('facturasCSV', JSON.stringify(this.facturas));
            localStorage.setItem('archivoCSV', file.name);
          }
        };
        reader.readAsText(file);
      }
    }
  }

  // Valida y selecciona el archivo (usado por input y drag&drop)
  validarYSeleccionarArchivo(file: File | null) {
    if (!file || !file.name) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['pdf', 'xml', 'jpg', 'jpeg', 'png', 'xlsx', 'csv'].includes(ext)) {
      this.errorCarga = 'Solo se permiten archivos PDF, XML, imágenes, Excel (.xlsx) o CSV.';
      this.exitoCarga = '';
      this.archivoSeleccionado = null;
      return;
    }
    // Mitigación de seguridad: limitar tamaño de archivos XLSX para evitar ReDoS
    if (ext === 'xlsx' && file.size > 5 * 1024 * 1024) {
      this.errorCarga = 'El archivo Excel es demasiado grande para procesar de forma segura (máx. 5 MB).';
      this.exitoCarga = '';
      this.archivoSeleccionado = null;
      return;
    }
    this.archivoSeleccionado = file;
    this.errorCarga = '';
  }

  errorCarga: string = '';
  exitoCarga: string = '';
  archivoSeleccionado: File | string | null = null;
  // Variables para vista previa de Excel
  excelPreviewData: any[][] | null = null;
  excelPreviewError: string = '';
  // Loader y autocompletado
  buscandoFacturas: boolean = false;
  sugerenciasBusqueda: string[] = [];

  // Método para manejar la búsqueda reactiva desde el campo de búsqueda
  onBuscarFactura() {
    this.buscandoFacturas = true;
    // Resetear paginación cuando se realiza una búsqueda
    this.paginaActual = 1;
    setTimeout(() => {
      const texto = (this.filtroBusqueda || '').toLowerCase();
      if (texto.length > 0) {
        // Buscar por RUT Emisor y número de folio además de proveedor, tipo y responsable
        const campos = this.facturas
          .map(f => [f.folio, f['RUT Emisor'], f.proveedor, f.tipo, f.responsable])
          .reduce((acc: any[], val) => acc.concat(val), []);
        this.sugerenciasBusqueda = campos
          .filter(Boolean)
          .map((s: any) => String(s))
          .filter((s: string, i: number, arr: string[]) => s.toLowerCase().includes(texto) && arr.indexOf(s) === i)
          .slice(0, 6);
      } else {
        this.sugerenciasBusqueda = [];
      }
      this.buscandoFacturas = false;
    }, 350);
  }

  seleccionarSugerencia(sugerencia: string) {
    this.filtroBusqueda = sugerencia;
    this.sugerenciasBusqueda = [];
    this.onBuscarFactura();
  }
  campoBusqueda: string = 'todos';
  filtroBusqueda = '';
  filtroFecha = '';
  abrirModalCarga: boolean = false;
  archivoBase64: string | null = null;
  facturas: Factura[] = [];
  
  // Propiedades de paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 25;
  
  // Carga manual de facturas
  nuevaFactura: Partial<Factura> = {};



  // Devuelve una URL de objeto/base64 para visualizar el archivo adjunto (solo para facturas cargadas en la sesión actual)
  getFacturaFileUrl(factura: Factura): SafeResourceUrl | null {
    if (!factura.archivo && !factura.url_archivo) return null;
    const ext = (factura.archivo?.split('.').pop() || '').toLowerCase();
    let url = '';
    if (factura.url_archivo) {
      if (ext === 'pdf' && !factura.url_archivo.startsWith('data:')) {
        url = 'data:application/pdf;base64,' + factura.url_archivo.split(',').pop();
      } else if ((ext === 'jpg' || ext === 'jpeg') && !factura.url_archivo.startsWith('data:')) {
        url = 'data:image/jpeg;base64,' + factura.url_archivo.split(',').pop();
      } else if (ext === 'png' && !factura.url_archivo.startsWith('data:')) {
        url = 'data:image/png;base64,' + factura.url_archivo.split(',').pop();
      } else {
        url = factura.url_archivo;
      }
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    if (['pdf', 'jpg', 'jpeg', 'png'].includes(ext)) {
      url = `assets/facturas/${factura.archivo}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return null;
  }

  categoriasResumen = [
    { nombre: 'Pendientes', estado: 'Pendiente', color: 'warning', selected: false, icono: 'time-outline' },
    { nombre: 'Por Vencer', estado: 'Por Vencer', color: 'medium', selected: false, icono: 'warning-outline' },
    { nombre: 'Acuse Recibo', estado: 'Acuse Recibo', color: 'success', selected: false, icono: 'checkmark-circle-outline' },
    { nombre: 'Reclamado', estado: 'Reclamado', color: 'warning', selected: false, icono: 'flag-outline' },
    // Se añade icono explícito para Cedidas para asegurar que siempre se muestre
    { nombre: 'Cedidas', estado: 'Cedida', color: 'dark', selected: false, icono: 'people-outline' },
  ];

  categoriaSeleccionada: string | null = null;
  mostrarPorVencer: boolean = false;

  getFacturasFiltradas(): Factura[] {
    let facturasFiltradas: Factura[] = [...this.facturas];
    const hoy = new Date();

    // Filtro por fecha exacta (legacy)
    if (this.filtroFecha) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fecha = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
        return fecha === this.filtroFecha;
      });
    }

    // Filtro avanzado: rango de fechas (fecha de recepción)
    if (this.filtroFechaInicio) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fecha = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
        return fecha >= this.filtroFechaInicio;
      });
    }
    // Filtro especial: facturas que vencen en la fecha de término
    if (this.filtroFechaFin) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fechaRecepcion = (f.fechaRecepcion || f.fecha || '').slice(0, 10);
        if (!fechaRecepcion) return false;
        // Calcular fecha de vencimiento sumando 8 días
        const fechaVencimiento = new Date(fechaRecepcion);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 8);
        const fechaVencimientoStr = fechaVencimiento.toISOString().slice(0, 10);
        return fechaVencimientoStr === this.filtroFechaFin;
      });
    }

    // Filtro avanzado: monto mínimo/máximo
    if (this.filtroMontoMin !== null && this.filtroMontoMin !== undefined) {
      facturasFiltradas = facturasFiltradas.filter(f => f.monto >= this.filtroMontoMin!);
    }
    if (this.filtroMontoMax !== null && this.filtroMontoMax !== undefined) {
      facturasFiltradas = facturasFiltradas.filter(f => f.monto <= this.filtroMontoMax!);
    }

    // Filtro avanzado: estado múltiple
    if (this.filtroEstados && this.filtroEstados.length > 0) {
      facturasFiltradas = facturasFiltradas.filter(f => this.filtroEstados.includes((f.estado || '').trim()));
    }

    // Filtro por categoría seleccionada
    if (this.categoriaSeleccionada) {
      if (this.categoriaSeleccionada === 'Por Vencer') {
        // Mostrar facturas pendientes que están por vencer (igual que reports)
        const hoy = new Date();
        facturasFiltradas = facturasFiltradas.filter(f => {
          if ((f.estado || '').toLowerCase() === 'pendiente') {
            const fechaEmision = f.fechaRecepcion || f.fecha || '';
            if (!fechaEmision) return false;
            const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
            const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diasRestantes = 8 - diffDias;
            return diasRestantes <= 7 && diasRestantes > 0;
          }
          return false;
        });
      } else {
        facturasFiltradas = facturasFiltradas.filter(f =>
          (f.estado || '').toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
        );
      }
    }

    // Filtro por facturas por vencer (margen de 7 días)
    if (this.mostrarPorVencer) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        if ((f.estado || '').toLowerCase() === 'pendiente') {
          const fechaEmision = f.fechaRecepcion || f.fecha || '';
          if (!fechaEmision) return false;
          const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diasRestantes = 8 - diffDias;
          return diasRestantes <= 7 && diasRestantes > 0;
        }
        return false;
      });
    }

    // Filtro por búsqueda textual
    if (this.filtroBusqueda && this.filtroBusqueda.trim() !== '') {
      const texto = this.filtroBusqueda.trim().toLowerCase();
      const regex = new RegExp(`(^|\s|\W)${texto}($|\s|\W)`, 'i');
      if (this.campoBusqueda === 'folio') {
        facturasFiltradas = facturasFiltradas.filter(f => f.folio && regex.test(f.folio));
      } else if (this.campoBusqueda === 'proveedor') {
        facturasFiltradas = facturasFiltradas.filter(f => f.proveedor && regex.test(f.proveedor));
      } else if (this.campoBusqueda === 'responsable') {
        facturasFiltradas = facturasFiltradas.filter(f => f.responsable && regex.test(f.responsable));
      } else if (this.campoBusqueda === 'rut') {
        // Comparación exacta para RUT
        facturasFiltradas = facturasFiltradas.filter(f => f['RUT Emisor'] && f['RUT Emisor'].toLowerCase() === texto);
      } else {
        // 'todos': buscar por folio, RUT Emisor, proveedor y responsable
        facturasFiltradas = facturasFiltradas.filter(f =>
          (f.folio && regex.test(f.folio)) ||
          (f['RUT Emisor'] && regex.test(f['RUT Emisor'])) ||
          (f.proveedor && regex.test(f.proveedor)) ||
          (f.responsable && regex.test(f.responsable))
        );
      }
    }

    // Ordenar: primero por las que están por vencer (menos días para vencer), luego por fecha de emisión descendente
    return facturasFiltradas.sort((a, b) => {
      const getDiasRestantes = (factura: Factura) => {
        const fechaEmision = factura.fechaRecepcion || factura.fecha || '';
        if (!fechaEmision) return 9999;
        const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return 8 - diffDias;
      };
      const diasA = getDiasRestantes(a);
      const diasB = getDiasRestantes(b);
      const aPorVencer = diasA > 0 && diasA <= 2;
      const bPorVencer = diasB > 0 && diasB <= 2;
      if (aPorVencer && !bPorVencer) return -1;
      if (!aPorVencer && bPorVencer) return 1;
      const fechaA = new Date(a.fechaRecepcion || a.fecha || 0).getTime();
      const fechaB = new Date(b.fechaRecepcion || b.fecha || 0).getTime();
      return fechaB - fechaA;
    });
  }

  // ===== MÉTODOS DE PAGINACIÓN =====
  
  getFacturasPaginadas(): Factura[] {
    const facturasFiltradas = this.getFacturasFiltradas();
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return facturasFiltradas.slice(inicio, fin);
  }

  getTotalPaginas(): number {
    const totalFacturas = this.getFacturasFiltradas().length;
    return Math.ceil(totalFacturas / this.elementosPorPagina);
  }

  getPaginacionInfo() {
    const facturasFiltradas = this.getFacturasFiltradas();
    const inicio = Math.min((this.paginaActual - 1) * this.elementosPorPagina + 1, facturasFiltradas.length);
    const fin = Math.min(this.paginaActual * this.elementosPorPagina, facturasFiltradas.length);
    return { inicio, fin };
  }

  getPaginasVisibles(): number[] {
    const totalPaginas = this.getTotalPaginas();
    const paginasVisibles: number[] = [];
    
    // Mostrar máximo 5 páginas
    let inicio = Math.max(1, this.paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + 4);
    
    // Ajustar si estamos al final
    if (fin - inicio < 4) {
      inicio = Math.max(1, fin - 4);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginasVisibles.push(i);
    }
    
    return paginasVisibles;
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.getTotalPaginas()) {
      this.paginaActual = pagina;
    }
  }

  irAPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  irAPaginaSiguiente(): void {
    if (this.paginaActual < this.getTotalPaginas()) {
      this.paginaActual++;
    }
  }

  irAPrimeraPagina(): void {
    this.paginaActual = 1;
  }

  irAUltimaPagina(): void {
    this.paginaActual = this.getTotalPaginas();
  }

  cambiarElementosPorPagina(): void {
    // Resetear a la primera página cuando se cambia el número de elementos
    this.paginaActual = 1;
  }

  // ===== FIN MÉTODOS DE PAGINACIÓN =====

  seleccionarCategoria(estado: string) {
    this.mostrarPorVencer = false;
    this.filtroFecha = '';
    if (this.categoriaSeleccionada === estado) {
      this.categoriaSeleccionada = null; // Quitar filtro si se vuelve a hacer click
    } else {
      this.categoriaSeleccionada = estado;
    }
    // Resetear paginación cuando se cambia el filtro
    this.paginaActual = 1;
  }

  // Sincroniza el array de estados seleccionados (usado por filtros avanzados de checkboxes)
  syncFiltroEstados() {
    this.filtroEstados = this.categoriasResumen
      .filter(c => !!c.selected)
      .map(c => c.estado);
    // resetear paginación
    this.paginaActual = 1;
  }

  // Remover un estado individual de los filtros múltiples
  removerEstadoMultiple(estado: string) {
    // Remover del array de estados
    this.filtroEstados = this.filtroEstados.filter(e => e !== estado);
    // Desmarcar el checkbox correspondiente
    const categoria = this.categoriasResumen.find(c => c.estado === estado);
    if (categoria) {
      categoria.selected = false;
    }
    // resetear paginación
    this.paginaActual = 1;
  }

  getResumenCount(estado: string): number {
    if (estado === 'Por Vencer') {
      const hoy = new Date();
      return this.facturas.filter(f => {
        if ((f.estado || '').toLowerCase() === 'pendiente') {
          const fechaEmision = f.fechaRecepcion || f.fecha || '';
          if (!fechaEmision) return false;
          const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diasRestantes = 8 - diffDias;
          return diasRestantes <= 7 && diasRestantes > 0;
        }
        return false;
      }).length;
    }
    return this.facturas.filter(f =>
      f.estado && f.estado.toLowerCase() === estado.toLowerCase()
    ).length;
  }

  // Método para obtener el color del estado (para el ion-badge)
  getColorPorEstado(estado: string): string {
    const cat = this.categoriasResumen.find(c => c.estado === estado);
    return cat ? cat.color : 'primary';
  }


  // Modal de detalles -> Drawer de detalles
  facturaSeleccionada: Factura | null = null;
  drawerVisible: boolean = false;
  
  async abrirDetalles(factura: Factura) {
    this.facturaSeleccionada = factura;
    this.drawerVisible = true;
    this.excelPreviewData = null;
    this.excelPreviewError = '';
    // Si es Excel, intenta mostrar la vista previa
    if (factura.archivo && factura.archivo.toLowerCase().endsWith('.xlsx') && factura.url_archivo) {
      try {
        let base64 = factura.url_archivo;
        if (base64.startsWith('data:')) {
          base64 = base64.split(',')[1];
        }
        const binary = atob(base64);
        // Mitigación: tamaño máximo para vista previa
        if (binary.length > 5 * 1024 * 1024) {
          this.excelPreviewError = 'El Excel es demasiado grande para la vista previa (máx. 5 MB). Descárguelo para verlo completo.';
          return;
        }
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(bytes.buffer);
        const firstSheet = workbook.worksheets[0];
        if (!firstSheet) {
          this.excelPreviewError = 'El archivo Excel no contiene hojas.';
          return;
        }
        
        const data: any[][] = [];
        let rowCount = 0;
        firstSheet.eachRow((row, rowNumber) => {
          if (rowCount >= 1000) return; // Limitar a 1000 filas
          const rowData: any[] = [];
          row.eachCell({ includeEmpty: true }, (cell) => {
            rowData.push(cell.value);
          });
          data.push(rowData);
          rowCount++;
        });
        
        this.excelPreviewData = data;
      } catch (e) {
        this.excelPreviewError = 'No se pudo mostrar la vista previa del Excel.';
      }
    }
  }
  
  cerrarDetalles() {
    this.drawerVisible = false;
    // Pequeño delay para permitir que la animación se complete antes de limpiar los datos
    setTimeout(() => {
      this.facturaSeleccionada = null;
      this.excelPreviewData = null;
      this.excelPreviewError = '';
    }, 300);
  }

  getProgressWidth(factura: Factura | null): number {
    if (!factura) return 0;
    const diasRestantes = this.getDiasRestantes(factura);
    if (diasRestantes === null) return 0;
    const diasTranscurridos = 8 - diasRestantes;
    const porcentaje = (diasTranscurridos * 12.5);
    return Math.min(100, Math.max(0, porcentaje));
  }

  // Calcula los días restantes para el vencimiento de una factura (8 días desde la fecha de emisión o recepción)
  getDiasRestantes(factura: Factura | null | undefined): number | null {
    if (!factura) return null;
    const fechaBase = factura.fechaRecepcion || factura.fecha || null;
    if (!fechaBase) return null;
    const fechaEmision = new Date(fechaBase);
    if (isNaN(fechaEmision.getTime())) return null;
    const hoy = new Date();
    // Ignorar la hora para el cálculo de días
    fechaEmision.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
    const diffMs = hoy.getTime() - fechaEmision.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 8 - diffDias;
  }


  async cargarFacturas() {
    try {
      // Primero intentar cargar desde localStorage (facturas CSV)
      const facturasGuardadas = localStorage.getItem('facturasCSV');
      if (facturasGuardadas) {
        let facturas = JSON.parse(facturasGuardadas);
        // Filtrar por fecha si viene en queryParams
        const urlParams = new URLSearchParams(window.location.search);
        const fechaParam = urlParams.get('fecha');
        if (fechaParam) {
          facturas = facturas.filter((f: any) => (f.fechaRecepcion || '').slice(0, 10) === fechaParam);
        }
        this.facturas = facturas;
        return; // Si encontramos facturas en localStorage, usar esas
      }

      // Si no hay facturas en localStorage, cargar desde la base de datos
      const facturasDB = await this.dbService.getFacturas();
      const hoy = new Date();
      // Mapear y actualizar automáticamente las facturas vencidas
      const actualizaciones: Promise<void>[] = [];
      this.facturas = facturasDB.map((f: any) => {
        const fechaBase = f.fechaRecepcion ?? f.fecha ?? '';
        let estado = f.estado ?? 'Pendiente';
        if (estado === 'Pendiente' && fechaBase) {
          const diffMs = hoy.getTime() - new Date(fechaBase).getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          if (diffDias >= 8) {
            estado = 'Vencida';
            // Actualizar en base de datos
            actualizaciones.push(this.dbService.cambiarEstadoFactura(f.id_factura ?? f.id, 'Vencida', 'sistema', 'Cambio automático por vencimiento de plazo.'));
          }
        }
        return {
          id: f.id_factura ?? f.id,
          folio: f.folio ?? f.cliente ?? '',
          proveedor: f.proveedor ?? '',
          tipo: f.tipo ?? '',
          responsable: f.responsable ?? '',
          monto: f.monto ?? 0,
          fechaRecepcion: f.fechaRecepcion ?? f.fecha ?? '',
          comentario: f.comentario ?? f.detalles ?? '',
          mensajeAlerta: f.mensajeAlerta ?? '',
          estado,
          archivo: f.archivo,
          tipo_archivo: f.tipo_archivo,
          url_archivo: f.url_archivo,
          bitacora: f.bitacora,
          detalles: f.detalles ?? '',
          cliente: f.cliente ?? '',
          fecha: f.fecha ?? '',
          diasDesdeRecepcion: f.diasDesdeRecepcion ?? 0,
        };
      });
      // Esperar a que todas las actualizaciones automáticas terminen
      if (actualizaciones.length > 0) {
        await Promise.all(actualizaciones);
        // Recargar para reflejar los cambios
        await this.cargarFacturas();
      }
    } catch (e) {
      this.facturas = [];
    }
  }
  async mostrarFacturasGuardadas() {
    try {
      const facturas = await this.dbService.getFacturas();
      console.log('Facturas guardadas en SQLite:', facturas);
      alert('Revisa la consola para ver las facturas guardadas.');
    } catch (e) {
      alert('Error al obtener facturas de la base de datos.');
    }
  }

  // Getter para facturas filtradas (para el template)
  get facturasFiltradas() {
    return this.getFacturasFiltradas();
  }

  // Variables para filtros avanzados
  mostrarFiltrosAvanzados: boolean = false;

  // Métodos para la nueva interfaz de filtros
  limpiarTodosFiltros() {
    this.categoriaSeleccionada = null;
    this.filtroBusqueda = '';
    this.filtroFecha = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.filtroMontoMin = null;
    this.filtroMontoMax = null;
    this.filtroEstados = [];
    this.mostrarPorVencer = false;
    // Limpiar los checkboxes de estados
    this.categoriasResumen.forEach(cat => cat.selected = false);
    this.onBuscarFactura();
  }

  getFacturasPorVencer(): number {
    const hoy = new Date();
    return this.facturas.filter(f => {
      if (f.estado && f.estado.toLowerCase() === 'pendiente') {
        const fechaEmision = f.fechaRecepcion || f.fecha || '';
        if (!fechaEmision) return false;
        const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diasRestantes = 8 - diffDias;
        return diasRestantes <= 7 && diasRestantes > 0;
      }
      return false;
    }).length;
  }

  tienesFiltrosActivos(): boolean {
    return !!(this.categoriaSeleccionada || 
             this.filtroBusqueda || 
             this.filtroFechaFin || 
             this.filtroFechaInicio ||
             this.filtroMontoMin !== null ||
             this.filtroMontoMax !== null ||
             this.filtroEstados.length > 0 ||
             this.mostrarPorVencer);
  }

  // Calcula el porcentaje para la barra de progreso de cada estado
  getProgressPercentage(estado: string): number {
    const total = this.facturas.length;
    if (total === 0) return 0;
    const count = this.getResumenCount(estado);
    return Math.round((count / total) * 100);
  }

  // Devuelve el icono correspondiente al estado de la factura
  getIconoEstado(estado: string): string {
    switch ((estado || '').toLowerCase()) {
      case 'pendiente': return 'time-outline';
      case 'por vencer': return 'warning-outline';
      case 'acuse recibo': return 'checkmark-circle-outline';
      case 'reclamado': return 'flag-outline';
      case 'cedida': return 'swap-horizontal-outline';
      default: return 'document-text-outline';
    }
  }

  // Devuelve el color correspondiente al estado de la factura
  getColorEstado(estado: string): string {
    switch ((estado || '').toLowerCase()) {
      case 'pendiente': return 'warning';
      case 'por vencer': return 'medium';
      case 'acuse recibo': return 'success';
      case 'reclamado': return 'warning';
      case 'cedida': return 'dark';
      default: return 'primary';
    }
  }


  // Acción para ver detalles de la factura (puedes personalizarla)
  verFactura(factura: Factura) {
    this.abrirDetalles(factura);
  }


  descargarArchivo(factura: Factura) {
    if (!factura || !factura.archivo || !factura.url_archivo) return;
    // Extraer el tipo MIME según la extensión
    const ext = factura.archivo.split('.').pop()?.toLowerCase() || '';
    let mime = 'application/octet-stream';
    if (ext === 'pdf') mime = 'application/pdf';
    else if (ext === 'xml') mime = 'application/xml';
    else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg';
    else if (ext === 'png') mime = 'image/png';
    else if (ext === 'xlsx') mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // Obtener base64 puro (sin encabezado data:...)
    let base64 = factura.url_archivo;
    if (base64.startsWith('data:')) {
      base64 = base64.split(',')[1];
    }
    // Convertir base64 a blob
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mime });
    // Crear enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = factura.archivo;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  }

  async refrescar(event: any) {
    await this.cargarFacturas();
    event.target.complete();
  }

  // Método para alternar entre datos CSV y base de datos
  async cambiarFuenteDatos(usarCSV: boolean = false) {
    if (usarCSV) {
      // Cargar solo desde localStorage
      const facturasGuardadas = localStorage.getItem('facturasCSV');
      if (facturasGuardadas) {
        this.facturas = JSON.parse(facturasGuardadas);
      } else {
        this.facturas = [];
      }
    } else {
      // Limpiar localStorage y cargar desde base de datos
      localStorage.removeItem('facturasCSV');
      await this.cargarFacturas();
    }
  }

  facturaSeleccionadaTabla: Factura | null = null;

  seleccionarFacturaTabla(factura: Factura) {
    if (this.facturaSeleccionadaTabla && this.facturaSeleccionadaTabla.id === factura.id) {
      this.facturaSeleccionadaTabla = null;
    } else {
      this.facturaSeleccionadaTabla = factura;
    }
  }

  // ...existing code...
}