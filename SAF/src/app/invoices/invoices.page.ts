import * as XLSX from 'xlsx';
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
  IonChip,
  IonAlert,
  IonRow,
  IonCol,
  IonInput,
  IonSpinner,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  ToastController
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
    IonInput,
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
    IonAlert,
    IonRow,
    IonCol,
    IonSpinner,
    IonMenuButton,
    IonRefresher,
    IonRefresherContent
  ]
})
export class InvoicesPage {
  // Variables para vista previa de Excel
  excelPreviewData: any[][] | null = null;
  excelPreviewError: string = '';
  // Loader y autocompletado
  buscandoFacturas: boolean = false;
  sugerenciasBusqueda: string[] = [];

  // Método para manejar la búsqueda reactiva desde el campo de búsqueda
  onBuscarFactura() {
    this.buscandoFacturas = true;
    setTimeout(() => {
      const texto = (this.filtroBusqueda || '').toLowerCase();
      if (texto.length > 0) {
        // Usar reduce en vez de flat para compatibilidad
        const campos = this.facturas
          .map(f => [f.folio, f.proveedor, f.tipo, f.responsable])
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
    if (!['pdf', 'xml', 'jpg', 'jpeg', 'png', 'xlsx'].includes(ext)) {
      this.errorCarga = 'Solo se permiten archivos PDF, XML, imágenes o Excel (.xlsx).';
      this.exitoCarga = '';
      this.archivoSeleccionado = null;
      return;
    }
    this.archivoSeleccionado = file;
    this.errorCarga = '';
  }

  constructor(
    private route: ActivatedRoute,
    private dbService: DatabaseService,
    private sanitizer: DomSanitizer,
    private toastController: ToastController
  ) {
    // Leer query param para mostrar facturas por vencer
    this.route.queryParams.subscribe(params => {
      if (params['porVencer'] === 'true') {
        this.mostrarPorVencer = true;
        this.categoriaSeleccionada = null;
      }
    });
    this.cargarFacturas();
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }

  async onSubmitFactura(event: Event) {
    event.preventDefault();
    this.errorCarga = '';
    this.exitoCarga = '';
    if (!this.archivoSeleccionado) {
      this.errorCarga = 'Debe seleccionar un archivo válido.';
      await this.mostrarToast(this.errorCarga, 'danger');
      return;
    }
    if (!this.nuevaFactura.folio || !this.nuevaFactura.proveedor || !this.nuevaFactura.tipo || !this.nuevaFactura.responsable || !this.nuevaFactura.monto || !this.nuevaFactura.fechaRecepcion) {
      this.errorCarga = 'Debe completar los campos obligatorios.';
      await this.mostrarToast(this.errorCarga, 'danger');
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
        await this.mostrarToast(this.exitoCarga, 'success');
        await this.cargarFacturas();
      } catch (e) {
        this.errorCarga = 'Error al guardar la factura en la base de datos.';
        await this.mostrarToast(this.errorCarga, 'danger');
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
  let facturasFiltradas: Factura[] = [];
  const hoy = new Date();
    // 1. Si hay categoría seleccionada, filtrar por estado primero
    if (this.mostrarPorVencer) {
      facturasFiltradas = this.facturas.filter(f => {
        if (f.estado && f.estado.toLowerCase() === 'pendiente') {
          const fechaEmision = f.fechaRecepcion || f.fecha || '';
          if (!fechaEmision) return false;
          const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diasRestantes = 8 - diffDias;
          return diasRestantes <= 2 && diasRestantes > 0;
        }
        return false;
      });
    } else if (this.categoriaSeleccionada) {
      facturasFiltradas = this.facturas.filter(f =>
        f.estado.toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
      );
    } else {
      facturasFiltradas = [...this.facturas];
    }

    // 2. Si hay texto de búsqueda, mostrar solo los que coinciden en el campo seleccionado
    if (this.filtroBusqueda && this.filtroBusqueda.trim() !== '') {
      const texto = this.filtroBusqueda.trim().toLowerCase();
      // Expresión regular para coincidencia exacta de palabra (al inicio, final o separada)
      const regex = new RegExp(`(^|\s|\W)${texto}($|\s|\W)`, 'i');
      if (this.campoBusqueda === 'folio') {
        facturasFiltradas = facturasFiltradas.filter(f => f.folio && regex.test(f.folio));
      } else if (this.campoBusqueda === 'proveedor') {
        facturasFiltradas = facturasFiltradas.filter(f => f.proveedor && regex.test(f.proveedor));
      } else if (this.campoBusqueda === 'responsable') {
        facturasFiltradas = facturasFiltradas.filter(f => f.responsable && regex.test(f.responsable));
      } else {
        facturasFiltradas = facturasFiltradas.filter(f =>
          (f.folio && regex.test(f.folio)) ||
          (f.proveedor && regex.test(f.proveedor)) ||
          (f.responsable && regex.test(f.responsable))
        );
      }
    }


    // Ordenar: primero por las que están por vencer (menos días para vencer), luego por fecha de emisión descendente
    return facturasFiltradas.sort((a, b) => {
      // Calcular días restantes para cada factura
      const getDiasRestantes = (factura: Factura) => {
        const fechaEmision = factura.fechaRecepcion || factura.fecha || '';
        if (!fechaEmision) return 9999;
        const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return 8 - diffDias;
      };
      const diasA = getDiasRestantes(a);
      const diasB = getDiasRestantes(b);
      // Prioridad: por vencer primero (díasRestantes > 0 y <= 2)
      const aPorVencer = diasA > 0 && diasA <= 2;
      const bPorVencer = diasB > 0 && diasB <= 2;
      if (aPorVencer && !bPorVencer) return -1;
      if (!aPorVencer && bPorVencer) return 1;
      // Si ambos son por vencer o ninguno, ordenar por fecha de emisión descendente
      const fechaA = new Date(a.fechaRecepcion || a.fecha || 0).getTime();
      const fechaB = new Date(b.fechaRecepcion || b.fecha || 0).getTime();
      return fechaB - fechaA;
    });
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
  async abrirDetalles(factura: Factura) {
    this.facturaSeleccionada = factura;
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
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const workbook = XLSX.read(bytes, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheet];
        const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        this.excelPreviewData = data;
      } catch (e) {
        this.excelPreviewError = 'No se pudo mostrar la vista previa del Excel.';
      }
    }
  }
  cerrarDetalles() {
    this.facturaSeleccionada = null;
    this.excelPreviewData = null;
    this.excelPreviewError = '';
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
          await this.mostrarToast(this.exitoCarga, 'success');
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
      await this.mostrarToast(this.exitoCarga, 'success');
      setTimeout(() => this.exitoCarga = '', 2000);
    } catch (e) {
      this.errorCarga = 'Error al editar la factura.';
      await this.mostrarToast(this.errorCarga, 'danger');
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
      await this.mostrarToast(this.exitoCarga, 'success');
      setTimeout(() => this.exitoCarga = '', 2000);
    } catch (e) {
      this.errorCarga = 'Error al eliminar la factura.';
      await this.mostrarToast(this.errorCarga, 'danger');
    }
    this.facturaAEliminar = null;
    this.mostrarAlertaEliminar = false;
  }

  // Cambia el estado de una factura (aceptar, rechazar, marcar vencida)
  async cambiarEstadoFactura(
    factura: Factura,
    nuevoEstado: 'Aceptada' | 'Rechazada' | 'Vencida',
    comentario: string = ''
  ) {
    try {
      await this.dbService.cambiarEstadoFactura(factura.id, nuevoEstado, 'usuario demo', comentario);
      await this.cargarFacturas();
      let mensaje = '';
      if (nuevoEstado === 'Aceptada') mensaje = 'Factura aceptada correctamente.';
      if (nuevoEstado === 'Rechazada') mensaje = 'Factura rechazada correctamente.';
      if (nuevoEstado === 'Vencida') mensaje = 'Factura marcada como vencida.';
      await this.mostrarToast(
        mensaje,
        nuevoEstado === 'Aceptada'
          ? 'success'
          : nuevoEstado === 'Rechazada'
          ? 'danger'
          : 'medium'
      );
    } catch (e) {
      await this.mostrarToast('Error al cambiar el estado de la factura.', 'danger');
    }
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
    fechaEmision.setHours(0,0,0,0);
    hoy.setHours(0,0,0,0);
    const diffMs = hoy.getTime() - fechaEmision.getTime();
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 8 - diffDias;
  }


  async cargarFacturas() {
    try {
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

  // Acción rápida para aceptar factura
  aceptarFactura(factura: Factura) {
    this.cambiarEstadoFactura(factura, 'Aceptada');
  }

  // Acción rápida para rechazar factura
  rechazarFactura(factura: Factura) {
    const motivo = prompt('Ingrese el motivo del rechazo:') || '';
    this.cambiarEstadoFactura(factura, 'Rechazada', motivo);
  }

  // Acción para marcar como vencida (puede ser automática, pero también manual)
  marcarVencida(factura: Factura) {
    this.cambiarEstadoFactura(factura, 'Vencida');
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
}