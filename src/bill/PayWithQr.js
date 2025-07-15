import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './css/paywithqr.css';
import qrImage from '../assets/images/qr.png';


function PayWithQR() {
  const location = useLocation();
  const [billId, setBillId] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy billId từ query string nếu có và tự động thanh toán nếu có billId
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('billId');
    if (id) {
      setBillId(id);
      autoPay(id);
    }
    // eslint-disable-next-line
  }, [location.search]);

  // Hàm tự động thanh toán
  const autoPay = async (id) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:9999/bills/${id}`);
      if (!res.ok) {
        setError('Không tìm thấy hóa đơn này!');
        setLoading(false);
        return;
      }
      const bill = await res.json();
      if (bill.status === 'Paid') {
        setError('Hóa đơn này đã được thanh toán trước đó.');
        setLoading(false);
        return;
      }
      const updateRes = await fetch(`http://localhost:9999/bills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid', paidAt: new Date().toISOString() })
      });
      if (!updateRes.ok) {
        setError('Có lỗi khi cập nhật trạng thái hóa đơn.');
        setLoading(false);
        return;
      }
      setIsPaid(true);
    } catch (err) {
      setError('Có lỗi xảy ra khi kết nối server.');
    }
    setLoading(false);
  };

  const handlePay = async () => {
    setError('');
    if (!billId) {
      setError('Vui lòng nhập mã hóa đơn.');
      return;
    }
    setLoading(true);
    try {
      // Kiểm tra bill tồn tại
      const res = await fetch(`http://localhost:9999/bills/${billId}`);
      if (!res.ok) {
        setError('Không tìm thấy hóa đơn này!');
        setLoading(false);
        return;
      }
      const bill = await res.json();
      if (bill.status === 'Paid') {
        setError('Hóa đơn này đã được thanh toán trước đó.');
        setLoading(false);
        return;
      }
      // Cập nhật trạng thái bill thành Paid
      const updateRes = await fetch(`http://localhost:9999/bills/${billId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid', paidAt: new Date().toISOString() })
      });
      if (!updateRes.ok) {
        setError('Có lỗi khi cập nhật trạng thái hóa đơn.');
        setLoading(false);
        return;
      }
      setIsPaid(true);
    } catch (err) {
      setError('Có lỗi xảy ra khi kết nối server.');
    }
    setLoading(false);
  };

  return (
    <div className="qr-container">
      <div className="qr-image-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
        <img
          src={qrImage}
          alt="QR code demo"
          style={{ width: 280, height: 280, maxWidth: '90vw', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '3px solid #e3e3e3', background: '#fff', objectFit: 'cover', display: 'block' }}
        />
      </div>
      <h2>Thanh toán bằng QR</h2>
      <label htmlFor="billId">Mã Hóa Đơn</label>
      <input
        id="billId"
        type="text"
        placeholder="Nhập mã hóa đơn"
        value={billId}
        onChange={(e) => setBillId(e.target.value)}
        disabled={isPaid || loading}
      />
      <button onClick={handlePay} disabled={isPaid || loading}>
        {loading ? 'Đang xử lý...' : 'Thanh Toán'}
      </button>

      {error && <div className="payment-error">❌ {error}</div>}
      {isPaid && (
        <div className="payment-success">
          ✅ Đã thanh toán thành công cho hóa đơn: {billId}
        </div>
      )}
    </div>
  );
}

export default PayWithQR;
