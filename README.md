# Sistema de Gestión de Facturas  
**Ionic v8 + Firebase v12 + TailwindCSS v4.1**

Aplicación **web y móvil** para la gestión y seguimiento de facturas.  
Permite listar facturas, enviar notificaciones (email, push o dentro de la app), acceder a un **dashboard interactivo**, generar reportes y configurar tanto la aplicación como los usuarios de forma flexible.

---

##  Características

- Listado, filtrado y búsqueda de facturas  
- Notificaciones automáticas (email, push, interno) cuando vence una factura  
- Dashboard con métricas (cantidad, vencidas, próximas, ingresos, etc.)  
- Generación de reportes personalizables  
- Panel de configuración de la aplicación (parámetros, notificaciones, plantillas)  
- Módulo de gestión de usuarios y roles  
- Interfaz responsiva con **TailwindCSS**  
- Autenticación con **Firebase** y seguridad basada en roles/permisos  

---

## Tecnologías principales

- [Ionic v8](https://ionicframework.com/)  
- [Firebase v12](https://firebase.google.com/)  
- [TailwindCSS v4.1](https://tailwindcss.com/)  
- [Angular](https://angular.io/)  
- Capacitor / AngularFire / TypeScript  

---

## Instalación rápida

Clona el repositorio:

```bash
git clone <url_de_este_repositorio>
cd <carpeta_del_repositorio>
```

Instala dependencias:

```bash
npm install node
```

Ejecuta en desarrollo:

```bash
ionic serve
# O bien
npm start
# O también
ng serve
```

---

## Comandos útiles

### Build producción
```bash
ionic build --prod
```

### Deploy a Firebase Hosting
```bash
npm run build
firebase deploy
```

### Capacitor sync
```bash
npx cap sync
```

---

## Estructura de carpetas básica

```text
├── src/
│   ├── app/
│   ├── environments/
│   ├── assets/
│   ├── styles/
├── tailwind.config.js
├── package.json
└── README.md
```

## Reportes y Dashboard

- Dashboard disponible en: **`/dashboard`**  
- Generador de reportes en: **`/reportes`** con exportación a **PDF y Excel**  
- Widgets y métricas personalizables desde la configuración avanzada  

---

## Seguridad y autenticación

- Firebase Authentication (email/password, Google, etc.)  (Proximamente a implementar) 
- Guards en Angular para proteger rutas sensibles  (Proximamente a implementar) 
- Reglas de seguridad en Firestore para acceso seguro   (Proximamente a implementar) 

---

---

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**.  
Consulta el archivo [LICENSE](./LICENSE) para más detalles.
