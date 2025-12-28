import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/authContext';

const PrivateRoute = ({ children, adminRequired = false }) => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (adminRequired && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

    return children;
};

export default PrivateRoute;