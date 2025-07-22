import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const FoodImportForm = ({ onAdded }) => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('http://localhost:9999/operationalExpenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date, 
          amount: Number(amount),
          expenseType,
          description: description || 'Chi phí hoạt động hàng ngày',
          supplier: supplier || 'Nhà cung cấp',
          category,
          timestamp: new Date().toISOString()
        })
      });
      setAmount('');
      setExpenseType('');
      setDescription('');
      setSupplier('');
      setCategory('');
      if (onAdded) onAdded();
    } catch {
      alert('Error adding operational expense!');
    }
    setLoading(false);
  };

  return (
    <div className="import-form-container">
      <div className="import-form-title">Add Daily Operational Expenses</div>
      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col xs={12}>
            <Form.Label className="import-form-label">Date</Form.Label>
            <Form.Control 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
              className="import-form-input"
            />
          </Col>
          <Col xs={12}>
            <Form.Label className="import-form-label">Amount (₫)</Form.Label>
            <Form.Control 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              required 
              min={0} 
              placeholder="Enter import amount"
              className="import-form-input"
            />
          </Col>
          <Col xs={12}>
            <Button 
              type="submit" 
              disabled={loading} 
              className="import-form-button"
            >
              {loading ? 'Adding...' : 'Add Import'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FoodImportForm; 