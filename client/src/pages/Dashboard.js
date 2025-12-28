import { useState, useContext } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import AuthContext from '../context/authContext';
import TaskList from '../components/tasks/TaskList';
import './Dashboard.css';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext); // ✅ FIXED: include loading
    const [key, setKey] = useState('all');

    if (loading) {
        return <div>Loading...</div>; // Optional: spinner or placeholder
    }

    return (
        <div className="dashboard-background">
            <div className="dashboard-overlay">
                <Container>
                    <Row className="mt-4 text-center">
                        <Col>
                            <h1 className="text-white">Welcome, {user?.username}</h1>
                            <p className="lead text-light">
                                {user?.role === 'admin' ? 'Admin Dashboard' : 'Your Tasks'}
                            </p>

                            <Tabs
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                                className="mb-3 bg-light p-3 rounded"
                            >
                                <Tab eventKey="all" title="All Tasks">
                                    <TaskList filter="all" />
                                </Tab>
                                {user?.role === 'employee' && (
                                    <Tab eventKey="available" title="Available Tasks">
                                        <TaskList filter="available" />
                                    </Tab>
                                )}
                                <Tab eventKey="assigned" title={user?.role === 'admin' ? "Assigned Tasks" : "My Tasks"}>
                                    <TaskList filter="assigned" />
                                </Tab>
                                {user?.role === 'admin' && (
                                    <Tab eventKey="completed" title="Completed Tasks">
                                        <TaskList filter="completed" />
                                    </Tab>
                                )}
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Dashboard;
