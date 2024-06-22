import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import './acoes.css';
import { Line } from 'react-chartjs-2';
import { useTable } from 'react-table';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend } from 'chart.js';
import Footer from '../../componentss/Footer';
import CardStatus from '../../componentss/Card';
import retornoDadosDashboard from '../../utils/retornoDadosDashboard.json';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Legend);

function Acoes() {
    const { index, acaoNome } = useParams();
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [historicoAcoes, setHistoricoAcoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        const data = retornoDadosDashboard;
        setHistoricoAcoes(data.historicoAcoes || []);

        const acaoSelecionada = data.historicoAcoes.flatMap(h => h.acoes).find(element => element.acao === acaoNome);
        setSelectedAcao(acaoSelecionada);
        setLoading(false);
    }, [acaoNome]);

    useEffect(() => {
        if (selectedAcao) {
            const timer = setTimeout(() => {
                setShowCard(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [selectedAcao]);

    const labels = useMemo(() => historicoAcoes.map(historico => new Date(historico.data).toLocaleDateString()), [historicoAcoes]);

    const precoAtualData = useMemo(() => historicoAcoes.map(historico => {
        const acao = historico.acoes.find(acao => acao.acao === selectedAcao?.acao);
        return acao ? acao.valorCota : null;
    }), [historicoAcoes, selectedAcao]);

    const data = useMemo(() => ({
        labels,
        datasets: [
            {
                label: 'Preço Atual',
                data: precoAtualData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                pointRadius: 5,
                borderWidth: 2,
                spanGaps: true,
            },
        ],
    }), [labels, precoAtualData]);

    const options = useMemo(() => ({
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
    }), []);

    const columns = useMemo(
        () => [
            {
                Header: 'Ação',
                accessor: 'acao',
            },
            {
                Header: 'Valor Cota',
                accessor: 'valorCota',
                Cell: ({ value }) => `R$ ${value}`,
            },
            {
                Header: 'Valor Investido',
                accessor: 'valorInvestido',
                Cell: ({ value }) => `R$ ${value}`,
            },
            {
                Header: 'Retorno Diário',
                accessor: 'retornoDiario',
                Cell: ({ value }) => `R$ ${value}`,
            },
        ],
        []
    );

    const tableData = useMemo(() => (selectedAcao ? [selectedAcao] : []), [selectedAcao]);

    const tableInstance = useTable({ columns, data: tableData });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

    if (loading) {
        return (
            <div className="loading">
                <h2>Carregando ação...</h2>
            </div>
        );
    }

    if (!selectedAcao) {
        return (
            <div className="acao-info">
                <h1>Ação não encontrada</h1>
                <Link to="/">Voltar à página inicial</Link>
            </div>
        );
    }

    return (
        <>
            <div className='containerAcoes'>
                <div className='lista-acoes-fav'>
                    <div className="acao">
                        {selectedAcao && (
                            <>
                                <div className='container-info-acoes'>
                                    <h3>{selectedAcao.acao}</h3>
                                    <div className='container-info-add'>
                                        <p><strong>Valor Cota:</strong> <span className="valorAcao">R$ {selectedAcao.valorCota}</span></p>
                                        <p><strong>Valor Investido:</strong> <span className="valorAcao">R$ {selectedAcao.valorInvestido}</span></p>
                                        <p><strong>Retorno Diário:</strong> <span className="valorAcao">R$ {selectedAcao.retornoDiario}</span></p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='chart'>
                        {selectedAcao && <Line data={data} options={options} />}
                    </div>
                    <div className='table-container'>
                        <div className='table-responsive'>
                            <table {...getTableProps()} className='acoes-table'>
                                <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map(row => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map(cell => (
                                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='areaBtnAcoes'>
                        <Link to="/favoritos" className='btnVer'>Ver Carteira</Link>
                        <Link to="/" className='btnVoltar'>Voltar</Link>
                    </div>
                </div>
            </div>
            <div className='container-footer'>
                <Footer />
            </div>
            {showCard && selectedAcao && (
                <CardStatus retornoDiario={selectedAcao.retornoDiario} onClose={() => setShowCard(false)} />
            )}
        </>
    );
}

export default Acoes;