import { Card, Row } from "react-bootstrap";
import "./AuthContainer.css";

const AuthContainer = ({ children }) => {
  return (
    <div className="auth-wrapper">
      <Card className="auth-card ">
        <Card.Body>
          <Row className="text-center mb-4">
            <h5 className="auth-welcome">¡Bienvenidos a CINETUP!</h5>
          </Row>
          {children}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthContainer;
