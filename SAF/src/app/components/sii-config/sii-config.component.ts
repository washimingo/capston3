import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonIcon,
  IonList,
  IonNote,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { SiiBackendService } from '../../services/sii/sii-backend.service';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, checkmarkCircleOutline, alertCircleOutline, downloadOutline, refreshOutline, documentTextOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sii-config',
  templateUrl: './sii-config.component.html',
  styleUrls: ['./sii-config.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonIcon,
    IonList,
    IonNote
  ]
})
export class SiiConfigComponent implements OnInit {
  // Configuración
  rut: string = '';
  password: string = '';
  ambiente: 'certificacion' | 'produccion' = 'certificacion';
  certificadoFile: File | null = null;
  certificadoNombre: string = '';

  // Estados
  configurado: boolean = false;
  cargando: boolean = false;

  // Consulta de facturas
  fechaDesde: string = '';
  fechaHasta: string = '';
  facturas: any[] = [];
  cargandoFacturas: boolean = false;

  constructor(
    private siiBackend: SiiBackendService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({
      cloudUploadOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      downloadOutline,
      refreshOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
    // Configurar fechas por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    this.fechaHasta = this.formatearFecha(hoy);
    this.fechaDesde = this.formatearFecha(haceUnMes);
  }

  /**
   * Abre el selector de archivos
   */
  abrirSelectorArchivo() {
    const fileInput = document.getElementById('certificado') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  /**
   * Maneja la selección del archivo PFX
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.pfx') || file.name.endsWith('.p12')) {
        this.certificadoFile = file;
        this.certificadoNombre = file.name;
      } else {
        this.mostrarToast('Por favor selecciona un archivo .pfx o .p12', 'warning');
      }
    }
  }

  /**
   * Configura el certificado en el backend
   */
  async configurarCertificado() {
    if (!this.certificadoFile || !this.rut || !this.password) {
      this.mostrarToast('Debes completar todos los campos', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Configurando certificado...',
    });
    await loading.present();

    try {
      const formData = new FormData();
      formData.append('certificado', this.certificadoFile);
      formData.append('rut', this.rut);
      formData.append('password', this.password);
      formData.append('ambiente', this.ambiente);

      this.siiBackend.subirCertificado(formData).subscribe({
        next: (response) => {
          this.configurado = true;
          this.mostrarToast('Certificado configurado correctamente', 'success');
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error configurando certificado:', error);
          this.mostrarToast('Error al configurar el certificado', 'danger');
          loading.dismiss();
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.mostrarToast('Error al procesar el certificado', 'danger');
      loading.dismiss();
    }
  }

  /**
   * Consulta las facturas del SII
   */
  async consultarFacturas() {
    if (!this.configurado) {
      this.mostrarToast('Primero debes configurar el certificado', 'warning');
      return;
    }

    if (!this.fechaDesde || !this.fechaHasta) {
      this.mostrarToast('Debes seleccionar un rango de fechas', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Consultando facturas del SII...',
    });
    await loading.present();

    this.cargandoFacturas = true;

    try {
      const params = {
        fechaDesde: this.fechaDesde.replace(/-/g, ''),
        fechaHasta: this.fechaHasta.replace(/-/g, '')
      };

      this.siiBackend.consultarFacturas(params).subscribe({
        next: (response) => {
          console.log('Respuesta del SII:', response);
          
          // Aquí deberías parsear la respuesta XML del SII
          // y convertirla en un array de facturas
          this.facturas = this.parsearRespuestaSII(response.data);
          
          this.mostrarToast(`Se encontraron ${this.facturas.length} facturas`, 'success');
          this.cargandoFacturas = false;
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error consultando facturas:', error);
          this.mostrarToast('Error al consultar las facturas', 'danger');
          this.cargandoFacturas = false;
          loading.dismiss();
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.mostrarToast('Error al consultar las facturas', 'danger');
      this.cargandoFacturas = false;
      loading.dismiss();
    }
  }

  /**
   * Parsea la respuesta XML del SII
   */
  private parsearRespuestaSII(xmlData: string): any[] {
    const facturas: any[] = [];
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
      
      // Este es un ejemplo, la estructura real depende del servicio del SII
      const documentos = xmlDoc.getElementsByTagName('Documento');
      
      for (let i = 0; i < documentos.length; i++) {
        const doc = documentos[i];
        
        facturas.push({
          folio: this.getElementValue(doc, 'Folio'),
          tipoDTE: this.getElementValue(doc, 'TipoDTE'),
          rutEmisor: this.getElementValue(doc, 'RutEmisor'),
          rutReceptor: this.getElementValue(doc, 'RutReceptor'),
          fechaEmision: this.getElementValue(doc, 'FchEmis'),
          montoTotal: this.getElementValue(doc, 'MntTotal'),
          estado: this.getElementValue(doc, 'Estado')
        });
      }
    } catch (error) {
      console.error('Error parseando respuesta:', error);
    }
    
    return facturas;
  }

  private getElementValue(parent: any, tagName: string): string {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
  }

  /**
   * Formatea una fecha a YYYY-MM-DD
   */
  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formatea el RUT mientras se escribe
   */
  formatearRut() {
    let rut = this.rut.replace(/[^0-9kK]/g, '');
    
    if (rut.length > 1) {
      const cuerpo = rut.slice(0, -1);
      const dv = rut.slice(-1).toUpperCase();
      
      // Formatear con puntos
      let rutFormateado = '';
      let contador = 0;
      
      for (let i = cuerpo.length - 1; i >= 0; i--) {
        if (contador === 3) {
          rutFormateado = '.' + rutFormateado;
          contador = 0;
        }
        rutFormateado = cuerpo[i] + rutFormateado;
        contador++;
      }
      
      this.rut = rutFormateado + '-' + dv;
    }
  }

  /**
   * Muestra un mensaje toast
   */
  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }
}
