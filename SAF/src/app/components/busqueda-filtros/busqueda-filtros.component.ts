import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonChip, IonBadge, IonSpinner } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import {
  IonIcon, IonList, IonItem, IonLabel, IonButton, IonRow, IonCol, IonInput, IonSelect, IonRefresher, IonRefresherContent, IonText, IonButtons
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-busqueda-filtros',
  templateUrl: './busqueda-filtros.component.html',
  styleUrls: ['./busqueda-filtros.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  IonIcon, IonList, IonItem, IonLabel, IonButton, IonRow, IonCol, IonInput, IonSelect,
    IonChip, IonBadge, IonSpinner
  ]
  , schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusquedaFiltrosComponent {
  @Input() categoriasResumen: any[] = [];
  @Input() categoriaSeleccionada: string | null = null;
  @Input() campoBusqueda: string = '';
  @Input() sugerenciasBusqueda: string[] = [];
  @Input() resumenPorEstado: Record<string, number> = {};

  // Sin estado local para abrir modal; se emite evento al padre.

  seleccionarCategoria(estado: string) {
    this.categoriaSeleccionada = estado;
    this.seleccionarCategoriaEvent.emit(estado);
  }
  @Output('seleccionarCategoria') seleccionarCategoriaEvent = new EventEmitter<string>();

  getIconoEstado(estado: string): string {
  // Estados de la API: Emitida, Recibida, Anulada
  const e = (estado || '').toLowerCase();
  if (e === 'emitida') return 'paper-plane-outline';
  if (e === 'recibida') return 'download-outline';
  if (e === 'anulada') return 'ban-outline';
  return 'ellipse';
  }

  seleccionarSugerencia(sugerencia: string) {
    this.filtroBusqueda = sugerencia;
    this.seleccionarSugerenciaEvent.emit(sugerencia);
  }
  @Output('seleccionarSugerencia') seleccionarSugerenciaEvent = new EventEmitter<string>();
  @Input() filtroFechaInicio: string = '';
  @Input() filtroFechaFin: string = '';
  @Input() filtroMontoMin: number | null = null;
  @Input() filtroMontoMax: number | null = null;
  @Input() filtroEstados: string[] = [];
  @Input() filtroBusqueda: string = '';
  @Input() buscandoFacturas: boolean = false;
  @Input() minCharsSugerencias: number = 2;
  mostrarSugerencias: boolean = false;

  @Output('buscarFactura') buscarEvent = new EventEmitter<string>();
  @Output('aplicarFiltrosAvanzados') filtrosAvanzadosEvent = new EventEmitter<any>();
  @Output() exportar = new EventEmitter<void>();
  @Output('abrirModalCarga') abrirModalCarga = new EventEmitter<void>();
  @Output('limpiarFiltrosAvanzados') limpiarFiltrosAvanzadosEvent = new EventEmitter<void>();
  @Output('cambiarCampoBusqueda') cambiarCampoBusqueda = new EventEmitter<string>();

  aplicarFiltrosAvanzados() {
    this.filtrosAvanzadosEvent.emit({
      fechaInicio: this.filtroFechaInicio,
      fechaFin: this.filtroFechaFin,
      montoMin: this.filtroMontoMin,
      montoMax: this.filtroMontoMax,
      estados: this.filtroEstados
    });
  }

  limpiarFiltrosAvanzados() {
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.filtroMontoMin = null;
    this.filtroMontoMax = null;
    this.filtroEstados = [];
  this.limpiarFiltrosAvanzadosEvent.emit();
  }

  onBuscarFactura() {
    this.buscandoFacturas = true;
    const texto = (this.filtroBusqueda || '').toLowerCase();
    this.buscarEvent.emit(texto);
    this.buscandoFacturas = false;
  this.actualizarVisibilidadSugerencias();
  }

  setSugerencia(sugerencia: string) {
    this.filtroBusqueda = sugerencia;
  }

  onFocusBusqueda() {
    this.actualizarVisibilidadSugerencias();
  }

  onBlurBusqueda() {
    // Delay para permitir click en ítems
    setTimeout(() => {
      this.mostrarSugerencias = false;
    }, 150);
  }

  private actualizarVisibilidadSugerencias() {
    const len = (this.filtroBusqueda || '').length;
    this.mostrarSugerencias = !this.buscandoFacturas && len >= this.minCharsSugerencias;
  }
}
