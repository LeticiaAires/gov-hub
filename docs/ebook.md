# E-book: Gov Hub - Plataforma Livre de Integração de Dados

<div class="pdf-viewer-container">
  <div class="pdf-viewer">
    <canvas id="pdfCanvas"></canvas>
  </div>
  
  <div class="pdf-controls">
    <button id="prevPage" class="pdf-btn" disabled>← Página Anterior</button>
    <span id="pageInfo" class="page-info">Página 1 de 1</span>
    <button id="nextPage" class="pdf-btn" disabled>Próxima Página →</button>
    <button id="zoomOut" class="pdf-btn">🔍-</button>
    <span id="zoomLevel" class="zoom-info">100%</span>
    <button id="zoomIn" class="pdf-btn">🔍+</button>
    <a href="../land/dist/ebook/GovHub_Livro-digital_0905.pdf" download class="pdf-btn download-btn">Baixar PDF</a>
  </div>
  
  <div class="pdf-loading">
    <div class="loading-spinner"></div>
    <p>Carregando e-book...</p>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
// Configurar PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

// Elementos da interface
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const pageInfo = document.getElementById('pageInfo');
const zoomLevel = document.getElementById('zoomLevel');
const loadingDiv = document.querySelector('.pdf-loading');

// Carregar PDF
function loadPDF() {
  loadingDiv.style.display = 'block';
  
  const pdfUrl = '../land/dist/ebook/GovHub_Livro-digital_0905.pdf';
  
  pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    pageInfo.textContent = `Página 1 de ${pdfDoc.numPages}`;
    
    // Atualizar botões
    prevBtn.disabled = pageNum <= 1;
    nextBtn.disabled = pageNum >= pdfDoc.numPages;
    
    loadingDiv.style.display = 'none';
    renderPage(pageNum);
  }).catch(function(error) {
    console.error('Erro ao carregar PDF:', error);
    loadingDiv.innerHTML = '<p>❌ Erro ao carregar o e-book. <a href="../land/dist/ebook/GovHub_Livro-digital_0905.pdf" download>Clique aqui para baixar</a></p>';
  });
}

// Renderizar página
function renderPage(num) {
  pageRendering = true;
  
  pdfDoc.getPage(num).then(function(page) {
    const viewport = page.getViewport({scale: scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
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
}

function onNextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  prevBtn.disabled = pageNum <= 1;
  nextBtn.disabled = pageNum >= pdfDoc.numPages;
  queueRenderPage(pageNum);
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

// Event listeners
prevBtn.addEventListener('click', onPrevPage);
nextBtn.addEventListener('click', onNextPage);
zoomInBtn.addEventListener('click', onZoomIn);
zoomOutBtn.addEventListener('click', onZoomOut);

// Navegação por teclado
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') onPrevPage();
  if (e.key === 'ArrowRight') onNextPage();
  if (e.key === '+' || e.key === '=') onZoomIn();
  if (e.key === '-') onZoomOut();
});

// Carregar PDF quando a página estiver pronta
document.addEventListener('DOMContentLoaded', loadPDF);
</script>

<style>
.pdf-viewer-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pdf-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.pdf-btn {
  background: #7c3aed;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.pdf-btn:hover:not(:disabled) {
  background: #6d28d9;
  transform: translateY(-2px);
}

.pdf-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.pdf-viewer-container .download-btn {
  background: #059669;
  color: white;
}

.pdf-viewer-container .download-btn:hover {
  background: #047857;
  color: white;
}

.page-info, .zoom-info {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
  text-align: center;
}

.pdf-viewer {
  display: flex;
  justify-content: center;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: auto;
  max-height: 80vh;
}

#pdfCanvas {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pdf-loading {
  text-align: center;
  padding: 3rem;
  display: none;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsividade */
@media (max-width: 768px) {
  .pdf-controls {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .pdf-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
