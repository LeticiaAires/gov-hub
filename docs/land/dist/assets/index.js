// ========================================
// INDEX (HOME) - JAVASCRIPT FILE
// ========================================

// Função para preload das imagens específicas da home
function preloadHomeImages() {
    const homeImages = [
        './images/contratos_homev2.png',
        './images/teds_homev2.png',
        './images/pessoal_homev2.png',
        './images/orcamento_homev2.png',
        './images/oqueeogovhub.png',
        './images/img-infos-gov.jpg',
        './images/lablivre.png',
        './images/unb.png',
        './images/ipea.png',
        './images/book.png'
    ];
    
    console.log('🏠 Iniciando preload das imagens da home...');
    
    let loadedCount = 0;
    const totalImages = homeImages.length;
    
    homeImages.forEach(src => {
        const img = new Image();
        
        img.onload = function() {
            loadedCount++;
            console.log(`✅ Imagem da home carregada: ${src} (${loadedCount}/${totalImages})`);
            
            if (loadedCount === totalImages) {
                console.log('🎉 Todas as imagens da home foram carregadas com sucesso!');
            }
        };
        
        img.onerror = function() {
            loadedCount++;
            console.warn(`⚠️ Erro ao carregar imagem da home: ${src} (${loadedCount}/${totalImages})`);
        };
        
        img.src = src;
    });
}

// Função para inicializar funcionalidades específicas da home
function initHome() {
    // Preload das imagens quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadHomeImages);
    } else {
        preloadHomeImages();
    }
    
    console.log('🏠 Página Home inicializada com sucesso!');
}

// Inicializar quando o script for carregado
initHome();

// Exportar função para uso global (se necessário)
window.preloadHomeImages = preloadHomeImages;
