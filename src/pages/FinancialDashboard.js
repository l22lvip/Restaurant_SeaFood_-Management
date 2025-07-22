import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/financial/css/FinancialDashboard.css';

const FinancialDashboard = () => {
  const navigate = useNavigate();
  const [operationalExpenses, setOperationalExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [importTotal, setImportTotal] = useState(2500000);
  const [revenue, setRevenue] = useState(6355000);
  const [interest, setInterest] = useState(3855000);
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:9999/operationalExpenses')
        .then(res => res.json())
        .then(data => setOperationalExpenses(data || []))
        .catch(err => console.error('Error fetching operational expenses:', err));
      
      fetch('http://localhost:9999/bills')
        .then(res => res.json())
        .then(data => setBills(data || []))
        .catch(err => console.error('Error fetching bills:', err));
    };

    fetchData();

    // Add event listener for when returning to this page
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Calculate totals when data or date selection changes
  useEffect(() => {
    const monthBills = bills.filter(bill => {
      const date = new Date(bill.timestamp);
      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear) &&
        bill.status === 'Paid'
      );
    });
    
    const monthImports = operationalExpenses.filter(expense => {
      const date = new Date(expense.date);
      return (
        date.getMonth() + 1 === Number(selectedMonth) &&
        date.getFullYear() === Number(selectedYear)
      );
    });
    
    const totalRevenue = monthBills.reduce((sum, bill) => sum + Number(bill.total), 0);
    const totalImport = monthImports.reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    setRevenue(totalRevenue);
    setImportTotal(totalImport);
    setInterest(totalRevenue - totalImport);
  }, [bills, operationalExpenses, selectedMonth, selectedYear]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const getExpenseTypeLabel = (expenseType) => {
    const expenseTypeLabels = {
      'input_materials': 'Nguyên liệu đầu vào',
      'conversion_costs': 'Chi phí chuyển đổi',
      'maintenance_repair': 'Bảo trì và sửa chữa',
      'equipment_purchase': 'Mua thiết bị',
      'emergency_costs': 'Chi phí khẩn cấp',
      'utilities': 'Tiện ích (điện, nước, gas)',
      'transportation': 'Vận chuyển',
      'other': 'Khác'
    };
    return expenseTypeLabels[expenseType] || expenseType;
  };

  const handleAddImport = () => {
    navigate('/admin/add-operational-expense');
  };

  return (
    <div className="financial-dashboard">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">

              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
              </div>
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="financial-container mx-auto">
        {/* Page Title */}
        <h1 className="financial-title">Quản Lí Doanh Thu</h1>

        {/* Date Selector */}
        <div className="date-selector-card">
          <div className="date-selector-body">
            <div className="date-selector-label">Chọn Tháng/Năm</div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="date-input-wrapper">
                  <label htmlFor="monthSelect" className="date-input-label">Tháng:</label>
                  <select 
                    id="monthSelect"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="date-select"
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="date-input-wrapper">
                  <label htmlFor="yearInput" className="date-input-label year">Năm:</label>
                  <input
                    id="yearInput"
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="date-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="summary-cards-container">
          <div className="summary-cards-wrapper">
            {/* Monthly Operational Expenses */}
            <div className="summary-card">
              <div className="summary-card-icon import-icon"></div>
              <div className="summary-card-body">
                <div className="summary-card-title">Chi phí hoạt động</div>
                <div className="summary-card-value negative">
                  {formatCurrency(importTotal)}
                  <span className="summary-card-unit">₫</span>
                </div>
                <div className="summary-card-period">Tháng {selectedMonth}/{selectedYear}</div>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="summary-card">
              <div className="summary-card-icon revenue-icon"></div>
              <div className="summary-card-body">
                <div className="summary-card-title">Doanh thu</div>
                <div className="summary-card-value positive">
                  {formatCurrency(revenue)}
                  <span className="summary-card-unit">₫</span>
                </div>
                <div className="summary-card-period">Tháng {selectedMonth}/{selectedYear}</div>
              </div>
            </div>

            {/* Monthly Interest */}
            <div className="summary-card">
              <div className="summary-card-icon profit-icon"></div>
              <div className="summary-card-body">
                <div className="summary-card-title">Lợi nhuận</div>
                <div className="summary-card-value positive">
                  {formatCurrency(interest)}
                  <span className="summary-card-unit">₫</span>
                </div>
                <div className="summary-card-period">Tháng {selectedMonth}/{selectedYear}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Operational Expenses List */}
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8 col-md-10">
            <div className="form-card">
              <div className="form-card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="import-form-title mb-0">Lịch Sử Chi Phí Hoạt Động</h3>
                  <button
                    type="button"
                    className="btn-add-import"
                    onClick={handleAddImport}
                  >
                    Thêm Chi Phí Hoạt Động
                  </button>
                </div>
                <div className="recent-imports-list">
                  {operationalExpenses.length > 0 ? (
                    [...operationalExpenses]
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 5)
                      .map((expense) => (
                        <div key={expense.id} className="import-item">
                          <div className="import-item-header">
                            <span className="import-date">
                              {new Date(expense.date).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="import-amount">
                              {formatCurrency(expense.amount)}₫
                            </span>
                          </div>
                          {expense.description && (
                            <div className="import-description">
                              {expense.description}
                            </div>
                          )}
                          {expense.supplier && (
                            <div className="import-supplier">
                              {expense.supplier}
                            </div>
                          )}
                          {expense.expenseType && (
                            <div className="expense-type">
                              Loại: {getExpenseTypeLabel(expense.expenseType)}
                            </div>
                          )}
                          {expense.category && (
                            <div className="expense-category">
                              Danh mục: {expense.category}
                            </div>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="no-imports">
                      <p>Chưa có dữ liệu chi phí hoạt động.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default FinancialDashboard;