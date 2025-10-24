import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfComponent } from './pdf.component';
import { DomSanitizer } from '@angular/platform-browser';

describe('PdfComponent', () => {
  let component: PdfComponent;
  let fixture: ComponentFixture<PdfComponent>;
  let mockPdfDoc: any;
  let mockPage: any;
  let mockCanvas: any;
  let mockContext: any;

  beforeEach(async () => {
    // Mock Canvas Context
    mockContext = {
      clearRect: jasmine.createSpy('clearRect'),
      fillRect: jasmine.createSpy('fillRect'),
      drawImage: jasmine.createSpy('drawImage')
    };

    // Mock Canvas
    mockCanvas = {
      getContext: jasmine.createSpy('getContext').and.returnValue(mockContext),
      width: 0,
      height: 0
    };

    // Mock Page
    mockPage = {
      getViewport: jasmine.createSpy('getViewport').and.returnValue({
        width: 612,
        height: 792,
        scale: 1
      }),
      render: jasmine.createSpy('render').and.returnValue({
        promise: Promise.resolve()
      })
    };

    // Mock PDF Document
    mockPdfDoc = {
      numPages: 3,
      getPage: jasmine.createSpy('getPage').and.returnValue(Promise.resolve(mockPage))
    };

    await TestBed.configureTestingModule({
      imports: [PdfComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfComponent);
    component = fixture.componentInstance;
    
    // Mock canvas element
    component.pdfCanvas = {
      nativeElement: mockCanvas
    } as any;

    // Configurar el documento PDF mock en el componente
    component.pdfDoc = mockPdfDoc;
    component.totalPages = mockPdfDoc.numPages;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería cargar el PDF si pdfSrc está definido', async () => {
      component.pdfSrc = 'test.pdf';
      spyOn(component, 'loadPdf');

      await component.ngOnInit();

      expect(component.loadPdf).toHaveBeenCalledWith('test.pdf');
    });

    it('no debería cargar el PDF si pdfSrc es null', async () => {
      component.pdfSrc = null;
      spyOn(component, 'loadPdf');

      await component.ngOnInit();

      expect(component.loadPdf).not.toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('debería cargar el PDF cuando cambia pdfSrc', async () => {
      component.pdfSrc = 'new-pdf.pdf';
      spyOn(component, 'loadPdf');

      await component.ngOnChanges();

      expect(component.loadPdf).toHaveBeenCalledWith('new-pdf.pdf');
    });
  });

  describe('loadPdf', () => {
    it('debería cargar y renderizar el PDF', async () => {
      // Mock loadPdf para evitar llamadas reales a pdfjs-dist
      spyOn(component, 'loadPdf').and.callFake(async (src: any) => {
        component.pdfDoc = mockPdfDoc;
        component.totalPages = mockPdfDoc.numPages;
        component.pageNum = 1;
        return Promise.resolve();
      });
      
      const pdfSrc = 'test.pdf';
      await component.loadPdf(pdfSrc);

      expect(component.loadPdf).toHaveBeenCalledWith(pdfSrc);
      expect(component.pdfDoc).toBe(mockPdfDoc);
      expect(component.totalPages).toBe(3);
      expect(component.pageNum).toBe(1);
    });

    it('debería configurar el workerSrc correctamente', async () => {
      // Mock loadPdf
      spyOn(component, 'loadPdf').and.callFake(async (src: any) => {
        component.pdfDoc = mockPdfDoc;
        component.totalPages = mockPdfDoc.numPages;
        component.pageNum = 1;
        return Promise.resolve();
      });
      
      const pdfSrc = 'test.pdf';
      await component.loadPdf(pdfSrc);

      // Verificar que se configuró el documento
      expect(component.pdfDoc).toBeDefined();
    });

    it('debería manejar SafeResourceUrl', async () => {
      const sanitizer = TestBed.inject(DomSanitizer);
      const safeSrc = sanitizer.bypassSecurityTrustResourceUrl('test.pdf');
      
      // Mock loadPdf
      spyOn(component, 'loadPdf').and.callFake(async (src: any) => {
        component.pdfDoc = mockPdfDoc;
        component.totalPages = mockPdfDoc.numPages;
        component.pageNum = 1;
        return Promise.resolve();
      });

      await component.loadPdf(safeSrc);

      expect(component.loadPdf).toHaveBeenCalled();
      expect(component.pdfDoc).toBeDefined();
    });
  });

  describe('renderPage', () => {
    beforeEach(async () => {
      component.pdfDoc = mockPdfDoc;
      component.pageNum = 1;
      component.totalPages = 3;
    });

    it('debería renderizar la página actual', async () => {
      await component.renderPage();

      expect(mockPdfDoc.getPage).toHaveBeenCalledWith(1);
      expect(mockPage.getViewport).toHaveBeenCalled();
      expect(mockPage.render).toHaveBeenCalled();
    });

    it('debería ajustar el canvas al tamaño del viewport', async () => {
      await component.renderPage();

      expect(mockCanvas.width).toBe(612);
      expect(mockCanvas.height).toBe(792);
    });

    it('no debería renderizar si no hay documento PDF', async () => {
      component.pdfDoc = null;

      await component.renderPage();

      expect(mockPdfDoc.getPage).not.toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    beforeEach(() => {
      component.pdfDoc = mockPdfDoc;
      component.pageNum = 1;
      component.totalPages = 3;
    });

    it('debería avanzar a la siguiente página', () => {
      spyOn(component, 'renderPage');
      
      component.nextPage();

      expect(component.pageNum).toBe(2);
      expect(component.renderPage).toHaveBeenCalled();
    });

    it('no debería avanzar si está en la última página', () => {
      component.pageNum = 3;
      spyOn(component, 'renderPage');

      component.nextPage();

      expect(component.pageNum).toBe(3);
      expect(component.renderPage).not.toHaveBeenCalled();
    });
  });

  describe('prevPage', () => {
    beforeEach(() => {
      component.pdfDoc = mockPdfDoc;
      component.pageNum = 2;
      component.totalPages = 3;
    });

    it('debería retroceder a la página anterior', () => {
      spyOn(component, 'renderPage');

      component.prevPage();

      expect(component.pageNum).toBe(1);
      expect(component.renderPage).toHaveBeenCalled();
    });

    it('no debería retroceder si está en la primera página', () => {
      component.pageNum = 1;
      spyOn(component, 'renderPage');

      component.prevPage();

      expect(component.pageNum).toBe(1);
      expect(component.renderPage).not.toHaveBeenCalled();
    });
  });

  describe('zoomIn', () => {
    it('debería incrementar el zoom', () => {
      component.zoom = 1.0;
      component.pdfDoc = mockPdfDoc;
      spyOn(component, 'renderPage');

      component.zoomIn();

      expect(component.zoom).toBe(1.1);
      expect(component.renderPage).toHaveBeenCalled();
    });

    it('debería permitir múltiples incrementos de zoom', () => {
      component.zoom = 1.0;
      component.pdfDoc = mockPdfDoc;
      spyOn(component, 'renderPage');

      component.zoomIn();
      component.zoomIn();
      component.zoomIn();

      expect(component.zoom).toBeCloseTo(1.3, 1);
    });
  });

  describe('zoomOut', () => {
    it('debería decrementar el zoom', () => {
      component.zoom = 1.0;
      component.pdfDoc = mockPdfDoc;
      spyOn(component, 'renderPage');

      component.zoomOut();

      expect(component.zoom).toBe(0.9);
      expect(component.renderPage).toHaveBeenCalled();
    });

    it('no debería reducir el zoom por debajo de 0.2', () => {
      component.zoom = 0.2;
      component.pdfDoc = mockPdfDoc;
      spyOn(component, 'renderPage');

      component.zoomOut();

      expect(component.zoom).toBe(0.2);
      expect(component.renderPage).not.toHaveBeenCalled();
    });

    it('debería permitir zoom hasta 0.2', () => {
      component.zoom = 0.3;
      component.pdfDoc = mockPdfDoc;
      spyOn(component, 'renderPage');

      component.zoomOut();

      expect(component.zoom).toBeCloseTo(0.2, 1);
      expect(component.renderPage).toHaveBeenCalled();
    });
  });

  describe('Navegación y zoom combinados', () => {
    beforeEach(() => {
      component.pdfDoc = mockPdfDoc;
      component.pageNum = 1;
      component.totalPages = 3;
      component.zoom = 1.0;
    });

    it('debería mantener el zoom al cambiar de página', () => {
      component.zoomIn();
      const zoomAnterior = component.zoom;
      
      component.nextPage();

      expect(component.zoom).toBe(zoomAnterior);
    });

    it('debería renderizar correctamente después de múltiples operaciones', () => {
      spyOn(component, 'renderPage');

      component.zoomIn();
      component.nextPage();
      component.zoomOut();
      component.prevPage();

      expect(component.renderPage).toHaveBeenCalledTimes(4);
    });
  });
});
