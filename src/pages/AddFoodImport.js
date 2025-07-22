import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/financial/css/AddFoodImport.css';

const AddFoodImport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    expenseType: '',
    description: '',
    supplier: '',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate unique ID and timestamp
      const newExpense = {
        id: Date.now().toString(),
        date: formData.date,
        amount: Number(formData.amount),
        expenseType: formData.expenseType,
        category: formData.category,
        description: formData.description || 'Chi phí hoạt động hàng ngày',
        supplier: formData.supplier || 'Nhà cung cấp',
        timestamp: new Date().toISOString()
      };

      const response = await fetch('http://localhost:9999/operationalExpenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        alert('Chi phí hoạt động đã được thêm thành công!');
        navigate('/admin/financial');
      } else {
        alert('Có lỗi xảy ra khi thêm chi phí hoạt động.');
      }
    } catch (error) {
      console.error('Error adding operational expense:', error);
      alert('Có lỗi xảy ra khi thêm chi phí hoạt động.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/financial');
  };

  return (
    <div className="add-food-import">
      <div className="import-page-card">
        <div className="import-page-header">
          <h1 className="import-page-title">Thêm Chi Phí Hoạt Động</h1>
        </div>
        
        <div className="import-page-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dateInput" className="form-label">Ngày chi trả</label>
                  <input
                    id="dateInput"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="expenseTypeInput" className="form-label">Loại chi phí</label>
                  <select
                    id="expenseTypeInput"
                    value={formData.expenseType}
                    onChange={(e) => setFormData({...formData, expenseType: e.target.value})}
                    className="form-input"
                    required
                  >
                    <option value="">Chọn loại chi phí</option>
                    <option value="input_materials">Nguyên liệu đầu vào</option>
                    <option value="conversion_costs">Chi phí chuyển đổi</option>
                    <option value="maintenance_repair">Chi phí bảo trì và sửa chữa</option>
                    <option value="equipment_purchase">Chi phí mua thiết bị</option>
                    <option value="emergency_costs">Chi phí khẩn cấp</option>
                    <option value="utilities">Tiện ích (điện, nước, gas)</option>
                    <option value="transportation">Vận chuyển</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="categoryInput" className="form-label">Danh mục chi tiết</label>
                  <input
                    id="categoryInput"
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="VD: Hải sản tươi sống, Thiết bị bếp, v.v."
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="amountInput" className="form-label">Số tiền (₫)</label>
                  <input
                    id="amountInput"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="VD: 2500000"
                    min="0"
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="descriptionInput" className="form-label">Mô tả</label>
                  <input
                    id="descriptionInput"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="VD: Nhập hải sản tươi sống"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="supplierInput" className="form-label">Bên được chi trả</label>
                  <input
                    id="supplierInput"
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="VD: Công ty Hải Sản Biển Đông"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="col-12">
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={!formData.amount || !formData.date || !formData.expenseType || isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Thêm'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFoodImport;
