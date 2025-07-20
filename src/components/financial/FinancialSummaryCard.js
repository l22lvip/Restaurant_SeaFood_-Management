import React from 'react';
import { Card } from 'react-bootstrap';

const FinancialSummaryCard = ({ title, value, unit }) => {
  return (
    <Card className="summary-card">
      <Card.Body className="summary-card-body">
        <div className="summary-card-title">
          {title}
        </div>
        <div className={`summary-card-value ${value >= 0 ? 'positive' : 'negative'}`}>
          {new Intl.NumberFormat('vi-VN').format(value)} 
          <span className="summary-card-unit">
            {unit}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FinancialSummaryCard; 