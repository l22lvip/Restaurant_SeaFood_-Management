import React, { use, useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import '../css/Tables.css'
import TablesCard from '../components/tables/TablesCard'
import OrderModal from '../components/tables/OrderModal'


const Tables = () => {

  const [activeFilter, setActiveFilter] = useState('all')
  const [tables, setTables] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);


  // Hàm để lấy dữ liệu bàn
  const fetchTables = () => {
    fetch('http://localhost:9999/tables')
      .then(res => res.json())
      .then(data => {
        // Lọc bàn dựa trên bộ lọc
        const filtered = data.filter(table => {
          if (activeFilter === 'all') return true;
          if (activeFilter === 'booked') return table.status === 'available';
          return false;
        });
        setTables(filtered);
      });
  };

  useEffect(() => {
    fetchTables();
  }, [activeFilter]); // Chạy lại khi bộ lọc thay đổi

  const getButtonClass = (filter) => {
    return filter === activeFilter
      ? 'tables-filter-active' // selected
      : 'tables-filter-inactive' // not selected
  }

  // Hàm mở modal khi nhấn vào bàn
  const handleTableClick = (table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  // Hàm được gọi sau khi order được cập nhật để tải lại danh sách bàn
  const handleOrderUpdate = () => {
    fetchTables();
  }

  return (
    <Row style={{ backgroundColor: '#1f1f1f', height: 'calc(100vh - 5rem)' }} >
      <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 10px 20px' }}>
        <h1 style={{ color: '#f5f5f5', fontSize: '1.5rem', fontWeight: '500', letterSpacing: '0.025em' }}>Bàn</h1>
        <div style={{ gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setActiveFilter('all')} className={getButtonClass('all')}>Tất cả</button>
          <button onClick={() => setActiveFilter('booked')} className={getButtonClass('booked')}>Đã đặt</button>
        </div>
      </Row>
      <Row style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '2.5rem', overflowY: 'scroll', maxHeight: '80vh', scrollbarWidth: 'none', justifyContent: 'center' }}>
        {
          tables.map((table) => (
            <TablesCard key={table.id} name={table.name} status={table.status === 'available' ? 'Đã đặt' : 'Trống'} capacity={table.capacity} onClick={() => handleTableClick(table)} />
          ))
        }
      </Row>

      <OrderModal
        show={isModalOpen}
        handleClose={handleCloseModal}
        table={selectedTable}
        onOrderUpdate={handleOrderUpdate}
      />
    </Row >
  )
}

export default Tables