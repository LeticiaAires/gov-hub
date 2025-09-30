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

// Função para atualizar o total do gráfico
function updateChartTotal(chartId, totalValue) {
    const totalElement = document.querySelector(`#${chartId}`).parentElement.querySelector('.chart-total-number');
    if (totalElement) {
        totalElement.textContent = totalValue + 'M';
    }
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
                    legend: { display: false }
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
                        backgroundColor: ['#AA79FE', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [salaryData[1].filled, salaryData[1].empty],
                        backgroundColor: ['#7A34F3', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                    {
                        data: [salaryData[2].filled, salaryData[2].empty],
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
                    legend: { display: false }
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
                    legend: { display: false }
                }
            }
        });
        
        // Atualizar o total automaticamente
        updateChartTotal('detailChart', detailTotal);
    }

    // Gráfico 4 - Aposentadorias, Reserva Remunerada e Reformas
    const adminCtx = document.getElementById('adminChart');
    if (adminCtx) {
        const adminData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const adminTotal = adminData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(adminCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [adminData[0].filled, adminData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [adminData[1].filled, adminData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('adminChart', adminTotal);
    }

    // Gráfico 5 - Vencimento e Vantagens Fixas - Pessoa civil
    const contributionCtx = document.getElementById('contributionChart');
    if (contributionCtx) {
        const contributionData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const contributionTotal = contributionData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(contributionCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [contributionData[0].filled, contributionData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [contributionData[1].filled, contributionData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('contributionChart', contributionTotal);
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
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [scholarshipData[1].filled, scholarshipData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('scholarshipChart', scholarshipTotal);
    }

    // Gráfico 7 - Aposentadorias, Reserva Remunerada e Reformas
    const benefitsCtx = document.getElementById('benefitsChart');
    if (benefitsCtx) {
        const benefitsData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const benefitsTotal = benefitsData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(benefitsCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [benefitsData[0].filled, benefitsData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [benefitsData[1].filled, benefitsData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('benefitsChart', benefitsTotal);
    }

    // Gráfico 8 - Aposentadorias, Reserva Remunerada e Reformas
    const bricsCtx = document.getElementById('bricsChart');
    if (bricsCtx) {
        const bricsData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const bricsTotal = bricsData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(bricsCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [bricsData[0].filled, bricsData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [bricsData[1].filled, bricsData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('bricsChart', bricsTotal);
    }

    // Gráfico 9 - Vencimento e Vantagens Fixas - Pessoa civil
    const medicalCtx = document.getElementById('medicalChart');
    if (medicalCtx) {
        const medicalData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const medicalTotal = medicalData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(medicalCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [medicalData[0].filled, medicalData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [medicalData[1].filled, medicalData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('medicalChart', medicalTotal);
    }

    // Gráfico 10 - Vencimento e Vantagens Fixas - Pessoa civil
    const investmentCtx = document.getElementById('investmentChart');
    if (investmentCtx) {
        const investmentData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const investmentTotal = investmentData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(investmentCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [investmentData[0].filled, investmentData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [investmentData[1].filled, investmentData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('investmentChart', investmentTotal);
    }

    // Gráfico 11 - [A detalhar]
    const technologyCtx = document.getElementById('technologyChart');
    if (technologyCtx) {
        const technologyData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const technologyTotal = technologyData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(technologyCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [technologyData[0].filled, technologyData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [technologyData[1].filled, technologyData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('technologyChart', technologyTotal);
    }

    // Gráfico 12 - [A detalhar]
    const trainingCtx = document.getElementById('trainingChart');
    if (trainingCtx) {
        const trainingData = [
            { filled: 101, empty: 56 }, // Anel externo
            { filled: 101, empty: 56 },   // Anel médio
        ];
        const trainingTotal = trainingData.reduce((sum, ring) => sum + ring.filled, 0);
        
        new Chart(trainingCtx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: [trainingData[0].filled, trainingData[0].empty],
                        backgroundColor: ['#AFD1AA', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '50%'
                    },
                    {
                        data: [trainingData[1].filled, trainingData[1].empty],
                        backgroundColor: ['#31652B', '#F7F7F7'],
                        borderWidth: 1,
                        borderColor: '#F7F7F7',
                        cutout: '60%'
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
        updateChartTotal('trainingChart', trainingTotal);
    }
}

// Função para inicializar funcionalidades específicas da página de dashboards
function initDashboards() {
    // Criar o gráfico quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createBudgetChart();
            createDashboardCharts();
        });
    } else {
        createBudgetChart();
        createDashboardCharts();
    }
    
    console.log('📊 Página Dashboards inicializada com sucesso!');
}

// Inicializar quando o script for carregado
initDashboards();

// Exportar funções para uso global
window.createBudgetChart = createBudgetChart;
window.createDashboardCharts = createDashboardCharts;
window.initDashboards = initDashboards;

