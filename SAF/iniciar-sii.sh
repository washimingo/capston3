#!/bin/bash

echo "🚀 Iniciando integración SII..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar si un puerto está en uso
check_port() {
    lsof -i:$1 > /dev/null 2>&1
    return $?
}

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js detectado:${NC} $(node --version)"
echo ""

# Verificar si las dependencias están instaladas
if [ ! -d "backend-sii/node_modules" ]; then
    echo -e "${BLUE}📦 Instalando dependencias del backend...${NC}"
    cd backend-sii
    npm install
    cd ..
    echo ""
fi

# Verificar si el puerto 3000 está disponible
if check_port 3000; then
    echo -e "${YELLOW}⚠️  El puerto 3000 ya está en uso${NC}"
    echo "Por favor cierra la aplicación que está usando el puerto 3000 o cambia el puerto en backend-sii/server.js"
    exit 1
fi

# Iniciar el backend en segundo plano
echo -e "${BLUE}🔧 Iniciando servidor backend en puerto 3000...${NC}"
cd backend-sii
npm start &
BACKEND_PID=$!
cd ..

# Esperar a que el backend inicie
sleep 3

# Verificar que el backend está corriendo
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend corriendo (PID: $BACKEND_PID)${NC}"
else
    echo -e "${YELLOW}⚠️  Error al iniciar el backend${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Sistema listo para usar${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📋 Siguiente paso:${NC}"
echo "   1. Inicia tu app Ionic con: npm start"
echo "   2. Navega a: http://localhost:8100/sii-config"
echo "   3. Configura tu certificado .pfx"
echo ""
echo -e "${BLUE}📚 Documentación:${NC}"
echo "   - Guía rápida: INICIO_RAPIDO_SII.md"
echo "   - Detalles: INTEGRACION_SII.md"
echo "   - Arquitectura: ARQUITECTURA_SII.md"
echo ""
echo -e "${YELLOW}Para detener el backend, ejecuta:${NC}"
echo "   kill $BACKEND_PID"
echo ""
echo -e "${YELLOW}O presiona Ctrl+C${NC}"
echo ""

# Mantener el script corriendo
wait $BACKEND_PID
