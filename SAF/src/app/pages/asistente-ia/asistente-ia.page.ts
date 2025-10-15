import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController, MenuController } from '@ionic/angular';
import { AIService, FacturaExtraida, CategoriaIA, DeteccionDuplicado } from 'src/app/services/ia/ai.service';
import { Db } from 'src/app/services/Database/db';
import { Factura } from 'src/app/models/factura.model';

@Component({
  selector: 'app-asistente-ia',
  templateUrl: './asistente-ia.page.html',
  styleUrls: ['./asistente-ia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AsistenteIaPage implements OnInit {
  // Chatbot y sugerencias
  mensajesChat: {usuario: string, mensaje: string}[] = [];
  preguntaUsuario: string = '';
  sugerenciasIA: string[] = [
    '¿Cómo importar facturas?',
    '¿Cómo detectar duplicados?',
    '¿Qué significa la categorización automática?',
    '¿Cómo exportar los resultados?'
  ];
  
  // Variables principales
  archivoCsv: File | null = null;
  procesandoCSV = false;
  facturasIA: any[] = [];
  facturasProcesadas: any[] = [];
  
  // Variables de vista previa
  mostrandoPreview = false;
  datosCSVProcesados: any[] = [];
  
  // Variables de análisis
  estadisticasIA = {
    facturasProcesadas: 0,
    duplicadosDetectados: 0,
    categorizacionesAutomaticas: 0,
    ahorroTiempo: 0
  };

  constructor(
    private aiService: AIService,
    private dbService: Db,
    private alertController: AlertController,
    private toastController: ToastController,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.cargarFacturasIA();
    // Mensaje de bienvenida IA
    this.mensajesChat.push({usuario: 'IA', mensaje: '¡Hola! ¿En qué puedo ayudarte con tus facturas hoy?'});
  }

  // Enviar mensaje al chatbot
  enviarMensajeChat() {
    if (!this.preguntaUsuario.trim()) return;
    this.mensajesChat.push({usuario: 'Tú', mensaje: this.preguntaUsuario});
    // Respuesta simulada IA
    let respuesta = 'Estoy procesando tu consulta...';
    if (this.preguntaUsuario.toLowerCase().includes('importar')) {
      respuesta = 'Para importar facturas, selecciona tu archivo CSV y presiona "Procesar con IA".';
    } else if (this.preguntaUsuario.toLowerCase().includes('duplicado')) {
      respuesta = 'La IA detecta duplicados comparando folio y proveedor. Puedes ver los duplicados en la vista previa.';
    } else if (this.preguntaUsuario.toLowerCase().includes('categor')) {
      respuesta = 'La categorización automática agrupa facturas según su tipo y proveedor usando IA.';
    } else if (this.preguntaUsuario.toLowerCase().includes('exportar')) {
      respuesta = 'Puedes exportar los resultados desde la sección de análisis o guardar las facturas procesadas.';
    } else {
      respuesta = '¡Gracias por tu pregunta! Pronto tendremos más respuestas inteligentes.';
    }
    setTimeout(() => {
      this.mensajesChat.push({usuario: 'IA', mensaje: respuesta});
    }, 800);
    this.preguntaUsuario = '';
  }

  // Abrir menú hamburguesa
  abrirMenu() {
    this.menuController.open();
  }

  // Manejar archivo CSV
  manejarArchivoCSV(event: any) {
    const archivo = event.target.files[0];
    if (archivo && archivo.type === 'text/csv') {
      this.archivoCsv = archivo;
    } else {
      this.mostrarError('Por favor selecciona un archivo CSV válido');
      this.archivoCsv = null;
    }
  }

  // Procesar archivo CSV con IA
  async procesarCSVConIA() {
    if (!this.archivoCsv) {
      this.mostrarError('Selecciona un archivo CSV primero');
      return;
    }

    this.procesandoCSV = true;

    try {
      // Leer archivo CSV
      const contenidoCSV = await this.leerArchivoCSV(this.archivoCsv);
      const datosCSV = this.parsearCSV(contenidoCSV);

      // Procesar cada fila con IA
      this.datosCSVProcesados = [];
      for (const fila of datosCSV) {
        const facturaIA = await this.aiService.procesarFacturaDesdeCSV(fila);
        
        // Verificar duplicados
        const verificacion = await this.aiService.verificarDuplicados(facturaIA, this.facturasIA);
        
        // Categorizar
        const categoria = await this.aiService.categorizarFactura(facturaIA as any);

        this.datosCSVProcesados.push({
          ...facturaIA,
          categoria,
          verificacion,
          esNueva: !verificacion.esDuplicado,
          fechaProcesamiento: new Date().toISOString(),
          origenIA: true
        });
      }

      this.mostrandoPreview = true;
      this.estadisticasIA.facturasProcesadas += this.datosCSVProcesados.length;

    } catch (error) {
      console.error('Error procesando CSV:', error);
      this.mostrarError('Error al procesar el archivo CSV');
    } finally {
      this.procesandoCSV = false;
    }
  }

  // Confirmar y guardar facturas procesadas
  async confirmarFacturasIA() {
    const facturasValidas = this.datosCSVProcesados.filter(f => f.esNueva);

    for (const factura of facturasValidas) {
      try {
        // Convertir a formato Factura
        const nuevaFactura: Factura = {
          id: Date.now() + Math.random(),
          folio: factura.folio,
          proveedor: factura.razonSocial,
          monto: factura.montoTotal,
          fechaRecepcion: factura.fechaEmision,
          tipo: 'IA',
          estado: 'pendiente',
          responsable: 'Sistema IA',
          diasDesdeRecepcion: 0,
          mensajeAlerta: '',
          detalles: `Procesada con IA - Categoría: ${factura.categoria.categoria}`,
          origenIA: true,
          categoriaIA: factura.categoria,
          confianzaIA: factura.confianza
        };

        // Guardar en almacenamiento específico de IA
        await this.guardarFacturaIA(nuevaFactura);
        this.estadisticasIA.categorizacionesAutomaticas++;

      } catch (error) {
        console.error('Error guardando factura IA:', error);
      }
    }

    await this.mostrarExito(`${facturasValidas.length} facturas procesadas y guardadas en IA`);
    this.mostrandoPreview = false;
    this.archivoCsv = null;
    this.cargarFacturasIA();
  }

  // Guardar factura específicamente en sección IA
  async guardarFacturaIA(factura: Factura) {
    // Usar una tabla/collection separada para facturas de IA
    await this.dbService.addFacturaIA(factura);
  }

  // Cargar facturas procesadas por IA
  async cargarFacturasIA() {
    try {
      this.facturasIA = await this.dbService.getFacturasIA() || [];
    } catch (error) {
      console.error('Error cargando facturas IA:', error);
      this.facturasIA = [];
    }
  }

  // Eliminar factura de IA
  async eliminarFacturaIA(factura: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar la factura ${factura.folio}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.dbService.deleteFacturaIA(factura.id);
              await this.cargarFacturasIA();
              await this.mostrarExito('Factura eliminada correctamente');
            } catch (error) {
              this.mostrarError('Error al eliminar la factura');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Mover factura a Invoices normales
  async moverAInvoices(factura: any) {
    const alert = await this.alertController.create({
      header: 'Mover a Invoices',
      message: `¿Mover la factura ${factura.folio} a la sección de Invoices normales?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Mover',
          handler: async () => {
            try {
              // Agregar a invoices normales
              await this.dbService.addFactura(factura);
              // Eliminar de IA
              await this.dbService.deleteFacturaIA(factura.id);
              await this.cargarFacturasIA();
              await this.mostrarExito('Factura movida a Invoices');
            } catch (error) {
              this.mostrarError('Error al mover la factura');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Ver análisis de datos
  async mostrarAnalisisIA() {
    if (this.facturasIA.length === 0) {
      this.mostrarError('No hay facturas para analizar');
      return;
    }

    const analisis = this.aiService.analizarPatronesFacturacion(this.facturasIA);
    
    const alert = await this.alertController.create({
      header: '📊 Análisis IA',
      message: `
        <div style="text-align: left;">
          <strong>📈 Estadísticas:</strong><br>
          • Facturas procesadas: ${this.facturasIA.length}<br>
          • Monto promedio: $${analisis.montosPromedio.toLocaleString()}<br>
          • Proveedores únicos: ${analisis.proveedoresRecurrentes.length}<br><br>
          
          <strong>🤖 Recomendaciones IA:</strong><br>
          ${analisis.recomendaciones.map(r => `• ${r}`).join('<br>')}
        </div>
      `,
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  // === MÉTODOS AUXILIARES ===

  private async leerArchivoCSV(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(archivo);
    });
  }

  private parsearCSV(contenido: string): any[] {
    const lineas = contenido.split('\n').filter(linea => linea.trim());
    if (lineas.length < 2) return [];

    const headers = lineas[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const datos = [];

    for (let i = 1; i < lineas.length; i++) {
      const valores = lineas[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const objeto: any = {};
      
      headers.forEach((header, index) => {
        objeto[header] = valores[index] || '';
      });
      
      datos.push(objeto);
    }

    return datos;
  }

  private calcularFechaVencimiento(fechaEmision: string): string {
    const fecha = new Date(fechaEmision);
    fecha.setDate(fecha.getDate() + 8); // 8 días para vencer
    return fecha.toISOString().split('T')[0];
  }

  private async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  // Obtener icono según estado
  getIconoEstado(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'time-outline';
      case 'aceptada': return 'checkmark-circle-outline';
      case 'rechazada': return 'close-circle-outline';
      case 'vencida': return 'warning-outline';
      default: return 'document-outline';
    }
  }

  // Obtener color según estado
  getColorEstado(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'warning';
      case 'aceptada': return 'success';
      case 'rechazada': return 'danger';
      case 'vencida': return 'danger';
      default: return 'medium';
    }
  }

  // Métodos auxiliares para templates
  getFacturasNuevas(): number {
    return this.datosCSVProcesados?.filter(f => f.esNueva).length || 0;
  }

  getFacturasDuplicadas(): number {
    return this.datosCSVProcesados?.filter(f => !f.esNueva).length || 0;
  }

  hayFacturasNuevas(): boolean {
    return this.getFacturasNuevas() > 0;
  }
}
