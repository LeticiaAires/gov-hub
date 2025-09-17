// ========================================
// QUEM SOMOS - JAVASCRIPT FILE
// ========================================

// Função para preload das imagens da equipe
function preloadTeamImages() {
    const teamImages = [
        // UnB Team
        './images/equipe/alex_reis.png',
        './images/equipe/carla.png',
        './images/equipe/laila.png',
        './images/equipe/isaque.png',
        './images/equipe/joao.png',
        './images/equipe/arthur.png',
        './images/equipe/davi.png',
        './images/equipe/joyce.png',
        './images/equipe/mateus.png',
        './images/equipe/guilherme_gusmao.jpg',
        './images/equipe/vinicius.png',
        
        // IPEA Team
        './images/equipe/fernando_gaiger.png',
        './images/equipe/gustavo_camilo.png',
        
        // Parceiros
        './images/equipe/joao_freitas.jpeg',
        './images/equipe/matheus_dias.jpeg',
        './images/equipe/pedro_rossi.jpeg',
        './images/equipe/victor_suzuki.png'
    ];
    
    console.log('🔄 Iniciando preload das imagens da equipe...');
    
    let loadedCount = 0;
    const totalImages = teamImages.length;
    
    teamImages.forEach(src => {
        const img = new Image();
        
        img.onload = function() {
            loadedCount++;
            console.log(`✅ Imagem carregada: ${src} (${loadedCount}/${totalImages})`);
            
            if (loadedCount === totalImages) {
                console.log('🎉 Todas as imagens da equipe foram carregadas com sucesso!');
            }
        };
        
        img.onerror = function() {
            loadedCount++;
            console.warn(`⚠️ Erro ao carregar imagem: ${src} (${loadedCount}/${totalImages})`);
        };
        
        img.src = src;
    });
}

// Função para inicializar funcionalidades específicas da página Quem Somos
function initQuemSomos() {
    // Preload das imagens quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadTeamImages);
    } else {
        preloadTeamImages();
    }
    
    console.log('👥 Página Quem Somos inicializada com sucesso!');
}

// Inicializar quando o script for carregado
initQuemSomos();

// Exportar função para uso global (se necessário)
window.preloadTeamImages = preloadTeamImages;
