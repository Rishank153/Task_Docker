import { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../context/authContext';
import './Home.css'; // ⬅️ Import CSS

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="home-background">
            <div className="home-overlay">
                <Container className="mt-5 text-center">
                    <div className="p-5 mb-4 bg-light rounded-3">
                        <div className="container-fluid py-5">
                            <h1 className="display-5 fw-bold">Welcome to Task Manager</h1>
                            <p className="col-md-8 fs-4 mx-auto">
                                A simple application to manage tasks and collaborate with our team.
                            </p>
                            {!isAuthenticated ? (
                                <div>
                                    <Button as={Link} to="/login" variant="primary" className="me-2">
                                        Login
                                    </Button>
                                    <Button as={Link} to="/register" variant="secondary">
                                        Register
                                    </Button>
                                </div>
                            ) : (
                                <Button as={Link} to="/dashboard" variant="success">
                                    Go to Dashboard
                                </Button>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Home;
