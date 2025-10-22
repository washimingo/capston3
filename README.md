# Sistema de Administración de Facturas (SAF)

![Ionic](https://img.shields.io/badge/Ionic-v8.7.6-3880FF?logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-v20.3.4-DD0031?logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v12.4.0-FFCA28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.1.14-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)
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

- [Ionic v8.7.6](https://ionicframework.com/)  
- [Angular v20.3.4](https://angular.io/)  
- [Firebase v12.4.0](https://firebase.google.com/)  
- [TailwindCSS v4.1.14](https://tailwindcss.com/)  
- [TypeScript v5.9.3](https://www.typescriptlang.org/)  

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
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── facturas-estado/  # Estado de facturas
│   │   │   ├── header/           # Componente de cabecera
│   │   │   └── pdf/              # Generador de PDF
│   │   ├── models/               # Modelos de datos
│   │   │   ├── alerta.model.ts
│   │   │   └── factura.model.ts
│   │   ├── pages/                # Páginas principales
│   │   │   ├── dashboard/        # Panel de control
│   │   │   ├── home/             # Página de inicio
│   │   │   ├── invoices/         # Gestión de facturas
│   │   │   ├── reports/          # Reportes y análisis
│   │   │   ├── settings/         # Configuraciones
│   │   │   ├── tips/             # Consejos y ayuda
│   │   │   └── user/             # Gestión de usuarios
│   │   ├── pipes/                # Pipes personalizados
│   │   │   └── por-vencer-pipe.ts
│   │   ├── services/             # Servicios de la aplicación
│   │   │   ├── alerta/           # Servicio de alertas
│   │   │   ├── Database/         # Servicio de base de datos
│   │   │   └── Firebase/         # Integración con Firebase
│   │   ├── app.component.*
│   │   └── app.routes.ts
│   ├── assets/                   # Recursos estáticos
│   │   ├── i18n/                 # Archivos de internacionalización
│   │   │   ├── en.json           # Inglés
│   │   │   └── es.json           # Español
│   │   ├── icon/                 # Iconos de la aplicación
│   │   │   ├── favicon.png
│   │   │   └── logo_muni.jpg
│   │   ├── beep.mp3              # Sonidos de notificación
│   │   └── shapes.svg
│   ├── environments/             # Variables de entorno
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── theme/                    # Estilos globales
│   │   └── variables.scss
│   ├── global.scss
│   ├── index.html
│   └── main.ts
├── angular.json                  # Configuración de Angular
├── capacitor.config.ts           # Configuración de Capacitor
├── ionic.config.json             # Configuración de Ionic
├── package.json                  # Dependencias del proyecto
├── tailwind.config.js            # Configuración de TailwindCSS
├── tailwind.css                  # Estilos de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
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
