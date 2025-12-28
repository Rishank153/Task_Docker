import { useState, useEffect, useContext } from 'react';
import { getTasks } from '../../services/api';
import TaskItem from './TaskItem';
import { ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import AuthContext from '../../context/authContext';

const TaskList = ({ filter }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await getTasks();
                let filteredTasks = res.data;

                if (filter === 'assigned') {
                    if (user?.role === 'admin') {
                        // Admins see all assigned tasks
                        filteredTasks = filteredTasks.filter(task =>
                            task.status === 'assigned'
                        );
                    } else {
                        // Employees see only their own assigned tasks
                        filteredTasks = filteredTasks.filter(task =>
                            task.status === 'assigned' &&
                            task.assignedTo?._id === user._id
                        );
                    }
                } else if (filter === 'available') {
                    filteredTasks = filteredTasks.filter(task =>
                        task.status === 'available'
                    );
                } else if (filter === 'completed') {
                    filteredTasks = filteredTasks.filter(task =>
                        task.status === 'completed'
                    );
                }

                setTasks(filteredTasks);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch tasks');
                setLoading(false);
            }
        };

        fetchTasks();
    }, [filter, user]);

    const refetchTasks = async () => {
        try {
            const res = await getTasks();
            let filteredTasks = res.data;

            if (filter === 'assigned') {
                if (user?.role === 'admin') {
                    filteredTasks = filteredTasks.filter(task =>
                        task.status === 'assigned'
                    );
                } else {
                    filteredTasks = filteredTasks.filter(task =>
                        task.status === 'assigned' &&
                        task.assignedTo?._id === user._id
                    );
                }
            } else if (filter === 'available') {
                filteredTasks = filteredTasks.filter(task =>
                    task.status === 'available'
                );
            } else if (filter === 'completed') {
                filteredTasks = filteredTasks.filter(task =>
                    task.status === 'completed'
                );
            }

            setTasks(filteredTasks);
        } catch (err) {
            setError('Failed to fetch tasks');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div>
            {user?.role === 'admin' && (
                <Button href="/create-task" variant="primary" className="mb-3">
                    Create Task
                </Button>
            )}
            <ListGroup>
                {tasks.map((task) => (
                    <TaskItem
                        key={task._id}
                        task={task}
                        refetchTasks={refetchTasks}
                    />
                ))}
            </ListGroup>
        </div>
    );
};

export default TaskList;
