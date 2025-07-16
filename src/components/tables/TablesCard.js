import React from 'react';
import './css/TablesCard.css';
import { getRandomBG } from '../../utlis/index.js';

// Thêm prop `onClick`
const TablesCard = ({ name, status, capacity, onClick }) => {

  const getStatusClass = () => {
    // Sửa lại logic: 'available' là đã được đặt, 'empty' là còn trống
    if (status === 'available') {
      return 'status-booked'; // Màu xanh cho bàn đã đặt
    }
    return 'status-empty'; // Màu xám cho bàn trống
  };

  return (
    // Thêm sự kiện onClick vào thẻ div chính
    <div onClick={onClick} className="tables-card">
      <div className="card-header">
        <h1>{name}</h1>
        <p className={`status-badge ${getStatusClass()}`}>
          {status}
        </p>
      </div>

      <div className="card-body">
        <h3
          className="initials-circle"
          style={{ backgroundColor: getRandomBG() }}
        >
          {capacity}
        </h3>
      </div>
    </div>
  );
}

export default TablesCard;