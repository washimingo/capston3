# Sistema de Gestión de Facturas  
**Ionic v8 + Firebase v12 + TailwindCSS v4.1**

![Ionic](https://img.shields.io/badge/Ionic-v8-3880FF?logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.1-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

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
