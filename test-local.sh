#!/bin/bash

echo "🧪 Testando aplicação localmente..."
echo ""

# Verificar se as dependências estão instaladas
echo "📦 Verificando dependências..."

if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do projeto principal..."
    npm install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Instalando dependências do frontend..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Instalando dependências do backend..."
    cd backend && npm install && cd ..
fi

echo "✅ Dependências verificadas!"
echo ""

# Compilar contratos
echo "🔨 Compilando contratos..."
npx hardhat compile

if [ $? -eq 0 ]; then
    echo "✅ Contratos compilados com sucesso!"
else
    echo "❌ Erro ao compilar contratos"
    exit 1
fi

echo ""
echo "🚀 Para testar localmente, execute os seguintes comandos em terminais separados:"
echo ""
echo "Terminal 1 - Rede Hardhat:"
echo "npx hardhat node"
echo ""
echo "Terminal 2 - Deploy dos contratos:"
echo "npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "Terminal 3 - Backend:"
echo "cd backend && npm start"
echo ""
echo "Terminal 4 - Frontend:"
echo "cd frontend && npm start"
echo ""
echo "🌐 Depois acesse: http://localhost:3000"
echo ""
echo "📋 Lembre-se de configurar o MetaMask para:"
echo "- Rede: Localhost 8545"
echo "- Chain ID: 1337"
echo "- RPC URL: http://127.0.0.1:8545"