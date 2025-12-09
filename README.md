# Sistema de Administración de Facturas (SAF)

![Ionic](https://img.shields.io/badge/Ionic-v8.7.11-3880FF?logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-v21.0.3-DD0031?logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v12.6.0-FFCA28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.1.17-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-v8.0.0-119EFF?logo=capacitor&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-v4.5.1-FF6384?logo=chartdotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Aplicación **web y móvil** para la administración y seguimiento de facturas.  
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

- [Ionic v8.7.11](https://ionicframework.com/)  
- [Angular v21.0.3](https://angular.io/)  
- [Firebase v12.6.0](https://firebase.google.com/)  
- [Capacitor v8.0.0](https://capacitorjs.com/)  
- [TailwindCSS v4.1.17](https://tailwindcss.com/)  
- [TypeScript v5.9.3](https://www.typescriptlang.org/)  
- [Chart.js v4.5.1](https://www.chartjs.org/)  
- [jsPDF v3.0.4](https://github.com/parallax/jsPDF)  
- [ExcelJS v4.4.0](https://github.com/exceljs/exceljs)  
- [ngx-translate v17.0.0](https://github.com/ngx-translate/core)  

---

## Instalación rápida

Clona el repositorio:

```bash
git clone https://github.com/washimingo/capston3.git
cd SAF
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

## Estructura de carpetas

```text
SAF/
├── src/
│   ├── app/
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── facturas-estado/     # Estado de facturas
│   │   │   ├── header/              # Componente de cabecera
│   │   │   ├── icons/               # Componente de iconos
│   │   │   ├── page-skeleton/       # Skeleton loader
│   │   │   └── pdf/                 # Generador de PDF
│   │   ├── data/                    # Datos estáticos
│   │   ├── guards/                  # Guards de rutas
│   │   │   └── auth.guard.ts        # Guard de autenticación
│   │   ├── interfaces/              # Interfaces TypeScript
│   │   │   └── tutorial.ts          # Interface de tutorial
│   │   ├── models/                  # Modelos de datos
│   │   │   ├── alerta.model.ts      # Modelo de alertas
│   │   │   └── factura.model.ts     # Modelo de facturas
│   │   ├── pages/                   # Páginas principales
│   │   │   ├── authentication/      # Autenticación
│   │   │   ├── dashboard/           # Panel de control
│   │   │   ├── invoices/            # Gestión de facturas
│   │   │   ├── reports/             # Reportes y análisis
│   │   │   ├── settings/            # Configuraciones
│   │   │   ├── tips/                # Consejos y ayuda
│   │   │   └── user/                # Gestión de usuarios
│   │   ├── pipes/                   # Pipes personalizados
│   │   │   └── por-vencer-pipe.ts   # Pipe de facturas por vencer
│   │   ├── services/                # Servicios de la aplicación
│   │   │   ├── alerta/              # Servicio de alertas
│   │   │   ├── Database/            # Servicio de base de datos
│   │   │   ├── Firebase/            # Integración con Firebase
│   │   │   └── loading/             # Servicio de loading
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/                      # Recursos estáticos
│   │   ├── icon/                    # Iconos de la aplicación
│   │   │   ├── favicon.png
│   │   │   └── logo_muni.png
│   │   ├── beep.mp3                 # Sonido de notificación
│   │   ├── beep.mp3.README.txt
│   │   └── shapes.svg
│   ├── environments/                # Variables de entorno
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── InfoTests/                   # Tests e información
│   ├── theme/                       # Estilos globales
│   │   └── variables.scss
│   ├── declarations.d.ts            # Declaraciones TypeScript
│   ├── global.scss                  # Estilos globales
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts                 # Polyfills
│   ├── test.ts                      # Configuración de tests
│   └── zone-flags.ts                # Configuración de Zone.js
├── www/                             # Build de producción
├── angular.json                     # Configuración de Angular
├── capacitor.config.ts              # Configuración de Capacitor
├── facturas_ejemplo.csv             # Archivo de ejemplo
├── ionic.config.json                # Configuración de Ionic
├── karma.conf.js                    # Configuración de Karma
├── package.json                     # Dependencias del proyecto
├── tailwind.config.js               # Configuración de TailwindCSS
├── tailwind.css                     # Estilos de Tailwind
├── tsconfig.app.json                # TypeScript config app
├── tsconfig.json                    # Configuración de TypeScript
├── tsconfig.spec.json               # TypeScript config specs
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

## Licencia

Este proyecto se distribuye bajo la licencia **MIT**.
