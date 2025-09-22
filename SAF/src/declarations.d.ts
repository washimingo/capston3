declare module 'pdfjs-dist/build/pdf';
declare module 'pdfjs-dist/build/pdf.worker.entry';

// Module declaration to allow global declarations
declare module '*.ts' {
  // TypeScript global declarations and interfaces for Ionic compatibility
  export interface IonInputOverride {
    autocorrect?: 'on' | 'off';
  }
  
  export interface IonSearchbarOverride {
    autocorrect?: 'on' | 'off';
  }
}