import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'porVencer'
})
export class PorVencerPipe implements PipeTransform {
  transform(facturas: any[]): any[] {
    if (!Array.isArray(facturas)) return [];
    const hoy = new Date();
    // Considera por vencer si el estado es 'Por vencer' o la fecha de vencimiento es en los próximos 7 días
    return facturas.filter(f => {
      if (f.estado && typeof f.estado === 'string' && f.estado.toLowerCase().includes('vencer')) {
        return true;
      }
      if (f.fechaVencimiento) {
        const fecha = new Date(f.fechaVencimiento);
        const diff = (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      }
      return false;
    });
  }
}