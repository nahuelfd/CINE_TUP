import { useEffect } from "react";
import { Alert } from "react-bootstrap";

const SimpleAlert = ({ show, variant = "info", message, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, minWidth: 250 }}>
            <Alert variant={variant} onClose={onClose} dismissible>
                {message}
            </Alert>
        </div>
    );
};

export default SimpleAlert;
