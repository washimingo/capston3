// EJEMPLO DE INTEGRACIÓN DE IA EN INVOICES.PAGE.TS
// Este archivo contiene ejemplos de código para integrar IA en el componente de facturas

import { Injectable } from '@angular/core';
import { AIService } from 'src/app/services/ai/ai.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Factura } from 'src/app/models/factura.model';

/**
 * Clase de ejemplo que muestra cómo integrar las funcionalidades de IA
 * en el componente de facturas existente
 */
@Injectable()
export class IAIntegrationExample {

  facturas: Factura[] = [];

  constructor(
    private aiService: AIService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
    // ... otros servicios existentes
  ) {}

  // 3. Método mejorado para cargar facturas con IA
  async cargarFacturaConIA(archivo: File): Promise<void> {
    const loading = await this.loadingController.create({
      message: '🤖 Procesando factura con IA...',
      spinner: 'dots'
    });
    await loading.present();

    try {
      // Paso 1: Extraer datos con OCR
      console.log('📸 Extrayendo datos con OCR...');
      const datosExtraidos = await this.aiService.procesarFacturaConOCR(archivo);
      
      // Paso 2: Verificar duplicados
      console.log('🔍 Verificando duplicados...');
      const verificacionDuplicado = await this.aiService.verificarDuplicados(
        datosExtraidos as any, 
        this.facturas
      );
      
      if (verificacionDuplicado.esDuplicado) {
        await this.mostrarAlertaDuplicado(verificacionDuplicado);
        return;
      }
      
      // Paso 3: Categorizar automáticamente
      console.log('🏷️ Categorizando factura...');
      const categoria = await this.aiService.categorizarFactura(datosExtraidos as any);
      
      // Paso 4: Crear factura con datos de IA
      const nuevaFactura: Factura = {
        id: Date.now(),
        folio: datosExtraidos.folio,
        proveedor: datosExtraidos.razonSocial,
        fechaRecepcion: datosExtraidos.fechaEmision,
        monto: datosExtraidos.montoTotal,
        tipo: 'Factura',
        estado: 'Pendiente',
        responsable: 'Sistema IA',
        comentario: `Categoría: ${categoria.categoria}`,
        diasDesdeRecepcion: 0,
        mensajeAlerta: '',
        detalles: `Confianza IA: ${Math.round(datosExtraidos.confianza * 100)}%`,
        // Campos adicionales para IA
        ['RUT Emisor']: datosExtraidos.rutEmisor,
        ['Fecha Docto.']: datosExtraidos.fechaEmision,
        ['Monto Total']: datosExtraidos.montoTotal,
        ['Razón Social']: datosExtraidos.razonSocial
      } as any;
      
      // Paso 5: Mostrar vista previa con datos extraídos
      await this.mostrarVistaPreviewIA(nuevaFactura, categoria);
      
    } catch (error) {
      console.error('Error procesando con IA:', error);
      await this.mostrarErrorIA(error);
    } finally {
      await loading.dismiss();
    }
  }

  // Método para mostrar vista previa de datos extraídos
  async mostrarVistaPreviewIA(factura: any, categoria: any): Promise<void> {
    const alert = await this.alertController.create({
      header: '🤖 Datos Extraídos con IA',
      subHeader: `Confianza: ${Math.round((factura.confianzaIA || 0.85) * 100)}%`,
      message: `
        <div style="text-align: left;">
          <strong>📄 Folio:</strong> ${factura.folio}<br>
          <strong>🏢 RUT Emisor:</strong> ${factura['RUT Emisor']}<br>
          <strong>📅 Fecha:</strong> ${factura['Fecha Docto.']}<br>
          <strong>💰 Monto:</strong> $${factura['Monto Total']?.toLocaleString()}<br>
          <strong>🏷️ Categoría:</strong> ${categoria.categoria}<br>
          <strong>🎯 Confianza IA:</strong> ${Math.round(categoria.confianza * 100)}%
        </div>
      `,
      buttons: [
        {
          text: '❌ Cancelar',
          role: 'cancel'
        },
        {
          text: '✏️ Editar',
          handler: () => {
            this.abrirModalEdicionIA(factura);
          }
        },
        {
          text: '✅ Guardar',
          handler: () => {
            this.guardarFacturaIA(factura);
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para mostrar alerta de duplicado
  async mostrarAlertaDuplicado(verificacion: any): Promise<void> {
    const alert = await this.alertController.create({
      header: '⚠️ Posible Duplicado Detectado',
      subHeader: 'La IA ha encontrado una factura similar',
      message: `
        <div style="text-align: left;">
          <strong>Factura existente:</strong><br>
          Folio: ${verificacion.facturaOriginal?.folio}<br>
          Fecha: ${verificacion.facturaOriginal?.['Fecha Docto.']}<br>
          Monto: $${verificacion.facturaOriginal?.['Monto Total']?.toLocaleString()}<br>
          <br>
          <strong>Similitud:</strong> ${Math.round(verificacion.similitud * 100)}%<br>
          <strong>Recomendación:</strong> ${verificacion.recomendacion}
        </div>
      `,
      buttons: [
        {
          text: '🔍 Ver Original',
          handler: () => {
            this.verFactura(verificacion.facturaOriginal);
          }
        },
        {
          text: '➕ Continuar Carga',
          handler: () => {
            // Continuar con la carga ignorando el duplicado
          }
        }
      ]
    });

    await alert.present();
  }

  // Panel de análisis predictivo con IA
  async mostrarAnalisisPredictivoIA(): Promise<void> {
    const analisis = await this.aiService.analizarPatronesFacturacion(this.facturas);
    
    console.log('📊 Análisis Predictivo IA:', analisis);
    
    // Mostrar en el dashboard o en un modal
    await this.mostrarModalAnalisisIA(analisis);
  }

  async mostrarModalAnalisisIA(analisis: any): Promise<void> {
    const alert = await this.alertController.create({
      header: '🤖 Análisis Predictivo IA',
      subHeader: 'Insights automáticos de tus facturas',
      message: `
        <div style="text-align: left;">
          <strong>📈 Tendencia Mensual:</strong><br>
          ${Object.keys(analisis.tendenciaMensual || {}).length} meses analizados<br><br>
          
          <strong>🏢 Proveedores Top:</strong><br>
          ${(analisis.proveedoresRecurrentes || []).slice(0, 3).map((p: any) => 
            `• ${p.rut}: ${p.cantidad} facturas`
          ).join('<br>')}<br><br>
          
          <strong>💰 Monto Promedio:</strong><br>
          $${(analisis.montosPromedio || 0).toLocaleString()}<br><br>
          
          <strong>🤖 Recomendaciones IA:</strong><br>
          ${(analisis.recomendaciones || []).slice(0, 2).join('<br>')}
        </div>
      `,
      buttons: [
        {
          text: '📊 Ver Reporte Completo',
          handler: () => {
            // Navegar a página de reportes con análisis IA
          }
        },
        {
          text: '✅ Cerrar'
        }
      ]
    });

    await alert.present();
  }

  // Sugerencias inteligentes en tiempo real
  async mostrarSugerenciasIA(): Promise<void> {
    const sugerencias = await this.aiService.generarSugerenciasOptimizacion(this.facturas);
    
    if (sugerencias.length > 0) {
      await this.mostrarToastSugerencias(sugerencias);
    }
  }

  async mostrarToastSugerencias(sugerencias: string[]): Promise<void> {
    const toast = await this.toastController.create({
      message: `🤖 IA Sugiere: ${sugerencias[0]}`,
      duration: 5000,
      position: 'top',
      color: 'primary',
      buttons: [
        {
          text: 'Ver más',
          handler: () => {
            this.mostrarTodasLasSugerencias(sugerencias);
          }
        }
      ]
    });

    await toast.present();
  }

  // Botón en el template para activar IA
  async activarAsistenteIA(): Promise<void> {
    const alert = await this.alertController.create({
      header: '🤖 Asistente IA',
      subHeader: 'Selecciona una función',
      buttons: [
        {
          text: '📸 Procesar Factura con OCR',
          handler: () => this.activarOCR()
        },
        {
          text: '🔍 Detectar Duplicados',
          handler: () => this.verificarDuplicadosIA()
        },
        {
          text: '📊 Análisis Predictivo',
          handler: () => this.mostrarAnalisisPredictivoIA()
        },
        {
          text: '💡 Sugerencias Optimización',
          handler: () => this.mostrarSugerenciasIA()
        },
        {
          text: '❌ Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  // Métodos auxiliares (stubs para evitar errores)
  private async mostrarErrorIA(error: any): Promise<void> {
    const alert = await this.alertController.create({
      header: '❌ Error IA',
      message: 'Ocurrió un error procesando con IA. Intenta nuevamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

  private abrirModalEdicionIA(factura: any): void {
    console.log('Abrir modal de edición para:', factura);
  }

  private guardarFacturaIA(factura: any): void {
    console.log('Guardar factura procesada por IA:', factura);
    this.facturas.push(factura);
  }

  private verFactura(factura: any): void {
    console.log('Ver factura:', factura);
  }

  private activarOCR(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.cargarFacturaConIA(file);
      }
    };
    input.click();
  }

  private async verificarDuplicadosIA(): Promise<void> {
    const toast = await this.toastController.create({
      message: '🔍 Verificando duplicados con IA...',
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  private async mostrarTodasLasSugerencias(sugerencias: string[]): Promise<void> {
    const alert = await this.alertController.create({
      header: '💡 Todas las Sugerencias IA',
      message: sugerencias.map((s, i) => `${i + 1}. ${s}`).join('<br><br>'),
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  // Método para obtener color de confianza
  getColorConfianza(confianza: number): string {
    if (confianza >= 0.8) return 'success';
    if (confianza >= 0.6) return 'warning';
    return 'danger';
  }
}

/* 
EJEMPLO DE TEMPLATE HTML PARA INTEGRAR IA

<!-- Botón de IA en el header -->
<ion-button fill="clear" (click)="activarAsistenteIA()">
  <ion-icon name="sparkles" slot="start"></ion-icon>
  Asistente IA
</ion-button>

<!-- Indicador de confianza IA en cada factura -->
<div class="ai-confidence" *ngIf="factura.confianzaIA">
  <ion-badge color="{{getColorConfianza(factura.confianzaIA)}}">
    🤖 {{(factura.confianzaIA * 100).toFixed(0)}}%
  </ion-badge>
</div>

<!-- Panel de sugerencias IA -->
<ion-card *ngIf="sugerenciasIA.length > 0" class="ai-suggestions">
  <ion-card-header>
    <ion-card-title>
      <ion-icon name="bulb" color="warning"></ion-icon>
      Sugerencias IA
    </ion-card-title>
  </ion-card-header>
  <ion-card-content>
    <div *ngFor="let sugerencia of sugerenciasIA" class="suggestion-item">
      {{sugerencia}}
    </div>
  </ion-card-content>
</ion-card>

<!-- Sección de IA en página de facturas -->
<div class="ai-section">
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        <ion-icon name="sparkles" color="primary"></ion-icon>
        🤖 Asistente de IA
      </ion-card-title>
      <ion-card-subtitle>
        Procesa facturas automáticamente con inteligencia artificial
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <ion-button expand="block" (click)="activarAsistenteIA()">
        <ion-icon name="flash" slot="start"></ion-icon>
        Activar IA
      </ion-button>
    </ion-card-content>
  </ion-card>
</div>

*/