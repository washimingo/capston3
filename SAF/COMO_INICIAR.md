# 🚀 INSTRUCCIONES PARA INICIAR EL SISTEMA

## ⚠️ IMPORTANTE: Necesitas 2 terminales corriendo

---

## Terminal 1: Backend (Puerto 3000)

### Pasos:
1. Abre una nueva terminal en VS Code
2. Ejecuta estos comandos:

```bash
cd /workspaces/capston3/SAF/backend-sii
npm start
```

### ✅ Deberías ver:
```
🚀 Servidor SII Backend corriendo en puerto 3000
📋 Ambiente: certificacion
```

**⚠️ NO CIERRES ESTA TERMINAL** - Déjala corriendo

---

## Terminal 2: Frontend (Puerto 4200)

### Pasos:
1. Abre OTRA terminal nueva
2. Ejecuta estos comandos:

```bash
cd /workspaces/capston3/SAF
npm start
```

### ✅ Deberías ver:
```
✔ Browser application bundle generation complete.
➜  Local:   http://localhost:4200/
```

**⚠️ NO CIERRES ESTA TERMINAL** - Déjala corriendo también

---

## 🌐 Usar la Aplicación

Una vez que AMBAS terminales estén corriendo:

1. Abre tu navegador en: **http://localhost:4200/**
2. Navega a: **http://localhost:4200/sii-config**
3. Configura tu certificado

---

## 🔍 Verificar que todo funciona

Puedes verificar que ambos servicios están corriendo con:

```bash
# En una terminal nueva:
lsof -i :3000   # Debería mostrar el backend
lsof -i :4200   # Debería mostrar el frontend
```

---

## 🐛 Si obtienes error CORS

Significa que el backend (puerto 3000) NO está corriendo.

**Solución:**
1. Ve a la terminal del backend
2. Si no está corriendo, ejecuta: `cd /workspaces/capston3/SAF/backend-sii && npm start`

---

## 📝 Resumen

```
Estado Actual:
❌ Backend (3000): NO está corriendo
❓ Frontend (4200): Verificar con lsof -i :4200

Necesitas:
✅ Terminal 1: backend-sii → npm start → Puerto 3000
✅ Terminal 2: SAF → npm start → Puerto 4200
```

---

## 🎯 Atajo Rápido

Si quieres iniciar ambos de una vez, ejecuta en terminales separadas:

**Terminal 1:**
```bash
cd /workspaces/capston3/SAF/backend-sii && npm start
```

**Terminal 2:**
```bash
cd /workspaces/capston3/SAF && npm start
```

¡Y listo! Ambos servicios estarán corriendo. 🚀
