#!/bin/bash

echo "🔍 Diagnóstico de la aplicación SAF"
echo "=================================="
echo ""

# Verificar directorio actual
echo "📁 Directorio actual: $(pwd)"
echo ""

# Verificar si estamos en la carpeta SAF
if [[ $(pwd) == *"/SAF"* ]] || [[ -f "angular.json" ]]; then
    echo "✅ Estás en la carpeta correcta"
else
    echo "❌ No estás en la carpeta SAF"
    echo "   Ejecuta: cd /workspaces/capston3/SAF"
    exit 1
fi
echo ""

# Verificar node_modules
if [ -d "node_modules" ]; then
    echo "✅ node_modules encontrado"
else
    echo "⚠️  node_modules no encontrado"
    echo "   Ejecutando: npm install"
    npm install
fi
echo ""

# Verificar procesos en puertos
echo "🔍 Verificando puertos..."
if lsof -i :4200 > /dev/null 2>&1; then
    echo "⚠️  Puerto 4200 en uso"
    PID=$(lsof -ti :4200)
    echo "   PID: $PID"
    read -p "   ¿Quieres cerrarlo? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill -9 $PID
        echo "   ✅ Proceso cerrado"
    fi
else
    echo "✅ Puerto 4200 libre"
fi
echo ""

if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Backend SII corriendo en puerto 3000"
else
    echo "⚠️  Backend SII no está corriendo"
    echo "   Para iniciarlo: cd backend-sii && npm start"
fi
echo ""

# Verificar errores de compilación
echo "🔍 Verificando errores..."
if [ -f "tsconfig.json" ]; then
    echo "✅ Configuración TypeScript encontrada"
else
    echo "❌ tsconfig.json no encontrado"
fi
echo ""

echo "=================================="
echo "🚀 Para iniciar la aplicación:"
echo "   npm start"
echo ""
echo "🌐 La app estará disponible en:"
echo "   http://localhost:4200/"
echo ""
echo "⚙️  Para configurar SII:"
echo "   http://localhost:4200/sii-config"
echo ""
echo "=================================="
