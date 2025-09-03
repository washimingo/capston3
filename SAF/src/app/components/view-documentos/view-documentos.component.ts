import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonIcon, IonLabel, IonButton, IonText, IonRefresher, IonRefresherContent, IonButtons
} from '@ionic/angular/standalone';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-view-documentos',
  templateUrl: './view-documentos.component.html',
  styleUrls: ['./view-documentos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonIcon, IonLabel, IonButton, IonText
  ]
})
export class ViewDocumentosComponent implements OnInit {
  @Input() facturaSeleccionada: any = null;

  @Input() factura: any = null; // Para compatibilidad con el binding del padre

  async ngOnChanges() {
    // Sincroniza facturaSeleccionada si se usa [factura]
    if (this.factura) {
      this.facturaSeleccionada = this.factura;
    }
    if (this.pdfSrc) {
      await this.loadPdf(this.pdfSrc);
    }
  }

  getFacturaFileUrl(factura: any): string {
    // Devuelve la URL del archivo de la factura
    if (!factura || !factura.archivo) return '';
    return typeof factura.archivo === 'string' ? factura.archivo : '';
  }

  descargarArchivo(factura: any) {
    // Descarga el archivo de la factura
    const url = this.getFacturaFileUrl(factura);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = factura.archivo || 'archivo.pdf';
      link.click();
    }
  }
  @Input() fileUrl: string | SafeResourceUrl | null = null;
  @Input() pdfSrc: string | SafeResourceUrl | null = null;
  @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
  
  constructor(private sanitizer: DomSanitizer) {}
  

  pageNum = 1;
  totalPages = 1;
  pdfDoc: any = null;
  zoom = 1.0;

  async ngOnInit() {
    if (this.pdfSrc) {
      await this.loadPdf(this.pdfSrc);
    }
  }


  async loadPdf(src: string | SafeResourceUrl) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;
    const loadingTask = pdfjsLib.getDocument(typeof src === 'string' ? src : (src as any).changingThisBreaksApplicationSecurity);
    this.pdfDoc = await loadingTask.promise;
    this.totalPages = this.pdfDoc.numPages;
    this.pageNum = 1;
    this.renderPage();
  }

  async renderPage() {
    if (!this.pdfDoc) return;
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
  
  getGoogleDocsViewerUrl(fileUrl: string | SafeResourceUrl | null): string | null {
    let urlString = '';
    if (typeof fileUrl === 'string') {
      urlString = fileUrl;
    } else {
      urlString = (fileUrl as any).changingThisBreaksApplicationSecurity || '';
    }
    return 'https://docs.google.com/gview?url=' + encodeURIComponent(urlString) + '&embedded=true';
  }
}
