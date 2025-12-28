import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { getUsers, deleteUser } from '../services/api';
import AuthContext from '../context/authContext';
import Alert from '../components/layout/Alert';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setUsers(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching users');
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                setError(err.response?.data?.message || 'Error deleting user');
            }
        }
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <h1>Admin Dashboard</h1>
                    {error && <Alert message={error} />}
                    <h3 className="mt-4">User Management</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        {u._id !== user?.id && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(u._id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;