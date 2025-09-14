const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando bot Discord...');
console.log('');

// Primeiro, registrar os comandos
console.log('📝 Registrando comandos slash...');
exec('node deploy-commands.js', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Erro ao registrar comandos:', error);
        return;
    }
    
    if (stderr) {
        console.error('⚠️  Avisos:', stderr);
    }
    
    console.log(stdout);
    console.log('');
    
    // Depois de registrar os comandos, iniciar o bot
    console.log('🤖 Iniciando bot...');
    exec('node index.js', (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Erro ao iniciar bot:', error);
            return;
        }
        
        if (stderr) {
            console.error('⚠️  Avisos:', stderr);
        }
        
        console.log(stdout);
    });
});