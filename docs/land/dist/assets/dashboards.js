// ========================================
// DASHBOARDS PAGE - JAVASCRIPT FILE
// ========================================

// Função para criar o gráfico de rosca
function createBudgetChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    const chartData = {
        labels: [
            'Ativos civis da união',
            'Aposentadorias e pensões civis da união',
            'Administração da unidade',
            'Contribuição da união de suas autarquias e fundações para o',
            'Concessão de bolsas para pesquisa economica',
            'Benefícios obrigatorios aos servidores civis, empregados, mi',
            'Exercício da presidência dos Brics pelo brasil',
            'Assistencia medica e odontologica aos servidores civis, empr...'
        ],
        datasets: [{
            data: [262, 253, 73.2, 44.6, 8.87, 3.74, 2.38, 2.28],
            backgroundColor: [
                '#AB2D2D', // Vermelho escuro
                '#E24747', // Vermelho claro
                '#FB8585', // Rosa claro
                '#31652B', // Verde escuro
                '#67A95E', // Verde claro
                '#AFD1AA', // Verde pastel
                '#422278', // Roxo escuro
                '#326879'  // Azul escuro
            ],
            borderWidth: 0,
            cutout: '60%' // Para criar o efeito de rosca
        }]
    };

    const config = {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Esconder legenda padrão (usamos a customizada)
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + 'M';
                        }
                    }
                }
            },
            elements: {
                arc: {
                    borderWidth: 0
                }
            }
        }
    };

    new Chart(ctx, config);
}

// Função para inicializar funcionalidades específicas da página de dashboards
function initDashboards() {
    // Criar o gráfico quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBudgetChart);
    } else {
        createBudgetChart();
    }
    
    console.log('📊 Página Dashboards inicializada com sucesso!');
}

// Inicializar quando o script for carregado
initDashboards();

// Exportar funções para uso global
window.createBudgetChart = createBudgetChart;
window.initDashboards = initDashboards;

