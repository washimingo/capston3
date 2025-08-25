import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../services/database.service';
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
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonModal,
  IonButtons,
  IonButton,
  IonIcon,
  // ...existing code...
  IonChip,
  IonAlert
} from '@ionic/angular/standalone';

interface BitacoraLog {
  usuario: string;
  accion: string;
  fecha: Date;
}

import { Factura as FacturaModel } from '../models/factura.model';

interface Factura extends FacturaModel {
  detalles: string;
  archivo?: string;
  url_archivo?: string;
  tipo_archivo?: string;
  bitacora?: BitacoraLog[];
  cliente?: string;
  fecha?: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonList,
    IonItem,
    IonLabel,
  IonText,
  IonButtons,
  IonButton,
  IonIcon,
  IonChip,
  IonAlert
  ]
})
export class InvoicesPage {
  alertEliminarButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => this.cancelarEliminar()
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => this.confirmarEliminar()
    }
  ];
  abrirModalCarga: boolean = false;
  archivoBase64: string | null = null;
  facturas: Factura[] = [];
  // Carga manual de facturas
  nuevaFactura: Partial<Factura> = {
    cliente: '',
    monto: undefined,
    detalles: '',
    folio: '',
    proveedor: '',
    tipo: '',
    responsable: '',
    fechaRecepcion: '',
    comentario: '',
    mensajeAlerta: '',
  };
  archivoSeleccionado: File | null = null;
  errorCarga: string = '';
  exitoCarga: string = '';

  // Control de edición
  abrirDrawerEditar: boolean = false;
  editandoFactura: Factura | null = null;
  facturaEditada: Partial<Factura> = {};

  // Alerta personalizada de eliminación
  mostrarAlertaEliminar: boolean = false;
  facturaAEliminar: Factura | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'xml', 'jpg', 'jpeg', 'png'].includes(ext)) {
      this.errorCarga = 'Solo se permiten archivos PDF, XML o imágenes.';
      this.exitoCarga = '';
      this.archivoSeleccionado = null;
      return;
    }
  this.archivoSeleccionado = file;
  this.errorCarga = '';
  }

  async onSubmitFactura(event: Event) {
    event.preventDefault();
    this.errorCarga = '';
    this.exitoCarga = '';
    if (!this.archivoSeleccionado) {
      this.errorCarga = 'Debe seleccionar un archivo válido.';
      return;
    }
    if (!this.nuevaFactura.folio || !this.nuevaFactura.proveedor || !this.nuevaFactura.tipo || !this.nuevaFactura.responsable || !this.nuevaFactura.monto || !this.nuevaFactura.fechaRecepcion) {
      this.errorCarga = 'Debe completar los campos obligatorios.';
      return;
    }
    // Guardar archivo como base64 (solo para demo, en producción se recomienda guardar la ruta)
    const reader = new FileReader();
    reader.onload = async () => {
      this.archivoBase64 = reader.result as string;
      const nombreArchivo = this.archivoSeleccionado!.name;
      const tipoArchivo = nombreArchivo.split('.').pop()?.toLowerCase() || '';
      const nuevaFactura = {
        folio: this.nuevaFactura.folio!,
        proveedor: this.nuevaFactura.proveedor!,
        tipo: this.nuevaFactura.tipo!,
        responsable: this.nuevaFactura.responsable!,
        monto: this.nuevaFactura.monto!,
        fechaRecepcion: this.nuevaFactura.fechaRecepcion!,
        comentario: this.nuevaFactura.comentario || '',
        mensajeAlerta: this.nuevaFactura.mensajeAlerta || '',
        estado: 'Pendiente',
        archivo: nombreArchivo,
        tipo_archivo: tipoArchivo,
        url_archivo: this.archivoBase64,
        usuario_creador: 'usuario demo',
        fecha_subida: new Date().toISOString(),
        bitacora: [
          { usuario: 'usuario demo', accion: 'Carga manual de factura', fecha: new Date() }
        ]
      };
      try {
        const id = await this.dbService.addFactura(nuevaFactura);
        this.exitoCarga = 'Factura cargada exitosamente.';
        await this.cargarFacturas();
      } catch (e) {
        this.errorCarga = 'Error al guardar la factura en la base de datos.';
      }
      this.nuevaFactura = {
        folio: '',
        proveedor: '',
        tipo: '',
        responsable: '',
        monto: undefined,
        fechaRecepcion: '',
        comentario: '',
        mensajeAlerta: '',
      };
      this.archivoSeleccionado = null;
      setTimeout(() => this.exitoCarga = '', 2500);
      this.abrirModalCarga = false;
    };
    reader.readAsDataURL(this.archivoSeleccionado);
  }

  cerrarModalCarga() {
    this.abrirModalCarga = false;
    this.nuevaFactura = {
      folio: '',
      proveedor: '',
      tipo: '',
      responsable: '',
      monto: undefined,
      fechaRecepcion: '',
      comentario: '',
      mensajeAlerta: '',
    };
    this.archivoSeleccionado = null;
    this.errorCarga = '';
    this.exitoCarga = '';
  }

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
    { nombre: 'Pendientes', estado: 'Pendiente', color: 'warning' },
    { nombre: 'Aceptadas', estado: 'Aceptada', color: 'success' },
    { nombre: 'Rechazadas', estado: 'Rechazada', color: 'danger' },
    { nombre: 'Vencidas', estado: 'Vencida', color: 'medium' },
  ];

  categoriaSeleccionada: string | null = null;
  mostrarPorVencer: boolean = false;

  getFacturasFiltradas(): Factura[] {
    if (this.mostrarPorVencer) {
      // Filtrar facturas por vencer (<=2 días para el plazo de 8 días desde la fecha)
      const hoy = new Date();
      return this.facturas.filter(f => {
        if (f.estado && f.estado.toLowerCase() === 'pendiente') {
          const fechaEmision = f.fecha ? new Date(f.fecha) : new Date();
          const diffMs = hoy.getTime() - fechaEmision.getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diasRestantes = 8 - diffDias;
          return diasRestantes <= 2 && diasRestantes > 0;
        }
        return false;
      });
    }
    if (!this.categoriaSeleccionada) {
      return this.facturas;
    }
    // Filtrado exacto, insensible a mayúsculas/minúsculas
    return this.facturas.filter(f =>
      f.estado.toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
    );
  }

  seleccionarCategoria(estado: string) {
    this.mostrarPorVencer = false;
    if (this.categoriaSeleccionada === estado) {
      this.categoriaSeleccionada = null; // Quitar filtro si se vuelve a hacer click
    } else {
      this.categoriaSeleccionada = estado;
    }
  }

  getResumenCount(estado: string): number {
    return this.facturas.filter(f =>
      f.estado.toLowerCase() === estado.toLowerCase()
    ).length;
  }

  // Método para obtener el color del estado (para el ion-badge)
  getColorPorEstado(estado: string): string {
    const cat = this.categoriasResumen.find(c => c.estado === estado);
    return cat ? cat.color : 'primary';
  }


  // Modal de detalles
  facturaSeleccionada: Factura | null = null;
  abrirDetalles(factura: Factura) {
    this.facturaSeleccionada = factura;
  }
  cerrarDetalles() {
    this.facturaSeleccionada = null;
  }

  // Iniciar edición de factura
  editarFactura(factura: Factura) {
    this.editandoFactura = { ...factura };
    this.facturaEditada = { ...factura };
    this.archivoSeleccionado = null;
    this.errorCarga = '';
    this.exitoCarga = '';
    this.abrirDrawerEditar = true;
    this.abrirModalCarga = false;
  }

  // Guardar cambios de edición
  async guardarEdicion() {
    if (!this.editandoFactura) return;
    try {
      const id_factura = this.editandoFactura.id;
      // Si hay un archivo seleccionado, procesar y actualizar campos de archivo
      if (this.archivoSeleccionado) {
        const file = this.archivoSeleccionado;
        const ext = file.name ? (file.name.split('.').pop() || '').toLowerCase() : '';
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          const cambios = {
            ...this.facturaEditada,
            archivo: file.name,
            tipo_archivo: ext,
            url_archivo: base64
          };
          await this.dbService.updateFactura(id_factura, cambios);
          this.editandoFactura = null;
          this.facturaEditada = {};
          this.archivoSeleccionado = null;
          this.abrirDrawerEditar = false;
          await this.cargarFacturas();
          this.exitoCarga = 'Factura editada correctamente.';
          setTimeout(() => this.exitoCarga = '', 2000);
        };
        reader.readAsDataURL(file);
        return;
      }
      // Si no hay archivo nuevo, solo actualizar campos de texto
      const cambios = { ...this.facturaEditada };
      await this.dbService.updateFactura(id_factura, cambios);
      this.editandoFactura = null;
      this.facturaEditada = {};
      this.archivoSeleccionado = null;
      this.abrirDrawerEditar = false;
      await this.cargarFacturas();
      this.exitoCarga = 'Factura editada correctamente.';
      setTimeout(() => this.exitoCarga = '', 2000);
    } catch (e) {
      this.errorCarga = 'Error al editar la factura.';
    }
  }

  cancelarEdicion() {
    this.editandoFactura = null;
    this.facturaEditada = {};
    this.archivoSeleccionado = null;
    this.abrirDrawerEditar = false;
    this.errorCarga = '';
    this.exitoCarga = '';
  }

  // Eliminar factura
  eliminarFactura(factura: Factura) {
    this.facturaAEliminar = factura;
    this.mostrarAlertaEliminar = true;
  }

  cancelarEliminar() {
    this.facturaAEliminar = null;
    this.mostrarAlertaEliminar = false;
  }

  async confirmarEliminar() {
    if (!this.facturaAEliminar) return;
    try {
      await this.dbService.deleteFactura(this.facturaAEliminar.id);
      await this.cargarFacturas();
      this.exitoCarga = 'Factura eliminada correctamente.';
      setTimeout(() => this.exitoCarga = '', 2000);
    } catch (e) {
      this.errorCarga = 'Error al eliminar la factura.';
    }
    this.facturaAEliminar = null;
    this.mostrarAlertaEliminar = false;
  }

  // Calcula los días restantes para el vencimiento de una factura (8 días desde la fecha)
  getDiasRestantes(factura: Factura): number | null {
    if (!factura.fecha) return null;
  const fechaEmision = factura.fecha ? new Date(factura.fecha) : new Date();
    const hoy = new Date();
    const diffMs = hoy.getTime() - fechaEmision.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 8 - diffDias;
  }


  constructor(private route: ActivatedRoute, private dbService: DatabaseService, private sanitizer: DomSanitizer) {
    // Leer query param para mostrar facturas por vencer
    this.route.queryParams.subscribe(params => {
      if (params['porVencer'] === 'true') {
        this.mostrarPorVencer = true;
        this.categoriaSeleccionada = null;
      }
    });
    this.cargarFacturas();
  }


  async cargarFacturas() {
    try {
      const facturasDB = await this.dbService.getFacturas();
      // Mapear los campos antiguos y nuevos para asegurar compatibilidad y visualización
      this.facturas = facturasDB.map((f: any) => ({
        id: f.id_factura ?? f.id,
        folio: f.folio ?? f.cliente ?? '',
        proveedor: f.proveedor ?? '',
        tipo: f.tipo ?? '',
        responsable: f.responsable ?? '',
        monto: f.monto ?? 0,
        fechaRecepcion: f.fechaRecepcion ?? f.fecha ?? '',
        comentario: f.comentario ?? f.detalles ?? '',
        mensajeAlerta: f.mensajeAlerta ?? '',
        estado: f.estado ?? 'Pendiente',
        archivo: f.archivo,
        tipo_archivo: f.tipo_archivo,
        url_archivo: f.url_archivo,
        bitacora: f.bitacora,
        detalles: f.detalles ?? '',
        cliente: f.cliente ?? '',
        fecha: f.fecha ?? '',
        diasDesdeRecepcion: f.diasDesdeRecepcion ?? 0,
      }));
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

  // Devuelve el icono correspondiente al estado de la factura
  getIconoEstado(estado: string): string {
    switch ((estado || '').toLowerCase()) {
      case 'pendiente': return 'time-outline';
      case 'aceptada': return 'checkmark-circle-outline';
      case 'rechazada': return 'close-circle-outline';
      case 'vencida': return 'warning-outline';
      default: return 'document-text-outline';
    }
  }

  // Devuelve el color correspondiente al estado de la factura
  getColorEstado(estado: string): string {
    switch ((estado || '').toLowerCase()) {
      case 'pendiente': return 'warning';
      case 'aceptada': return 'success';
      case 'rechazada': return 'danger';
      case 'vencida': return 'medium';
      default: return 'primary';
    }
  }

  // Acción para ver detalles de la factura (puedes personalizarla)
  verFactura(factura: Factura) {
    this.abrirDetalles(factura);
  }
}