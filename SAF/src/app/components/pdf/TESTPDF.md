PS C:\Users\sadneess24\Desktop\repositories\capston3\SAF> npm run test -- --include='**/pdf.component.spec.ts'

> saf@0.0.1 test
> ng test --include=**/pdf.component.spec.ts

✔ Browser application bundle generation complete.
23 10 2025 19:28:50.096:WARN [karma]: No captured browser, open http://localhost:9876/
23 10 2025 19:28:50.115:INFO [karma-server]: Karma v6.4.4 server started at http://localhost:9876/
23 10 2025 19:28:50.115:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
23 10 2025 19:28:50.118:INFO [launcher]: Starting browser Chrome
23 10 2025 19:28:51.254:INFO [Chrome 141.0.0.0 (Windows 10)]: Connected on socket 6hSTBcvC_bLqcGkHAAAB with id 74506083
Chrome 141.0.0.0 (Windows 10) PdfComponent nextPage debería avanzar a la siguiente página FAILED
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent nextPage no debería avanzar si está en la última página FAILED                       
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent ngOnChanges debería cargar el PDF cuando cambia pdfSrc FAILED                        
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent loadPdf debería cargar y renderizar el PDF FAILED                                    
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent loadPdf debería manejar SafeResourceUrl FAILED                                       
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent loadPdf debería configurar el workerSrc correctamente FAILED                         
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent should create FAILED                                                                 
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent ngOnInit no debería cargar el PDF si pdfSrc es null FAILED                           
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent ngOnInit debería cargar el PDF si pdfSrc está definido FAILED                        
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent zoomOut debería decrementar el zoom FAILED                                           
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent zoomOut debería permitir zoom hasta 0.2 FAILED                                       
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent zoomOut no debería reducir el zoom por debajo de 0.2 FAILED                          
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent Navegación y zoom combinados debería mantener el zoom al cambiar de página FAILED    
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent Navegación y zoom combinados debería renderizar correctamente después de múltiples operaciones FAILED
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent prevPage debería retroceder a la página anterior FAILED                              
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent prevPage no debería retroceder si está en la primera página FAILED                   
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent zoomIn debería permitir múltiples incrementos de zoom FAILED                         
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent zoomIn debería incrementar el zoom FAILED                                            
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent renderPage debería renderizar la página actual FAILED                                
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent renderPage debería ajustar el canvas al tamaño del viewport FAILED                   
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10) PdfComponent renderPage no debería renderizar si no hay documento PDF FAILED                      
        Error: <spyOn> : getDocument is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.<anonymous> (src/app/components/pdf/pdf.component.spec.ts:48:5)
            at Generator.next (<anonymous>)
            at asyncGeneratorStep (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:3:1)
            at _next (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:17:1)
            at executor (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:22:1)
            at new ZoneAwarePromise (node_modules/zone.js/fesm2015/zone.js:2701:25)
            at UserContext.<anonymous> (node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js:14:1)
Chrome 141.0.0.0 (Windows 10): Executed 21 of 21 (21 FAILED) (0.02 secs / 0.011 secs)
TOTAL: 21 FAILED, 0 SUCCESS