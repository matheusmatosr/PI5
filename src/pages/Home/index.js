import React, { useEffect, useState } from 'react';
import './home.css';
import intro from '../../assets/intro.jpg';
import Footer from '../../componentss/Footer';
import RetrospectivaAcoes from '../../componentss/Graph/RetrospectivaAcoes';
import CardLucro from '../../componentss/CardLucro'; 
import { Link } from 'react-router-dom';
import retornoDadosDashboard from '../../utils/retornoDadosDashboard.json';

function Home() {
    const [historicoAcoes, setHistoricoAcoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noActions, setNoActions] = useState(false);
    const [totalRetornoDiario, setTotalRetornoDiario] = useState(0);
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        async function fetchAcoes() {
            try {
                const data = retornoDadosDashboard;
                setHistoricoAcoes(data.historicoAcoes || []);

                if (!data.historicoAcoes || data.historicoAcoes.length === 0) {
                    setNoActions(true);
                }

                // Calculando o total do retorno diário
                const total = data.historicoAcoes.reduce((acc, acao) => acc + acao.retornoDiario, 0);
                setTotalRetornoDiario(total);

            } catch (error) {
                console.error('Erro ao buscar ações:', error);
                setNoActions(true); 
            } finally {
                setLoading(false);
            }
        }
        fetchAcoes();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCard(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <h2>Carregando ações...</h2>
            </div>
        );
    }

    return (
        <>
            <div className='container-acoes'>
                <div className='intro'>
                    <div className='intro-container'>
                        <h2>Saiba como investir nas melhores ações</h2>
                        <span>Nosso algoritmo fornece as melhores ações para investir a longo e médio prazo, com apenas um clique!</span>
                        <Link to="/favoritos" className="btnHome">Saiba mais</Link>
                    </div>
                    <div className='container-img'>
                        <img src={intro} alt='ações'/>  
                    </div>
                </div>
                {noActions ? (
                    <div className="no-actions">
                        <h2>Nenhuma ação disponível no momento.</h2>
                        <p>Por favor, verifique mais tarde.</p>
                    </div>
                ) : (
                    <div className='grafico-acoes'>
                        <h3>Gráfico referente a carteira</h3>
                        <div className="chart-container">
                            {historicoAcoes.length > 0 && <RetrospectivaAcoes acoesSalvas={historicoAcoes} />}
                        </div>
                    </div>
                )}
               
               {showCard && (
                    <CardLucro retornoDiario={totalRetornoDiario} onClose={() => setShowCard(false)} />
                )}

            </div>
            <Footer />
        </>
    );
}

export default Home;
