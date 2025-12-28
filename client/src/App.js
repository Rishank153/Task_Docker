import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { Container } from 'react-bootstrap';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import PrivateRoute from './components/routing/PrivateRoute';
import ChatContainer from './components/chat/ChatContainer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container className="mt-4">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Admin-only routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminRequired={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-task"
              element={
                <PrivateRoute adminRequired={true}>
                  <TaskForm />
                </PrivateRoute>
              }
            />

            {/* Task management routes */}
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TaskList />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks/available"
              element={
                <PrivateRoute>
                  <TaskList filter="available" />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks/assigned"
              element={
                <PrivateRoute>
                  <TaskList filter="assigned" />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks/completed"
              element={
                <PrivateRoute>
                  <TaskList filter="completed" />
                </PrivateRoute>
              }
            />

            {/* Chat route */}
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatContainer />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;