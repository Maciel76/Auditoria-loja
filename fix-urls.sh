#!/bin/bash
# Script para corrigir URLs de localhost para usar a API configurada

echo "🔧 Corrigindo URLs do frontend..."

# Substituir http://localhost:3000 por /api em todos os arquivos .vue e .js
find ./src -type f \( -name "*.vue" -o -name "*.js" \) -exec sed -i 's|http://localhost:3000|/api|g' {} +

echo "✅ Correção concluída!"
echo "⚠️  Verifique manualmente os arquivos para garantir que as substituições estão corretas"
