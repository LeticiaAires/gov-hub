// ========================================
// DASHBOARDS PAGE - JAVASCRIPT FILE
// ========================================

// Função para criar o gráfico de rosca
function createBudgetChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    const palette = ['#AB2D2D', '#E24747', '#FB8585', '#31652B', '#67A95E', '#AFD1AA', '#422278', '#326879', '#8B4513', '#F59E0B', '#22c55e'];

    function formatMillions(value) {
        const m = value / 1_000_000;
        return m.toFixed(1).replace('.', ',') + 'M';
    }

    function updateBudgetLegend(labels, values) {
        const chartCard = ctx.closest('.chart-card');
        if (!chartCard) return;
        const legend = chartCard.querySelector('.chart-legend');
        if (!legend) return;

        const legendItems = Array.from(legend.querySelectorAll('.legend-item'));
        const count = Math.min(legendItems.length, labels.length, values.length);

        for (let i = 0; i < count; i++) {
            const item = legendItems[i];
            const textEl = item.querySelector('.legend-text');
            if (!textEl) continue;
            const formatted = formatMillions(values[i]);
            const fullLabel = labels[i] || '';
            const limit = 45;
            const truncated = fullLabel.length > limit ? `${fullLabel.slice(0, limit)}…` : fullLabel;
            textEl.innerHTML = `<span class="legend-number">${formatted}</span> ${truncated}`;
            textEl.classList.add('has-tooltip');
            textEl.setAttribute('data-full', fullLabel);
        }
    }

    function renderChart(labels, values) {
        const backgroundColor = palette.slice(0, labels.length);
        const chartData = {
            labels: labels,
            datasets: [{
                data: values.map(v => v / 1_000_000),
                backgroundColor: backgroundColor,
                borderWidth: 0,
                cutout: '60%'
            }]
        };

        const config = {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: getTooltipConfig('Distribuição de Orçamento')
                },
                elements: { arc: { borderWidth: 0 } }
            }
        };

        new Chart(ctx, config);

        const totalMillions = values.reduce((sum, v) => sum + (v / 1_000_000), 0);
        updateChartTotal('budgetChart', Math.round(totalMillions));

        updateBudgetLegend(labels, values);
    }

    const dataUrl = '../public/data/orcamento_por_acao.json';
    const urlWithBust = `${dataUrl}?v=${Date.now()}`;

    fetch(urlWithBust, { cache: 'no-store' })
        .then(resp => {
            if (!resp.ok) throw new Error('fetch not ok');
            return resp.json();
        })
        .then(json => {
            const labels = json.map(item => item.descricao);
            const values = json.map(item => Number(item.valor) || 0);
            renderChart(labels, values);
        })
        .catch(() => {
            const labels = [
                'Ativos civis da união',
                'Aposentadorias e pensões civis da união',
                'Administração da unidade',
                'Contribuição da união de suas autarquias e fundações para o',
                'Concessão de bolsas para pesquisa economica',
                'Benefícios obrigatorios aos servidores civis, empregados, mi',
                'Exercício da presidência dos Brics pelo brasil',
                'Assistencia medica e odontologica aos servidores civis, empr...'
            ];
            const values = [262_000_000, 253_000_000, 73_200_000, 44_600_000, 8_870_000, 3_740_000, 2_380_000, 2_280_000];
            renderChart(labels, values);
        });
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

// Função para atualizar o total do gráfico
function updateChartTotal(chartId, totalValue) {
    const totalElement = document.querySelector(`#${chartId}`).parentElement.querySelector('.chart-total-number');
    if (totalElement) {
        totalElement.textContent = totalValue + 'M';
    }
}

// Função para criar configuração padrão de tooltip
function getTooltipConfig(title) {
    return {
        backgroundColor: '#422278',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        padding: 16,
        cornerRadius: 8,
        displayColors: true,
        borderColor: '#7A34F3',
        borderWidth: 1,
        titleFont: {
            size: 14,
            weight: '600',
            family: 'Inter'
        },
        bodyFont: {
            size: 13,
            weight: '400',
            family: 'Inter'
        },
        callbacks: {
            title: function(context) {
                return title;
            },
            label: function(context) {
                const value = context.parsed;
                if (typeof value === 'number') {
                    return 'Valor: ' + value.toLocaleString('pt-BR') + 'M';
                }
                return 'Valor: ' + value;
            }
        }
    };
}


// Função para criar os gráficos de dashboard
function createDashboardCharts() {
    // Gráfico 1 - Aposentadorias, Reserva Remunerada e Reformas
    const retirementCtx = document.getElementById('retirementChart');
    if (retirementCtx) {
        // Dados do gráfico
        const retirementData = [
            { filled: 67, empty: 30 }, // Anel externo
            { filled: 67, empty: 30 },   // Anel médio
            { filled: 68, empty: 30 }    // Anel interno
        ];
        
        // Calcular total (soma dos valores preenchidos)
        const retirementTotal = retirementData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(retirementCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [retirementData[0].filled, retirementData[0].empty],
                        backgroundColor: ['#AA79FE', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [retirementData[1].filled, retirementData[1].empty],
                        backgroundColor: ['#7A34F3', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [retirementData[2].filled, retirementData[2].empty],
                        backgroundColor: ['#422278', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: getTooltipConfig('Aposentadorias e Reformas')
                }
            }
        });
        
        // Atualizar o total automaticamente
        updateChartTotal('retirementChart', retirementTotal);
    }

    // Gráfico 2 - Vencimento e Vantagens Fixas - Pessoa civil
    const salaryCtx = document.getElementById('salaryChart');
    if (salaryCtx) {
        // Dados do gráfico
        const salaryData = [
            { filled: 87, empty: 30 }, // Anel externo
            { filled: 87, empty: 30 },   // Anel médio
            { filled: 86, empty: 30 }    // Anel interno
        ];
        
        // Calcular total (soma dos valores preenchidos)
        const salaryTotal = salaryData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(salaryCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [salaryData[0].filled, salaryData[0].empty],
                        backgroundColor: ['#AA79FE', '#FFF2FE'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [salaryData[1].filled, salaryData[1].empty],
                        backgroundColor: ['#7A34F3', '#FFF2FE'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [salaryData[2].filled, salaryData[2].empty],
                        backgroundColor: ['#422278', '#FFF2FE'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: getTooltipConfig('Vencimentos e Vantagens')
                }
            }
        });
        
        // Atualizar o total automaticamente
        updateChartTotal('salaryChart', salaryTotal);
    }

    // Gráfico 3 - A detalhar
    const detailCtx = document.getElementById('detailChart');
    if (detailCtx) {
        // Dados do gráfico
        const detailData = [
            { filled: 21, empty: 10 }, // Anel externo
            { filled: 21, empty: 10 },   // Anel médio
            { filled: 21, empty: 10 }    // Anel interno
        ];
        
        // Calcular total (soma dos valores preenchidos)
        const detailTotal = detailData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(detailCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [detailData[0].filled, detailData[0].empty],
                        backgroundColor: ['#AB2D2D', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [detailData[1].filled, detailData[1].empty],
                        backgroundColor: ['#F19F42', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [detailData[2].filled, detailData[2].empty],
                        backgroundColor: ['#E7D551', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: getTooltipConfig('A Detalhar')
                }
            }
        });
        
        // Atualizar o total automaticamente
        updateChartTotal('detailChart', detailTotal);
    }

    // Gráfico 4 - Aposentadorias, Reserva Remunerada e Reformas
    const retirementChart2Ctx = document.getElementById('retirementChart2');
    if (retirementChart2Ctx) {
        const retirementChart2Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const retirementChart2Total = retirementChart2Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(retirementChart2Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [retirementChart2Data[0].filled, retirementChart2Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [retirementChart2Data[1].filled, retirementChart2Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('Aposentadorias e Reformas')
                }
            }
        });
        updateChartTotal('retirementChart2', retirementChart2Total);
    }

    // Gráfico 5 - Vencimento e Vantagens Fixas - Pessoa civil
    const salaryChart2Ctx = document.getElementById('salaryChart2');
    if (salaryChart2Ctx) {
        const salaryChart2Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const salaryChart2Total = salaryChart2Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(salaryChart2Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [salaryChart2Data[0].filled, salaryChart2Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [salaryChart2Data[1].filled, salaryChart2Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('Vencimentos e Vantagens')
                }
            }
        });
        updateChartTotal('salaryChart2', salaryChart2Total);
    }

    // Gráfico 6 - Concessão de Bolsas para Pesquisa
    const scholarshipCtx = document.getElementById('scholarshipChart');
    if (scholarshipCtx) {
        const scholarshipData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const scholarshipTotal = scholarshipData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(scholarshipCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [scholarshipData[0].filled, scholarshipData[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [scholarshipData[1].filled, scholarshipData[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('Concessão de Bolsas')
                }
            }
        });
        updateChartTotal('scholarshipChart', scholarshipTotal);
    }

    // Gráfico 7 - Aposentadorias, Reserva Remunerada e Reformas
    const retirementChart3Ctx = document.getElementById('retirementChart3');
    if (retirementChart3Ctx) {
        const retirementChart3Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const retirementChart3Total = retirementChart3Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(retirementChart3Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [retirementChart3Data[0].filled, retirementChart3Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [retirementChart3Data[1].filled, retirementChart3Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('Aposentadorias e Reformas')
                }
            }
        });
        updateChartTotal('retirementChart3', retirementChart3Total);
    }

    // Gráfico 8 - Aposentadorias, Reserva Remunerada e Reformas
    const retirementChart4Ctx = document.getElementById('retirementChart4');
    if (retirementChart4Ctx) {
        const retirementChart4Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const retirementChart4Total = retirementChart4Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(retirementChart4Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [retirementChart4Data[0].filled, retirementChart4Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [retirementChart4Data[1].filled, retirementChart4Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('Aposentadorias e Reformas')
                }
            }
        });
        updateChartTotal('retirementChart4', retirementChart4Total);
    }

    // Gráfico 9 - Vencimento e Vantagens Fixas - Pessoa civil
    const salaryChart3Ctx = document.getElementById('salaryChart3');
    if (salaryChart3Ctx) {
        const salaryChart3Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const salaryChart3Total = salaryChart3Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(salaryChart3Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [salaryChart3Data[0].filled, salaryChart3Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [salaryChart3Data[1].filled, salaryChart3Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('Vencimentos e Vantagens')
                }
            }
        });
        updateChartTotal('salaryChart3', salaryChart3Total);
    }

    // Gráfico 10 - Vencimento e Vantagens Fixas - Pessoa civil
    const salaryChart4Ctx = document.getElementById('salaryChart4');
    if (salaryChart4Ctx) {
        const salaryChart4Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const salaryChart4Total = salaryChart4Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(salaryChart4Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [salaryChart4Data[0].filled, salaryChart4Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [salaryChart4Data[1].filled, salaryChart4Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('Vencimentos e Vantagens')
                }
            }
        });
        updateChartTotal('salaryChart4', salaryChart4Total);
    }

    // Gráfico 11 - [A detalhar]
    const detailChart2Ctx = document.getElementById('detailChart2');
    if (detailChart2Ctx) {
        const detailChart2Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const detailChart2Total = detailChart2Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(detailChart2Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [detailChart2Data[0].filled, detailChart2Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [detailChart2Data[1].filled, detailChart2Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('A Detalhar')
                }
            }
        });
        updateChartTotal('detailChart2', detailChart2Total);
    }

    // Gráfico 12 - [A detalhar]
    const detailChart3Ctx = document.getElementById('detailChart3');
    if (detailChart3Ctx) {
        const detailChart3Data = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const detailChart3Total = detailChart3Data.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(detailChart3Ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [detailChart3Data[0].filled, detailChart3Data[0].empty],
                        backgroundColor: ['#AFD1AA', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [detailChart3Data[1].filled, detailChart3Data[1].empty],
                        backgroundColor: ['#31652B', '#B2D1DA'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: getTooltipConfig('A Detalhar')
                }
            }
        });
        updateChartTotal('detailChart3', detailChart3Total);
    }
}

// Função para criar o gráfico de contratos
function createContractsChart() {
    const ctx = document.getElementById('contractsChart');
    if (!ctx) return;

    const chartData = {
        labels: [
            'Serviços',
            'Compras',
            'Informática',
            'Mão de obra',
            'Serviços de Engenharia',
            'Cessão'
        ],
        datasets: [{
            data: [59.54, 24.81, 8.78, 3.82, 2.67, 0.38],
            backgroundColor: [
                '#AB2D2D',
                '#FB8585',
                '#31652B',
                '#67A95E',
                '#326879',
                '#8B4513'
            ],
            borderWidth: 0,
            cutout: '60%'
        }]
    };

    const config = {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#422278',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    padding: 16,
                    cornerRadius: 8,
                    displayColors: true,
                    borderColor: '#7A34F3',
                    borderWidth: 1,
                    titleFont: {
                        size: 14,
                        weight: '600',
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        weight: '400',
                        family: 'Inter'
                    },
                    callbacks: {
                        title: function(context) {
                            return 'Contratos por Categoria';
                        },
                        label: function(context) {
                            return context.label + ': ' + context.parsed.toLocaleString('pt-BR') + '%';
                        }
                    }
                }
            },
            elements: { arc: { borderWidth: 0 } }
        }
    };

    new Chart(ctx, config);
}

// Função para inicializar funcionalidades específicas da página de dashboards
function initDashboards() {
    // Criar o gráfico quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createBudgetChart();
            createContractsChart();
            createDashboardCharts();
        });
    } else {
        createBudgetChart();
        createContractsChart();
        createDashboardCharts();
    }
    
    console.log('📊 Página Dashboards inicializada com sucesso!');
}

// Inicializar quando o script for carregado
initDashboards();

// Exportar funções para uso global
window.createBudgetChart = createBudgetChart;
window.createContractsChart = createContractsChart;
window.createDashboardCharts = createDashboardCharts;
window.initDashboards = initDashboards;

