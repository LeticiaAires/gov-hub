// Configurar PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;
let baseScale = 1.5; // Qualidade base sempre alta
let canvas, ctx;
let prevBtn, nextBtn, zoomInBtn, zoomOutBtn, pageInfo, zoomLevel, loadingDiv, thumbnailsContainer, toggleSidebarBtn;

// Carregar PDF
function loadPDF() {
    loadingDiv.style.display = 'block';
    
    const pdfUrl = './ebook/GovHub_Livro-digital_0905.pdf';
    
    pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        pageInfo.textContent = `Página 1 de ${pdfDoc.numPages}`;
        
        // Atualizar botões
        prevBtn.disabled = pageNum <= 1;
        nextBtn.disabled = pageNum >= pdfDoc.numPages;
        
        loadingDiv.style.display = 'none';
        generateThumbnails();
        renderPage(pageNum);
    }).catch(function(error) {
        console.error('Erro ao carregar PDF:', error);
        loadingDiv.innerHTML = '<p>❌ Erro ao carregar o e-book. <a href="./ebook/GovHub_Livro-digital_0905.pdf" download>Clique aqui para baixar</a></p>';
    });
}

// Renderizar página
function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(function(page) {
        // Sempre renderizar com qualidade alta (baseScale)
        const viewport = page.getViewport({scale: baseScale});
        
        // Definir o tamanho do canvas baseado na qualidade alta
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Aplicar zoom visual via CSS transform
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'top left';
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    
    pageInfo.textContent = `Página ${num} de ${pdfDoc.numPages}`;
    zoomLevel.textContent = `${Math.round(scale * 100)}%`;
}

// Fila de renderização
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// Navegação
function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    prevBtn.disabled = pageNum <= 1;
    nextBtn.disabled = pageNum >= pdfDoc.numPages;
    queueRenderPage(pageNum);
    updateThumbnailSelection();
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    prevBtn.disabled = pageNum <= 1;
    nextBtn.disabled = pageNum >= pdfDoc.numPages;
    queueRenderPage(pageNum);
    updateThumbnailSelection();
}

// Zoom
function onZoomIn() {
    if (scale >= 3.0) return;
    scale += 0.25;
    queueRenderPage(pageNum);
}

function onZoomOut() {
    if (scale <= 0.5) return;
    scale -= 0.25;
    queueRenderPage(pageNum);
}

// Gerar miniaturas das páginas
function generateThumbnails() {
    thumbnailsContainer.innerHTML = '';
    
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'pdf-thumbnail';
        thumbnailDiv.dataset.page = i;
        
        const thumbnailCanvas = document.createElement('canvas');
        thumbnailCanvas.className = 'thumbnail-canvas';
        thumbnailDiv.appendChild(thumbnailCanvas);
        
        const pageNumber = document.createElement('div');
        pageNumber.className = 'thumbnail-page-number';
        pageNumber.textContent = i;
        thumbnailDiv.appendChild(pageNumber);
        
        // Renderizar miniatura
        pdfDoc.getPage(i).then(function(page) {
            const viewport = page.getViewport({scale: 0.4});
            thumbnailCanvas.height = viewport.height;
            thumbnailCanvas.width = viewport.width;
            
            const renderContext = {
                canvasContext: thumbnailCanvas.getContext('2d'),
                viewport: viewport
            };
            
            page.render(renderContext);
        });
        
        // Adicionar evento de clique
        thumbnailDiv.addEventListener('click', function() {
            pageNum = i;
            prevBtn.disabled = pageNum <= 1;
            nextBtn.disabled = pageNum >= pdfDoc.numPages;
            queueRenderPage(pageNum);
            updateThumbnailSelection();
        });
        
        thumbnailsContainer.appendChild(thumbnailDiv);
    }
    
    updateThumbnailSelection();
}

// Atualizar seleção da miniatura
function updateThumbnailSelection() {
    const thumbnails = document.querySelectorAll('.pdf-thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index + 1 === pageNum);
    });
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.pdf-sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const icon = toggleBtn.querySelector('i');
    
    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        icon.className = 'fas fa-chevron-right';
    } else {
        icon.className = 'fas fa-chevron-left';
    }
}

// PDF Fullscreen toggle
function toggleFullscreen() {
    const pdfViewer = document.querySelector('.pdf-viewer');
    if (!document.fullscreenElement) {
        pdfViewer.requestFullscreen().catch(err => {
            console.log('Erro ao entrar em tela cheia:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Navegação por teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') onPrevPage();
    if (e.key === 'ArrowRight') onNextPage();
    if (e.key === '+' || e.key === '=') onZoomIn();
    if (e.key === '-') onZoomOut();
});

// Inicializar quando a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos do DOM
    canvas = document.getElementById('pdfCanvas');
    ctx = canvas.getContext('2d');
    
    // Elementos da interface
    prevBtn = document.getElementById('prevPage');
    nextBtn = document.getElementById('nextPage');
    zoomInBtn = document.getElementById('zoomIn');
    zoomOutBtn = document.getElementById('zoomOut');
    pageInfo = document.getElementById('pageInfo');
    zoomLevel = document.getElementById('zoomLevel');
    loadingDiv = document.querySelector('.pdf-loading');
    thumbnailsContainer = document.getElementById('pdfThumbnails');
    toggleSidebarBtn = document.getElementById('toggleSidebar');
    
    // Event listeners
    prevBtn.addEventListener('click', onPrevPage);
    nextBtn.addEventListener('click', onNextPage);
    zoomInBtn.addEventListener('click', onZoomIn);
    zoomOutBtn.addEventListener('click', onZoomOut);
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
    
    
    // Carregar PDF
    loadPDF();
    
});
