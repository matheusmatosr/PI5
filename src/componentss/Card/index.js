import React, { useEffect } from 'react';
import './card.css';

function CardStatus({ retornoDiario, onClose }) {
  const isPositive = retornoDiario >= 0;

  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`card-status ${isPositive ? 'positive' : 'negative'}`}>
      <div className="card-content">
        <span className={`icon ${isPositive ? 'icon-good' : 'icon-bad'}`} />
        <p>{isPositive ? 'Ação com bom retorno diário' : 'Ação com retorno diário ruim'}</p>
        <button onClick={onClose} className="close-btn">X</button>
      </div>
    </div>
  );
}

export default CardStatus;
