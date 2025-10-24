import { useContext, useRef, useState } from 'react';
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap"
import { useNavigate } from 'react-router';
import { initialErrors } from './Login.data';
import AuthContainer from "../authContainer/AuthContainer";
import { AuthContext } from '../../../../../../../Server/Cine_Tup_Server/src/services/authContext/AuthContext';
import useFetch from '../../../useFetch/useFetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateEmail, validatePassword } from '../../../../../../../Server/Cine_Tup_Server/src/utils/validations';

const errorToast = (msg) => {
    toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
};

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(initialErrors)

    const { onLogin } = useContext(AuthContext)

    const navigate = useNavigate()
    const { post } = useFetch()
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setErrors(prevErrors => ({
            ...prevErrors,
            email: false
        }))
    }

    const handleEmailBlur = () => {
        if (!email) {
            setErrors(prev => ({ ...prev, email: "El email no puede estar vacío" }));
        } else if (!validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: "Ingrese un email válido" }));
        } else {
            setErrors(prev => ({ ...prev, email: false }));
        }
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setErrors(prevErrors => ({
            ...prevErrors,
            password: false
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!email.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                email: true
            }))
            emailRef.current?.focus();

            return;
        }

        if (!password.length) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: true
            }))
            passwordRef.current?.focus();
            return;
        }

       

        setErrors(initialErrors);
        
        post("/login", 
            false, 
            {
                email,
                password
            },
            token => {
                onLogin(token)
                setEmail('');
                setPassword('')
                navigate('/peliculas')
            },
            err => errorToast(err.message || "Error al iniciar sesión")
            )
        
      
    }

    const handleRegisterClick = () => {
        navigate("/register")
    }


    return (
        <AuthContainer>
            
            <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        ref={emailRef}
                        autoComplete="email"
                        type="email"
                        placeholder="Ingresar email"
                        className={errors.email && "border border-danger"}
                        value={email}
                        onChange={handleEmailChange} 
                        onBlur={handleEmailBlur} 
                    />
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                </FormGroup>
                <FormGroup className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        ref={passwordRef}
                        autoComplete="current-pasword"
                        type="password"
                        placeholder="Ingresar contraseña"
                        className={errors.password && "border border-danger"}
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    {errors.password && <p className="text-danger">¡La contraseña es campo obligatorio!</p>}
                </FormGroup>
                <Row>
                    <Col />
                    <Col md={6} className="d-flex justify-content-end">
                        <Button variant="secondary" type="submit">
                            Iniciar sesión
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <p className="text-center fw-bold">¿No posee cuenta?</p>
                    <Button onClick={handleRegisterClick}>Registrarse</Button>
                </Row>
            </Form>
            <ToastContainer />
        </AuthContainer>

    )
}

export default Login
