import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/OrderModal.css';

const OrderModal = ({ show, handleClose, table, onOrderUpdate }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [currentOrder, setCurrentOrder] = useState({ items: [], total: 0 });
    const [isLoading, setIsLoading] = useState(false);

    // Lấy danh sách tất cả món ăn
    useEffect(() => {
        axios.get('http://localhost:9999/menuItems')
            .then(res => setMenuItems(res.data))
            .catch(err => console.error(err));
    }, []);

    // Lấy thông tin đơn hàng hiện tại nếu bàn đã được đặt
    useEffect(() => {
        if (table && table.status === 'available' && table.currentOrderId) {
            setIsLoading(true);
            axios.get(`http://localhost:9999/orders/${table.currentOrderId}`)
                .then(res => {
                    const itemsWithNames = res.data.items.map(item => {
                        const menuItem = menuItems.find(m => m.id === item.menuItemId);
                        return { ...item, name: menuItem ? menuItem.name : 'Unknown Item' };
                    });
                    setCurrentOrder({ ...res.data, items: itemsWithNames });
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoading(false));
        } else {
            setCurrentOrder({ items: [], total: 0 });
        }
    }, [table, menuItems]);

    const handleAddItem = (item) => {
        const existingItem = currentOrder.items.find(i => i.menuItemId === item.id);
        let newItems;

        if (existingItem) {
            newItems = currentOrder.items.map(i =>
                i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        } else {
            newItems = [...currentOrder.items, { menuItemId: item.id, name: item.name, quantity: 1, price: item.price }];
        }

        const newTotal = newItems.reduce((sum, i) => sum + (i.quantity * i.price), 0);
        setCurrentOrder({ ...currentOrder, items: newItems, total: newTotal });
    };

    const handleRemoveItem = (itemToRemove) => {
        const existingItem = currentOrder.items.find(i => i.menuItemId === itemToRemove.menuItemId);
        let newItems;

        if (existingItem.quantity > 1) {
            newItems = currentOrder.items.map(i =>
                i.menuItemId === itemToRemove.menuItemId ? { ...i, quantity: i.quantity - 1 } : i
            );
        } else {
            newItems = currentOrder.items.filter(i => i.menuItemId !== itemToRemove.menuItemId);
        }

        const newTotal = newItems.reduce((sum, i) => sum + (i.quantity * i.price), 0);
        setCurrentOrder({ ...currentOrder, items: newItems, total: newTotal });
    };

    const handleSubmitOrder = async () => {
        const itemsToSubmit = currentOrder.items.map(({ menuItemId, quantity, price }) => ({
            menuItemId,
            quantity,
            price
        }));

        if (table.status === 'empty') {
            const newOrder = {
                tableId: table.id,
                userId: 1,
                items: itemsToSubmit,
                total: currentOrder.total,
                status: 'In Progress',
                timestamp: new Date().toISOString()
            };

            const orderResponse = await axios.post('http://localhost:9999/orders', newOrder);
            await axios.patch(`http://localhost:9999/tables/${table.id}`, {
                status: 'available',
                currentOrderId: orderResponse.data.id
            });

        } else {
            await axios.patch(`http://localhost:9999/orders/${table.currentOrderId}`, {
                items: itemsToSubmit,
                total: currentOrder.total
            });
        }
        onOrderUpdate();
        handleClose();
    };

    // *** HÀM MỚI: Xử lý hoàn tất thanh toán ***
    const handleCompletePayment = async () => {
        // 1. Cập nhật trạng thái order thành 'Completed'
        await axios.patch(`http://localhost:9999/orders/${table.currentOrderId}`, {
            status: 'Completed'
        });

        // 2. Cập nhật bàn về trạng thái 'empty' và xóa currentOrderId
        await axios.patch(`http://localhost:9999/tables/${table.id}`, {
            status: 'empty',
            currentOrderId: null // hoặc dùng delete
        });

        // 3. Tải lại danh sách bàn và đóng modal
        onOrderUpdate();
        handleClose();
    };


    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={handleClose}>X</button>
                <h2>{table.name}</h2>
                <div className="modal-body">
                    <div className="menu-list">
                        <h3>Menu</h3>
                        {menuItems.map(item => (
                            <div key={item.id} className="menu-item">
                                <span>{item.name} - {new Intl.NumberFormat('vi-VN').format(item.price)}₫</span>
                                <button onClick={() => handleAddItem(item)} className="add-btn">+</button>
                            </div>
                        ))}
                    </div>

                    <div className="current-order">
                        <h3>{table.status === 'empty' ? 'New Order' : 'Current Order'}</h3>
                        {isLoading ? <p>Loading order...</p> : (
                            currentOrder.items.length > 0 ? (
                                <ul className="order-item-list">
                                    {currentOrder.items.map((item, index) => (
                                        <li key={index} className="order-item">
                                            <span>{item.name} x {item.quantity}</span>
                                            <div className="item-controls">
                                                <button onClick={() => handleRemoveItem(item)} className="remove-btn">-</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>No items in order.</p>
                        )}
                        <hr />
                        <p className="order-total">
                            Total: {new Intl.NumberFormat('vi-VN').format(currentOrder.total)}₫
                        </p>
                    </div>
                </div>
                {/* *** CẬP NHẬT PHẦN NÚT BẤM *** */}
                <div className="modal-footer">
                    <button className="submit-order-btn" onClick={handleSubmitOrder} disabled={currentOrder.items.length === 0}>
                        {table.status === 'empty' ? 'Place Order' : 'Update Order'}
                    </button>
                    {/* Nút thanh toán chỉ hiển thị khi bàn đã có khách */}
                    {table.status === 'available' && (
                        <button className="complete-payment-btn" onClick={handleCompletePayment}>
                            Hoàn tất thanh toán
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderModal;