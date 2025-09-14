const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🔍 Verificando configuração do bot Discord...\n');

// Verificar arquivo .env
console.log('📁 Verificando arquivo .env...');
if (fs.existsSync('.env')) {
    console.log('✅ Arquivo .env encontrado');
    
    // Verificar variáveis
    const requiredVars = ['DISCORD_TOKEN'];
    const optionalVars = ['GUILD_ID', 'PREFIX', 'BOT_NAME'];
    
    console.log('\n🔑 Verificando variáveis de ambiente:');
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            if (varName === 'DISCORD_TOKEN') {
                const token = process.env[varName];
                if (token.length > 50 && token.includes('.')) {
                    console.log(`✅ ${varName}: Token válido (${token.length} caracteres)`);
                } else {
                    console.log(`❌ ${varName}: Token inválido (muito curto ou formato incorreto)`);
                    console.log('   💡 Dica: O token deve ter mais de 50 caracteres e conter pontos');
                }
            } else {
                console.log(`✅ ${varName}: ${process.env[varName]}`);
            }
        } else {
            console.log(`❌ ${varName}: Não definida (OBRIGATÓRIA)`);
        }
    });
    
    optionalVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: ${process.env[varName]}`);
        } else {
            console.log(`⚠️  ${varName}: Não definida (opcional)`);
        }
    });
    
} else {
    console.log('❌ Arquivo .env não encontrado');
    console.log('   💡 Dica: Copie .env.example para .env e configure');
}

// Verificar dependências
console.log('\n📦 Verificando dependências...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['discord.js', 'dotenv'];

requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
        console.log(`❌ ${dep}: Não instalada`);
    }
});

// Verificar estrutura de pastas
console.log('\n📁 Verificando estrutura de pastas...');
const requiredDirs = ['commands', 'events'];
const requiredFiles = ['index.js', 'deploy-commands.js'];

requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
        console.log(`✅ ${dir}/: ${files.length} arquivo(s) encontrado(s)`);
    } else {
        console.log(`❌ ${dir}/: Pasta não encontrada`);
    }
});

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}: Arquivo encontrado`);
    } else {
        console.log(`❌ ${file}: Arquivo não encontrado`);
    }
});

// Verificar comandos
console.log('\n⚡ Verificando comandos...');
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    console.log(`📝 ${commandFiles.length} comando(s) encontrado(s):`);
    
    commandFiles.forEach(file => {
        try {
            const command = require(path.join(commandsPath, file));
            if (command.data && command.execute) {
                console.log(`   ✅ ${file}: ${command.data.name}`);
            } else {
                console.log(`   ❌ ${file}: Estrutura inválida`);
            }
        } catch (error) {
            console.log(`   ❌ ${file}: Erro ao carregar - ${error.message}`);
        }
    });
}

// Resumo
console.log('\n📋 RESUMO:');
console.log('═══════════════════════════════════════');

const hasToken = process.env.DISCORD_TOKEN && process.env.DISCORD_TOKEN.length > 50;
const hasEnv = fs.existsSync('.env');
const hasDeps = fs.existsSync('node_modules');
const hasCommands = fs.existsSync('commands') && fs.readdirSync('commands').length > 0;

if (hasToken && hasEnv && hasDeps && hasCommands) {
    console.log('🎉 CONFIGURAÇÃO COMPLETA!');
    console.log('✅ Você pode executar: npm start');
} else {
    console.log('⚠️  CONFIGURAÇÃO INCOMPLETA');
    console.log('');
    if (!hasToken) {
        console.log('❌ Token do Discord não configurado');
        console.log('   📖 Leia SETUP_INSTRUCTIONS.md');
    }
    if (!hasEnv) {
        console.log('❌ Arquivo .env não encontrado');
        console.log('   💡 Execute: cp .env.example .env');
    }
    if (!hasDeps) {
        console.log('❌ Dependências não instaladas');
        console.log('   💡 Execute: npm install');
    }
    if (!hasCommands) {
        console.log('❌ Comandos não encontrados');
        console.log('   💡 Verifique a pasta commands/');
    }
}

console.log('\n📚 Para mais ajuda, leia:');
console.log('   📖 README.md - Documentação completa');
console.log('   🔧 SETUP_INSTRUCTIONS.md - Guia de configuração');