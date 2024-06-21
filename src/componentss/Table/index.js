import './table.css';
import React from 'react';

function AcoesVendidasTable({ acoesVendidas }) {
    return (
        <div className="lista-acoes">
            <h3>Ações Vendidas</h3>
            {acoesVendidas !== null ? (
                acoesVendidas.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Valor de Compra</th>
                                <th>Valor de Venda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acoesVendidas.map((acao, index) => (
                                <tr key={index}>
                                    <td>{acao.nome}</td>
                                    <td>{acao.valorCompra}</td>
                                    <td>{acao.valorVenda}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma ação vendida disponível.</p>
                )
            ) : (
                <p>Nenhum dado disponível.</p>
            )}
        </div>
    );
}

export default AcoesVendidasTable;
