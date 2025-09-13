#!/bin/bash

echo "🚀 Iniciando build do projeto Web3 NFT & Token System..."

# Instalar dependências do projeto principal
echo "📦 Instalando dependências do projeto principal..."
npm install

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
echo "🔨 Fazendo build do frontend..."
npm run build
cd ..

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

# Compilar contratos
echo "🔨 Compilando contratos Solidity..."
npx hardhat compile

echo "✅ Build concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no Vercel"
echo "2. Faça o deploy dos contratos na blockchain"
echo "3. Atualize os endereços dos contratos nas variáveis de ambiente"
echo "4. Faça o deploy para o Vercel"