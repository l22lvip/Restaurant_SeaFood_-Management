    import React, { useEffect, useState } from 'react';
    import { Card, Row, Col, Table, Spinner } from 'react-bootstrap';
    import { FaMoneyBillWave, FaChartLine, FaPiggyBank } from 'react-icons/fa';
    import axios from 'axios';

    const API_URL = 'http://localhost:9999';

    const DashboardRevenue = () => {
        const [revenues, setRevenues] = useState([]);
        const [expenses, setExpenses] = useState([]);
        const [profits, setProfits] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const [revRes, expRes, proRes] = await Promise.all([
                        axios.get(`${API_URL}/revenues`),
                        axios.get(`${API_URL}/expenses`),
                        axios.get(`${API_URL}/profits`)
                    ]);
                    setRevenues(revRes.data);
                    setExpenses(expRes.data);
                    setProfits(proRes.data);
                } catch (err) {
                    // handle error
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, []);

        // Lấy dữ liệu hôm nay (giả sử ngày mới nhất)
        const todayRevenue = revenues.length > 0 ? revenues[0] : null;
        const todayExpense = expenses.length > 0 ? expenses[0] : null;
        const todayProfit = profits.length > 0 ? profits[0] : null;

        return (
            <div style={{ padding: 24, background: '#f8f9fa', minHeight: '100vh' }}>
                <h2 className="mb-4" style={{ fontWeight: 700, letterSpacing: 1 }}>Revenue Management Dashboard</h2>
                {loading ? (
                    <div style={{ textAlign: 'center', margin: 40 }}><Spinner animation="border" /></div>
                ) : (
                    <>
                        <Row className="mb-4" >
                            <Col md={4}>
                                <Card className="mb-3 shadow-sm" style={{ borderRadius: 16, border: 'none', minHeight: 180 }}>
                                    <Card.Body>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                            <FaPiggyBank size={32} color="#007bff" style={{ marginRight: 10 }} />
                                            <Card.Title style={{ margin: 0 }}>Total Revenue Today</Card.Title>
                                        </div>
                                        <h3 className="text-primary" style={{ fontSize: 36, fontWeight: 700, marginTop: 16 }}>{todayRevenue ? todayRevenue.totalSales.toLocaleString() : 0} VND</h3>
                                        <div className="text-muted" style={{ fontSize: 13 }}>Orders: {todayRevenue ? todayRevenue.totalOrders : 0}</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="mb-3 shadow-sm" style={{ borderRadius: 16, border: 'none', minHeight: 180 }}>
                                    <Card.Body>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                            <FaMoneyBillWave size={32} color="#28a745" style={{ marginRight: 10 }} />
                                            <Card.Title style={{ margin: 0 }}>Total Expenses Today</Card.Title>
                                        </div>
                                        <h3 className="text-success" style={{ fontSize: 36, fontWeight: 700, marginTop: 16 }}>{todayExpense ? (todayExpense.importCost + todayExpense.electricity + todayExpense.salary + todayExpense.other).toLocaleString() : 0} VND</h3>
                                        <div className="text-muted" style={{ fontSize: 13 }}>Import Cost: {todayExpense ? todayExpense.importCost.toLocaleString() : 0} VND</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="mb-3 shadow-sm" style={{ borderRadius: 16, border: 'none', minHeight: 180 }}>
                                    <Card.Body>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                                            <FaChartLine size={32} color="#17a2b8" style={{ marginRight: 10 }} />
                                            <Card.Title style={{ margin: 0 }}>Profit Today</Card.Title>
                                        </div>
                                        <h3 className="text-danger" style={{ fontSize: 36, fontWeight: 700, marginTop: 16 }}>{todayProfit ? todayProfit.profit.toLocaleString() : 0} VND</h3>
                                        <div className="text-muted" style={{ fontSize: 13 }}>Profit Margin: {todayRevenue && todayProfit ? ((todayProfit.profit / todayRevenue.totalSales) * 100).toFixed(2) : 0}%</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Card className="mb-3 shadow-sm" style={{ borderRadius: 16, border: 'none' }}>
                                    <Card.Body>
                                        <Card.Title style={{ marginBottom: 16 }}>Recent Revenue, Expense, and Profit Summary Table</Card.Title>
                                        <Table bordered hover responsive style={{ background: '#fff', borderRadius: 8 }}>
                                            <thead style={{ background: '#e9ecef' }}>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Revenue (VND)</th>
                                                    <th>Orders</th>
                                                    <th>Expenses (VND)</th>
                                                    <th>Profit (VND)</th>
                                                    <th>Profit Margin (%)</th>
                                                    <th>Best-selling Dishes</th>
                                                    <th>Peak Hours</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {revenues.map((rev, idx) => {
                                                    const exp = expenses[idx] || {};
                                                    const pro = profits[idx] || {};
                                                    const totalExpense = (exp.importCost || 0) + (exp.electricity || 0) + (exp.salary || 0) + (exp.other || 0);
                                                    const profitRate = rev.totalSales ? (((pro.profit || 0) / rev.totalSales) * 100).toFixed(2) : 0;
                                                    return (
                                                        <tr key={rev.date}>
                                                            <td>{rev.date}</td>
                                                            <td>{rev.totalSales.toLocaleString()}</td>
                                                            <td>{rev.totalOrders}</td>
                                                            <td>{totalExpense.toLocaleString()}</td>
                                                            <td>{(pro.profit || 0).toLocaleString()}</td>
                                                            <td>{profitRate}</td>
                                                            <td>{rev.topDishes ? rev.topDishes.join(', ') : ''}</td>
                                                            <td>{rev.peakHours ? rev.peakHours.join(', ') : ''}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        );
    };

    export default DashboardRevenue;
