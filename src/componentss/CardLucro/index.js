import React, { useEffect } from 'react';
import '../Card/card.css';

function CardLucro({ retornoDiario, onClose }) {
  const isPositive = retornoDiario >= 0;

  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`card-status ${isPositive ? 'positive' : 'negative'}`}>
      <div className="card-content">
        <span className={`icon ${isPositive ? 'icon-good' : 'icon-bad'}`} />
        <p>{isPositive ? 'Lucro total positivo: ' : 'Lucro total negativo: '}</p>
        <p>{retornoDiario}</p>
        <button onClick={onClose} className="close-btn">X</button>
      </div>
    </div>
  );
}

export default CardLucro;
