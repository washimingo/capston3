PS C:\Users\sadneess24\Desktop\repositories\capston3\SAF> npm run test -- --include='**/firedb.spec.ts'

> saf@0.0.1 test
> ng test --include=**/firedb.spec.ts

✔ Browser application bundle generation complete.
23 10 2025 19:14:44.964:WARN [karma]: No captured browser, open http://localhost:9876/
23 10 2025 19:14:44.982:INFO [karma-server]: Karma v6.4.4 server started at http://localhost:9876/
23 10 2025 19:14:44.982:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
23 10 2025 19:14:44.986:INFO [launcher]: Starting browser Chrome
23 10 2025 19:14:46.092:INFO [Chrome 141.0.0.0 (Windows 10)]: Connected on socket gNTIAgMVpqNb-q4fAAAB with id 7354547
Chrome 141.0.0.0 (Windows 10) Firedb Service logout debería limpiar el usuario actual al cerrar sesión FAILED
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service logout debería cerrar sesión correctamente FAILED
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service login debería manejar error de demasiados intentos FAILED                                
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service login debería manejar error de red FAILED                                                
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service login debería lanzar error con credenciales inválidas FAILED                             
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service login debería manejar error de contraseña incorrecta FAILED                              
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service login debería manejar error de email inválido FAILED                                     
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service login debería iniciar sesión correctamente con credenciales válidas FAILED               
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service login debería manejar error de usuario no encontrado FAILED                              
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service getCurrentUser debería retornar null si no hay sesión FAILED                             
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service getCurrentUser debería retornar el usuario actual FAILED                                 
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service should be created FAILED                                                                 
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service getAuthState debería retornar un Observable del estado de autenticación FAILED           
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service isAuthenticated debería retornar true si hay usuario autenticado FAILED                  
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10) Firedb Service isAuthenticated debería retornar false si no hay usuario autenticado FAILED              
        Error: <spyOn> : getAuth is not declared writable or has no setter
        Usage: spyOn(<object>, <methodName>)
            at <Jasmine>
            at UserContext.apply (src/app/services/Firefiredb.spec.ts:42:5)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:398:28)
            at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:2132:39)
            at _ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:397:34)
            at ZoneImpl.run (node_modules/zone.js/fesm2015/zone.js:113:43)
            at runInTestZone (node_modules/zone.js/fesm2015/zone-testing.js:216:38)
            at UserContext.<anonymous> (node_modules/zone.js/fesm2015/zone-testing.js:234:32)
Chrome 141.0.0.0 (Windows 10): Executed 15 of 15 (15 FAILED) (0.111 secs / 0.008 secs)                                                
TOTAL: 15 FAILED, 0 SUCCESS