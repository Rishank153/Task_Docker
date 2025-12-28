import { useContext } from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { assignTask, completeTask } from '../../services/api';
import AuthContext from '../../context/authContext';
import { format } from 'date-fns';

const TaskItem = ({ task, refetchTasks }) => {
    const { user } = useContext(AuthContext);

    const handleAssign = async () => {
        try {
            await assignTask(task._id);
            refetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async () => {
        try {
            await completeTask(task._id);
            refetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>{task.title}</Card.Title>
                <Card.Text>{task.description}</Card.Text>
                <div className="mb-2">
                    <Badge bg={
                        task.status === 'completed' ? 'success' :
                            task.status === 'assigned' ? 'warning' : 'primary'
                    }>
                        {task.status}
                    </Badge>
                    <span className="ms-2">
                        Deadline: {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
                    </span>
                    {task.assignedTo && (
                        <div className="mt-2">
                            <strong>Assigned to:</strong> {task.assignedTo.username}
                        </div>
                    )}
                    {task.status === 'completed' && (
                        <div className="mt-2">
                            <strong>Completed by:</strong> {task.completedBy?.username || task.assignedTo?.username || 'Unknown'}
                        </div>
                    )}
                </div>
                {/* Only show Claim button to employees for available tasks */}
                {user?.role === 'employee' && task.status === 'available' && (
                    <Button variant="primary" onClick={handleAssign} className="me-2">
                        Claim Task
                    </Button>
                )}
                {/* Only show Complete button to the assigned employee */}
                {user?.role === 'employee' &&
                    task.assignedTo?._id === user?._id &&
                    task.status === 'assigned' && (
                        <Button variant="success" onClick={handleComplete}>
                            Mark Complete
                        </Button>
                    )}
            </Card.Body>
        </Card>
    );
};

export default TaskItem;