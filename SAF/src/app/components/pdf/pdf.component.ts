import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-pdf',
  template: `
    @if (pdfSrc) {
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <button (click)="prevPage()" [disabled]="pageNum <= 1">Anterior</button>
          <span>Página {{ pageNum }} / {{ totalPages }}</span>
          <button (click)="nextPage()" [disabled]="pageNum >= totalPages">Siguiente</button>
          <button (click)="zoomOut()">-</button>
          <span>Zoom: {{ (zoom * 100) | number:'1.0-0' }}%</span>
          <button (click)="zoomIn()">+</button>
        </div>
        <canvas #pdfCanvas style="border:1px solid #ccc; width:100%; max-width:100%;"></canvas>
      </div>
    }
    @if (!pdfSrc) {
      <div>
        <span>No hay PDF para mostrar.</span>
      </div>
    }
    `,
  styles: [':host { display: block; width: 100%; }'],
  standalone: true,
  imports: [CommonModule, DecimalPipe],
})
export class PdfComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pdfSrc: string | SafeResourceUrl | null = null;
  @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;

  pageNum = 1;
  totalPages = 1;
  pdfDoc: any = null;
  zoom = 1.0;

  async ngOnInit() {
    if (this.pdfSrc) {
      await this.loadPdf(this.pdfSrc);
    }
  }

  async ngOnChanges() {
    if (this.pdfSrc) {
      await this.loadPdf(this.pdfSrc);
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.pdfDoc) {
      this.pdfDoc = null;
    }
  }

  async loadPdf(src: string | SafeResourceUrl) {
    try {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;
      const loadingTask = pdfjsLib.getDocument(typeof src === 'string' ? src : (src as any).changingThisBreaksApplicationSecurity);
      this.pdfDoc = await loadingTask.promise;
      this.totalPages = this.pdfDoc.numPages;
      this.pageNum = 1;
      await this.renderPage();
    } catch (error) {
      console.error('Error al cargar PDF:', error);
    }
  }

  async renderPage() {
    if (!this.pdfDoc) return;
    
    try {
      const page = await this.pdfDoc.getPage(this.pageNum);
      const canvas = this.pdfCanvas.nativeElement;
      const context = canvas.getContext('2d')!;
      const viewport = page.getViewport({ scale: this.zoom });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error al renderizar página:', error);
    }
  }

  nextPage() {
    if (this.pageNum < this.totalPages) {
      this.pageNum++;
      this.renderPage();
    }
  }

  prevPage() {
    if (this.pageNum > 1) {
      this.pageNum--;
      this.renderPage();
    }
  }

  zoomIn() {
    this.zoom += 0.1;
    this.renderPage();
  }

  zoomOut() {
    if (this.zoom > 0.2) {
      this.zoom -= 0.1;
      this.renderPage();
    }
  }
}