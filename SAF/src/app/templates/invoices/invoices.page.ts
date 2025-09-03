import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apisimulada } from 'src/app/services/api/apisimulada';
import { Factura } from 'src/app/interfaces/invoice/factura';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController, ToastController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonBadge, IonButton, IonAlert, IonMenuButton, IonButtons, IonRefresher, IonRefresherContent, IonCard, IonLabel } from '@ionic/angular/standalone';
import * as XLSX from 'xlsx';
import { BusquedaFiltrosComponent } from 'src/app/components/busqueda-filtros/busqueda-filtros.component';
import { PorVencerPipe } from 'src/app/pipes/por-vencer-pipe';
import { ViewDocumentosComponent } from 'src/app/components/view-documentos/view-documentos.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonBadge, IonButton, IonAlert, IonMenuButton, IonButtons, IonRefresher, IonRefresherContent,
    IonCard, IonLabel,
    CommonModule, FormsModule, BusquedaFiltrosComponent, PorVencerPipe
  ]
})
export class InvoicesPage {
  get facturasEmitidas() {
    return this.facturasFiltradas.filter(f => f.estado === 'Emitida');
  }
  sugerenciasBusqueda: string[] = [];
  buscandoFacturas: boolean = false;
  seleccionarSugerencia(sugerencia: string | Event) {
    if (sugerencia instanceof Event && (sugerencia.target as HTMLInputElement)?.value) {
      sugerencia = (sugerencia.target as HTMLInputElement).value;
    }
    this.filtroBusqueda = sugerencia as string;
  }

  onBuscarFactura(texto?: string) {
    if (typeof texto === 'string') {
      this.filtroBusqueda = texto;
    }
    // recalcular getter
    this.facturasFiltradas;
    // generar sugerencias en vivo
    this.sugerenciasBusqueda = this.generarSugerencias(this.filtroBusqueda, this.campoBusqueda);
  }

  exportarFacturas() {
    try {
      const datos = (this.facturasFiltradas || []).map(f => ({
        ID: f.id,
        Folio: f.folio,
        'RUT Emisor': f.rutEmisor,
        'Razón Social Emisor': f.razonSocialEmisor,
        'Monto Total': f.montoTotal,
        'Fecha Emisión': f.fechaEmision,
        Estado: f.estado,
      }));
      const hoja = XLSX.utils.json_to_sheet(datos);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, 'Facturas');
      const fecha = new Date();
      const nombre = `facturas_${fecha.getFullYear()}-${(fecha.getMonth()+1).toString().padStart(2,'0')}-${fecha.getDate().toString().padStart(2,'0')}.xlsx`;
      XLSX.writeFile(libro, nombre);
      this.mostrarToast('Exportación completada', 'success');
    } catch (e) {
      this.mostrarToast('Error al exportar', 'danger');
    }
  }

  aplicarFiltrosAvanzados(payload?: { fechaInicio?: string; fechaFin?: string; montoMin?: number | null; montoMax?: number | null; estados?: string[]; }) {
    if (payload) {
      this.filtroFechaInicio = payload.fechaInicio || '';
      this.filtroFechaFin = payload.fechaFin || '';
      this.filtroMontoMin = payload.montoMin ?? null;
      this.filtroMontoMax = payload.montoMax ?? null;
      this.filtroEstados = payload.estados || [];
    }
    this.facturasFiltradas;
  }

  limpiarFiltrosAvanzados() {
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.filtroMontoMin = null;
    this.filtroMontoMax = null;
    this.filtroEstados = [];
    this.facturasFiltradas;
  }
  private generarSugerencias(termino: string, campo: string): string[] {
    const t = (termino || '').trim().toLowerCase();
    if (!t) return [];
    const set = new Set<string>();
    for (const f of this.facturas) {
      let valor = '';
      if (campo === 'folio') valor = String(f.folio || '');
      else if (campo === 'rutEmisor') valor = f.rutEmisor || '';
      else if (campo === 'razonSocialEmisor') valor = f.razonSocialEmisor || '';
      if (!valor) continue;
      const v = valor.toString();
      if (v.toLowerCase().includes(t)) set.add(v);
      if (set.size >= 50) break;
    }
    return Array.from(set);
  }
    @Input() filtroFecha: string = '';
    @Input() filtroFechaInicio: string = '';
    @Input() filtroFechaFin: string = '';
    @Input() filtroMontoMin: number | null = null;
    @Input() filtroMontoMax: number | null = null;
    @Input() filtroEstados: string[] = [];
    @Input() filtroBusqueda: string = '';
    @Input() campoBusqueda: string = 'folio';
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validarYSeleccionarArchivo(input.files[0]);
    }
  }
  editandoFactura: any = null;
  facturaEditada: any = {};
  abrirDrawerEditar: boolean = false;
  facturaAEliminar: any = null;
  mostrarAlertaEliminar: boolean = false;
  errorCarga: string = '';
  exitoCarga: string = '';
  archivoSeleccionado: File | null = null;
  excelPreviewData: any[][] | null = null;
  excelPreviewError: string = '';
  private pendingDetalleId: string | null = null;
  
  // Loader y autocompletado
  alertEliminarButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => { this.mostrarAlertaEliminar = false; }
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => { this.mostrarAlertaEliminar = false; }
    }
  ];
  abrirModalCarga: boolean = false;
  archivoBase64: string | null = null;
  facturas: Factura[] = [];
  // Carga manual de facturas
  nuevaFactura: Partial<Factura> = {
    folio: undefined,
    rutEmisor: '',
    razonSocialEmisor: '',
    montoTotal: undefined,
    fechaEmision: '',
    estado: 'Pendiente'
  };

  // Maneja el drop de archivos en el área drag & drop
  onDropFile(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.validarYSeleccionarArchivo(file);
    }
  }

  // Valida y selecciona el archivo (usado por input y drag&drop)
  validarYSeleccionarArchivo(file: File | null) {
    if (!file || !file.name) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
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
    private apiSimulada: Apisimulada,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
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
      } else {
        this.categoriaSeleccionada = null;
        this.filtroFecha = '';
        this.mostrarPorVencer = false;
      }
      if (params['abrirDetalle'] === 'true' && params['facturaId']) {
        this.pendingDetalleId = String(params['facturaId']);
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
    if (!this.nuevaFactura.folio || !this.nuevaFactura.rutEmisor || !this.nuevaFactura.razonSocialEmisor || !this.nuevaFactura.montoTotal || !this.nuevaFactura.fechaEmision) {
      this.errorCarga = 'Debe completar todos los campos obligatorios.';
      await this.mostrarToast(this.errorCarga, 'danger');
      return;
    }
    const nuevaFactura: Partial<Factura> = {
      folio: Number(this.nuevaFactura.folio!),
      rutEmisor: this.nuevaFactura.rutEmisor!,
      razonSocialEmisor: this.nuevaFactura.razonSocialEmisor!,
      montoTotal: Number(this.nuevaFactura.montoTotal!),
      fechaEmision: this.nuevaFactura.fechaEmision!,
      estado: 'Pendiente',
    };
    this.apiSimulada.crearFactura(nuevaFactura).subscribe({
      next: (factura) => {
        this.exitoCarga = 'Factura cargada exitosamente.';
        this.mostrarToast(this.exitoCarga, 'success');
        this.cargarFacturas();
      },
      error: (error) => {
        this.errorCarga = 'Error al guardar la factura en la API.';
        this.mostrarToast(this.errorCarga, 'danger');
      }
    });
    this.nuevaFactura = {
      folio: undefined,
      rutEmisor: '',
      razonSocialEmisor: '',
      montoTotal: undefined,
      fechaEmision: '',
      estado: 'Pendiente'
    };
    setTimeout(() => this.exitoCarga = '', 2500);
    this.abrirModalCarga = false;
  }

  cerrarModalCarga() {
    this.nuevaFactura = {
      folio: undefined,
      rutEmisor: '',
      razonSocialEmisor: '',
      montoTotal: undefined,
      fechaEmision: '',
      estado: 'Pendiente'
    };
    this.errorCarga = '';
    this.exitoCarga = '';
  }

  // Devuelve una URL de objeto/base64 para visualizar el archivo adjunto (solo para facturas cargadas en la sesión actual)
  getFacturaFileUrl(factura: Factura): SafeResourceUrl | null {
  // Eliminado: la API no provee archivos
  return null;
  }

  categoriasResumen = [
  { nombre: 'Emitidas', estado: 'Emitida', color: 'primary' },
  { nombre: 'Recibidas', estado: 'Recibida', color: 'success' },
  { nombre: 'Anuladas', estado: 'Anulada', color: 'danger' },
  ];

  categoriaSeleccionada: string | null = null;
  mostrarPorVencer: boolean = false;

  getFacturasFiltradas(): Factura[] {
    let facturasFiltradas: Factura[] = [...this.facturas];
    const hoy = new Date();

    // Filtro por fecha exacta
    if (this.filtroFecha) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fecha = (f.fechaEmision || '').slice(0, 10);
        return fecha === this.filtroFecha;
      });
    }

    // Filtro avanzado: rango de fechas
    if (this.filtroFechaInicio) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fecha = (f.fechaEmision || '').slice(0, 10);
        return fecha >= this.filtroFechaInicio;
      });
    }
    if (this.filtroFechaFin) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        const fecha = (f.fechaEmision || '').slice(0, 10);
        return fecha <= this.filtroFechaFin;
      });
    }

    // Filtro avanzado: monto mínimo/máximo
    if (this.filtroMontoMin !== null && this.filtroMontoMin !== undefined) {
      facturasFiltradas = facturasFiltradas.filter(f => f.montoTotal >= this.filtroMontoMin!);
    }
    if (this.filtroMontoMax !== null && this.filtroMontoMax !== undefined) {
      facturasFiltradas = facturasFiltradas.filter(f => f.montoTotal <= this.filtroMontoMax!);
    }

    // Filtro avanzado: estado múltiple
    if (this.filtroEstados && this.filtroEstados.length > 0) {
      facturasFiltradas = facturasFiltradas.filter(f => this.filtroEstados.includes(f.estado));
    }

    // Filtro por categoría seleccionada
    if (this.categoriaSeleccionada) {
      facturasFiltradas = facturasFiltradas.filter(f =>
        f.estado && f.estado.toLowerCase() === this.categoriaSeleccionada!.toLowerCase()
      );
    }

    // Filtro por facturas por vencer
    if (this.mostrarPorVencer) {
      facturasFiltradas = facturasFiltradas.filter(f => {
        if (f.estado && f.estado.toLowerCase() === 'pendiente') {
          const fechaEmision = f.fechaEmision || '';
          if (!fechaEmision) return false;
          const diffMs = hoy.getTime() - new Date(fechaEmision).getTime();
          const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diasRestantes = 8 - diffDias;
          return diasRestantes <= 2 && diasRestantes > 0;
        }
        return false;
      });
    }

    // Filtro por búsqueda textual
    if (this.filtroBusqueda && this.filtroBusqueda.trim() !== '') {
      const texto = this.filtroBusqueda.trim().toLowerCase();
      const esc = texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(esc, 'i');
      if (this.campoBusqueda === 'folio') {
        facturasFiltradas = facturasFiltradas.filter(f => f.folio !== undefined && regex.test(String(f.folio)));
      } else if (this.campoBusqueda === 'rutEmisor') {
        facturasFiltradas = facturasFiltradas.filter(f => f.rutEmisor && regex.test(f.rutEmisor));
      } else if (this.campoBusqueda === 'razonSocialEmisor') {
        facturasFiltradas = facturasFiltradas.filter(f => f.razonSocialEmisor && regex.test(f.razonSocialEmisor));
      } else {
        facturasFiltradas = facturasFiltradas.filter(f =>
          (f.folio !== undefined && regex.test(String(f.folio))) ||
          (f.rutEmisor && regex.test(f.rutEmisor)) ||
          (f.razonSocialEmisor && regex.test(f.razonSocialEmisor))
        );
      }
    }

    // Ordenar: primero por las que están por vencer (menos días para vencer), luego por fecha de emisión descendente
    return facturasFiltradas.sort((a, b) => {
      const getDiasRestantes = (factura: Factura) => {
        const fechaEmision = factura.fechaEmision || '';
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
      const fechaA = new Date(a.fechaEmision || 0).getTime();
      const fechaB = new Date(b.fechaEmision || 0).getTime();
      return fechaB - fechaA;
    });
  }

  seleccionarCategoria(estado: string | Event) {
    if (estado instanceof Event && (estado.target as HTMLInputElement)?.value) {
      estado = (estado.target as HTMLInputElement).value;
    }
    this.mostrarPorVencer = false;
    this.filtroFecha = '';
    if (this.categoriaSeleccionada === estado) {
      this.categoriaSeleccionada = null;
    } else {
      this.categoriaSeleccionada = estado as string;
    }
  }

  getResumenCount(estado: string): number {
    return this.facturas.filter(f =>
      f.estado && f.estado.toLowerCase() === estado.toLowerCase()
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
  // Eliminado: la API no provee archivos ni vista previa de Excel
  this.facturaSeleccionadaTabla = factura;
    // Scroll hacia la fila seleccionada
    setTimeout(() => {
      try {
        const el = document.getElementById(`row-${factura.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch {}
    }, 0);
  }
  cerrarDetalles() {
    this.facturaSeleccionada = null;
    this.excelPreviewData = null;
    this.excelPreviewError = '';
  this.facturaSeleccionadaTabla = null;
  }

  // Iniciar edición de factura
  editarFactura(factura: Factura) {
    this.editandoFactura = { ...factura };
    this.facturaEditada = {
      folio: factura.folio,
      rutEmisor: factura.rutEmisor,
      razonSocialEmisor: factura.razonSocialEmisor,
      montoTotal: factura.montoTotal,
      fechaEmision: factura.fechaEmision,
      estado: factura.estado
    };
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
      const cambios: Partial<Factura> = {
        folio: Number(this.facturaEditada.folio),
        rutEmisor: this.facturaEditada.rutEmisor,
        razonSocialEmisor: this.facturaEditada.razonSocialEmisor,
        montoTotal: Number(this.facturaEditada.montoTotal),
        fechaEmision: this.facturaEditada.fechaEmision,
        estado: this.facturaEditada.estado,
      };
  this.apiSimulada.actualizarFactura(id_factura, cambios.estado ?? '').subscribe({
        next: () => {
          this.editandoFactura = null;
          this.facturaEditada = {};
          this.archivoSeleccionado = null;
          this.abrirDrawerEditar = false;
          this.cargarFacturas();
          this.exitoCarga = 'Factura editada correctamente.';
          this.mostrarToast(this.exitoCarga, 'success');
          setTimeout(() => this.exitoCarga = '', 2000);
        },
        error: () => {
          this.errorCarga = 'Error al editar la factura.';
          this.mostrarToast(this.errorCarga, 'danger');
        }
      });
    } catch (e) {
      this.errorCarga = 'Error al editar la factura.';
      this.mostrarToast(this.errorCarga, 'danger');
    }
  }

  cancelarEdicion() {
    if (!this.editandoFactura) return;
    try {
      const id_factura = this.editandoFactura.id;
      const cambios: Partial<Factura> = {
        folio: Number(this.facturaEditada.folio),
        rutEmisor: this.facturaEditada.rutEmisor,
        razonSocialEmisor: this.facturaEditada.razonSocialEmisor,
        montoTotal: Number(this.facturaEditada.montoTotal),
        fechaEmision: this.facturaEditada.fechaEmision,
        estado: this.facturaEditada.estado,
      };
  this.apiSimulada.actualizarFactura(id_factura, cambios.estado ?? '').subscribe({
        next: () => {
          this.editandoFactura = null;
          this.facturaEditada = {};
          this.archivoSeleccionado = null;
          this.abrirDrawerEditar = false;
          this.cargarFacturas();
          this.exitoCarga = 'Factura editada correctamente.';
          this.mostrarToast(this.exitoCarga, 'success');
          setTimeout(() => this.exitoCarga = '', 2000);
        },
        error: () => {
          this.errorCarga = 'Error al editar la factura.';
          this.mostrarToast(this.errorCarga, 'danger');
        }
      });
    } catch (e) {
      this.errorCarga = 'Error al editar la factura.';
      this.mostrarToast(this.errorCarga, 'danger');
    }
  }

  // Calcula los días restantes para el vencimiento de una factura (8 días desde la fecha de emisión o recepción)
  getDiasRestantes(factura: Factura | null | undefined): number | null {
  if (!factura) return null;
  const fechaBase = factura.fechaEmision || null;
  if (!fechaBase) return null;
  const fechaEmision = new Date(fechaBase);
  if (isNaN(fechaEmision.getTime())) return null;
  const hoy = new Date();
  fechaEmision.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);
  const diffMs = hoy.getTime() - fechaEmision.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return 8 - diffDias;
  }


  async cargarFacturas() {
    try {
      this.apiSimulada.getFacturas().subscribe({
        next: (data) => {
          if (data && Array.isArray(data.facturas)) {
            this.facturas = data.facturas;
          } else if (Array.isArray(data)) {
            this.facturas = data;
          } else {
            this.facturas = [];
          }
          // Abrir detalle si viene solicitado desde Home
          if (this.pendingDetalleId) {
            const f = this.facturas.find(x => String(x.id) === String(this.pendingDetalleId));
            if (f) {
              this.abrirDetalles(f);
            }
            this.pendingDetalleId = null;
          }
        },
        error: (error) => {
          this.facturas = [];
        }
      });
    } catch (e) {
      this.facturas = [];
    }
  }
  async mostrarFacturasGuardadas() {
  alert('Esta función ya no está disponible. Las facturas se obtienen desde la API.');
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
  factura.estado = 'Aceptada';
  this.guardarEdicion();
  }

  // Acción rápida para rechazar factura
  async rechazarFactura(factura: Factura) {
  factura.estado = 'Rechazada';
  this.guardarEdicion();
  }

  // Acción para marcar como vencida (puede ser automática, pero también manual)
  marcarVencida(factura: Factura) {
  factura.estado = 'Vencida';
  this.guardarEdicion();
  }

  // Método para actualizar una factura (usado en rechazarFactura)
  async actualizarFactura(factura: Factura) {
    try {
      this.apiSimulada.actualizarFactura(factura.id, factura.estado).subscribe({
        next: () => {
          this.cargarFacturas();
          this.exitoCarga = 'Factura actualizada correctamente.';
          this.mostrarToast(this.exitoCarga, 'success');
          setTimeout(() => this.exitoCarga = '', 2000);
        },
        error: () => {
          this.errorCarga = 'Error al actualizar la factura.';
          this.mostrarToast(this.errorCarga, 'danger');
        }
      });
    } catch (e) {
      this.errorCarga = 'Error al actualizar la factura.';
      this.mostrarToast(this.errorCarga, 'danger');
    }
  }


  descargarArchivo(factura: Factura | Event) {
  // Eliminado: la API no provee archivos
  return;
  }

  async refrescar(event: any) {
    await this.cargarFacturas();
    event.target.complete();
  }

  facturaSeleccionadaTabla: Factura | null = null;

  seleccionarFacturaTabla(factura: Factura) {
    if (this.facturaSeleccionadaTabla && this.facturaSeleccionadaTabla.id === factura.id) {
      this.facturaSeleccionadaTabla = null;
    } else {
      this.facturaSeleccionadaTabla = factura;
    }
  }
}
