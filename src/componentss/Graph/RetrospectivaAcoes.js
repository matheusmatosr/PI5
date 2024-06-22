import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function RetrospectivaAcoes({ acoesSalvas }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const labels = acoesSalvas.map(acao => {
            const date = new Date(acao.data);
            return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        });

        const data = {
            labels: labels,
            datasets: [{
                label: 'Valor da Carteira',
                data: acoesSalvas.map(acao => acao.valorCarteira),
                fill: false,
                backgroundColor: 'rgba(34, 139, 34, 0.2)', 
                borderColor: 'rgb(34, 139, 34)',
                borderWidth: 1
            }]
        };

        const ctx = chartRef.current.getContext('2d');

        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        chartRef.current.chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data',
                            color: 'black',
                            font: {
                                weight: 'bold',
                                size: 16
                            }
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Valor da Carteira',
                            color: 'black',
                            font: {
                                weight: 'bold',
                                size: 16
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }, [acoesSalvas]);

    return <canvas ref={chartRef} />;
}

export default RetrospectivaAcoes;
