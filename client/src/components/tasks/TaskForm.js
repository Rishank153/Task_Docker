import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { createTask } from '../../services/api';
import AuthContext from '../../context/authContext';

const TaskForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: ''
    });
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTask({
                ...formData,
                deadline: new Date(formData.deadline).toISOString()
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating task');
        }
    };

    // Redirect non-admin users to dashboard
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <Card className="mt-5 shadow-lg">
            <Row className="g-0">
                <Col md={6}>
                    <Card.Body>
                        <h2 className="text-center mb-4">Create New Task</h2>
                        {error && (
                            <Alert variant="danger" onClose={() => setError(null)} dismissible>
                                {error}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" className="w-100">Create Task</Button>
                        </Form>
                    </Card.Body>
                </Col>

                <Col md={6}>
                    <img
                        src="images/todoImage.png"
                        alt="Task Illustration"
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: 'cover', borderTopRightRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default TaskForm;
