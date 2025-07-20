import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/financial/css/AddFoodImport.css';

const AddFoodImport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
    supplier: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate unique ID and timestamp
      const newImport = {
        id: Date.now().toString(),
        date: formData.date,
        amount: Number(formData.amount),
        description: formData.description || 'Nhập nguyên liệu thực phẩm',
        supplier: formData.supplier || 'Nhà cung cấp',
        timestamp: new Date().toISOString()
      };

      const response = await fetch('http://localhost:9999/foodImports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newImport),
      });

      if (response.ok) {
        alert('Chi phí nhập hàng đã được thêm thành công!');
        navigate('/financial');
      } else {
        alert('Có lỗi xảy ra khi thêm chi phí nhập hàng.');
      }
    } catch (error) {
      console.error('Error adding food import:', error);
      alert('Có lỗi xảy ra khi thêm chi phí nhập hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/financial');
  };

  return (
    <div className="add-food-import">
      <div className="import-page-card">
        <div className="import-page-header">
          <h1 className="import-page-title">Thêm Chi Phí Nhập Hàng Hàng Ngày</h1>
        </div>
        
        <div className="import-page-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dateInput" className="form-label">Ngày nhập hàng</label>
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
                  <label htmlFor="supplierInput" className="form-label">Nhà cung cấp</label>
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
                    disabled={!formData.amount || !formData.date || isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Thêm Chi Phí Nhập Hàng'}
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
