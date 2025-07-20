import React from 'react';
import { Row } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './css/EmployeeCard.css';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
    return (
        <Row className='employee-card' style={{ backgroundColor: '#262626', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', alignItems: 'center', justifyContent: 'space-between', color: '#f5f5f5' }}>
            <div>
                <h4 style={{ margin: 0 }}>{employee.name}</h4>
                <p style={{ margin: 0, color: '#ababab' }}>{employee.phone}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <FaEdit style={{ cursor: 'pointer' }} onClick={() => onEdit(employee)} />
                <FaTrash style={{ cursor: 'pointer' }} onClick={() => onDelete(employee.id)} />
            </div>
        </Row>
    );
};

export default EmployeeCard; 