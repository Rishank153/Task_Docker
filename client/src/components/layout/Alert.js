// src/components/layout/Alert.js
import { useEffect, useState } from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const Alert = ({ message, variant = 'danger', onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (message) setShow(true);
    }, [message]);

    if (!show || !message) return null;

    return (
        <BootstrapAlert
            variant={variant}
            onClose={() => {
                setShow(false);
                if (onClose) onClose();
            }}
            dismissible
            className="mt-3"
            transition={false} // Disable transitions
        >
            {message}
        </BootstrapAlert>
    );
};

export default Alert;