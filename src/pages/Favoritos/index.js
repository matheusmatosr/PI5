import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './favoritos.css';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend } from 'chart.js';
import AcoesVendidasTable from '../../componentss/Table';
import Footer from '../../componentss/Footer';
import retornoDadosDashboard from '../../utils/retornoDadosDashboard.json';
import retornoAcoesVendidas from '../../utils/retornoAcoesVendidas.json';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Legend);

function Favoritos() {
    const [acoesSalvas, setAcoesSalvas] = useState([]);
    const [acoesVendidas, setAcoesVendidas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAcoesFavoritas() {
            try {
                const data = retornoDadosDashboard;

                const historicoAcoes = data.historicoAcoes || [];
                historicoAcoes.sort((a, b) => new Date(b.data) - new Date(a.data));
                const ultimasAcoes = historicoAcoes.slice(0, 5);
                setAcoesSalvas(ultimasAcoes);
            } catch (error) {
                console.error('Erro ao buscar ações favoritas:', error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchAcoesVendidas() {
            try {
                const data = retornoAcoesVendidas;
                setAcoesVendidas(data || []);
            } catch (error) {
                console.error('Erro ao buscar ações vendidas:', error);
            }
        }

        fetchAcoesFavoritas();
        fetchAcoesVendidas();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <h2>Carregando ações favoritas...</h2>
            </div>
        );
    }

    const acoesSalvasFiltradas = acoesSalvas.map(historico => ({
        ...historico,
        acoes: historico.acoes.filter(acao => !acoesVendidas.find(vendida => vendida.sigla === acao.sigla && vendida.valorVenda !== 0))
    }));

    const labels = acoesSalvasFiltradas.map(historico => new Date(historico.data).toLocaleDateString('pt-BR')) || [];
    const acoesNomes = Array.from(new Set(acoesSalvasFiltradas.flatMap(historico => historico.acoes.map(acao => acao.acao))));

    const datasets = acoesNomes.slice(0, 5).map(acaoNome => {
        const backgroundColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
        const borderColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        return {
            label: acaoNome,
            data: acoesSalvasFiltradas.map(h => {
                const acao = h.acoes.find(a => a.acao === acaoNome);
                return acao ? acao.valorCota : null;
            }),
            fill: false,
            backgroundColor,
            borderColor,
            tension: 0.1,
        };
    });

    const data = {
        labels: labels,
        datasets: datasets,
    };

    const options = {
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
                reverse: true,
            },
            y: {
                title: {
                    display: true,
                    text: 'Preço (R$)',
                    color: 'black',
                    font: {
                        weight: 'bold',
                        size: 16
                    }
                },
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    };

    return (
        <div className='meus-filmes'>
            <h1>Minha Carteira de Ações</h1>
            &nbsp;
            
            {acoesSalvasFiltradas.length === 0 && <h3>Ops, você não tem nenhuma ação salva :( </h3>}
    
            <ul>
                {acoesNomes.slice(0, 5).map((acaoNome, index) => (
                    <li key={index}>
                        <span className='titleAcao'>{acaoNome}</span>
                        <div>
                            <Link to={`/acao/${index}/${acaoNome}`} >Detalhes</Link>
                        </div>
                    </li>
                ))}
            </ul>

            <div className='container-dados'>
                <div className='container-grafico'>
                    <h3>Gráfico comparativo entre as ações</h3>
                    {acoesSalvasFiltradas.length === 0 && <h3 style={{marginTop:'20px'}}>Insira alguma ação para ter gráficos</h3>}
                   
                    <div className="graficoRetro">
                        {acoesSalvasFiltradas.length > 0 && <Line data={data} options={options} />}
                    </div>
                </div>

                <div className='container-tabela'>
                    <AcoesVendidasTable acoesVendidas={acoesVendidas} />
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Favoritos;
