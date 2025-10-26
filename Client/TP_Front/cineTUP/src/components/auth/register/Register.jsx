import { useState } from "react"
import { useNavigate } from "react-router"
import { Form, Button, Col, FormGroup, Row } from "react-bootstrap"
import AuthContainer from "../authContainer/AuthContainer"
import { validateString, validateEmail, validatePassword } from "../../../../../../../Server/Cine_Tup_Server/src/utils/validations"
import { ToastContainer } from "react-toastify"
import { successToast, errorToast } from "../../../../../../../Server/Cine_Tup_Server/src/utils/toast"



const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerMessage, setRegisterMessage] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();


    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleNameBlur = () => {
        setErrors(prev => ({
            ...prev,
            name: !name || !validateString(name, 3)
        }));
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleEmailBlur = () => {
        if (!email) {
            setErrors(prev => ({ ...prev, email: "El email no puede estar vacío" }));
        } else if (!validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: "Ingrese un email válido" }));
        } else {
            setErrors(prev => ({ ...prev, email: "" }));
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handlePasswordBlur = () => {
        if (!password) {
            setErrors(prev => ({ ...prev, password: "La contraseña no puede estar vacía" }));
        } else if (!validatePassword(password, 7, 20, true, true)) {
            setErrors(prev => ({ ...prev, password: "La contraseña debe tener entre 7 y 20 caracteres, incluir al menos una mayúscula y un número" }));
        } else {
            setErrors(prev => ({ ...prev, password: "" }));
        }
    };

    const handleRegister = (event) => {
        event.preventDefault();

        setErrors({ name: false, email: false, password: false });

        // name validation
        if (!name || !validateString(name, 3)) {
            setErrors(prev => ({ ...prev, name: true }));
            return;
        }

        // email validation
        if (!email || !validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: true }));
            return;
        }

        // password validation
        if (!password || !validatePassword(password, 7, 20, true, true)) {
            setErrors(prev => ({ ...prev, password: true }));
            setRegisterMessage("");
            return;
        }


        fetch(`${import.meta.env.VITE_APP_API_URL}/users/register`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        
            .then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Error en el registro");
                }


                console.log(data);
                successToast(data.message || "Registro exitoso");
                setName("");
                setEmail("");
                setPassword("");

                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            })
            .catch((err) => {
                errorToast(err.message);
            })



    }

    const handleLoginClick = () => {
        navigate("/login")
    }
    return (
        <AuthContainer>
            <Form onSubmit={handleRegister}>
                <FormGroup className="mb-4">
                    <Form.Control
                        autoComplete="username"
                        type="text"
                        className={errors.name ? "border border-danger" : ""}
                        placeholder='Ingresar nombre de usuario'
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        value={name} />
                    {errors.name && <p className="mt-2 text-danger">El nombre de usuario no puede estar vacío</p>}
                </FormGroup>
                <FormGroup className="mb-4">
                    <Form.Control
                        autoComplete="email"
                        type="email"
                        className={errors.email ? "border border-danger" : ""}
                        placeholder='Ingresar email'
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        value={email} />
                    {errors.email && <p className="mt-2 text-danger">{errors.email}</p>}
                </FormGroup>
                <FormGroup className="mb-4">
                    <Form.Control
                        autoComplete="current-password"
                        type="password"
                        className={errors.password ? "border border-danger" : ""}
                        placeholder='Ingresar contraseña'
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                        value={password}
                    />
                    {errors.password && <p className="mt-2 text-danger">{errors.password}</p>}
                </FormGroup>
                <Row>
                    <Col>
                        <Button variant="secondary" onClick={handleLoginClick} >Volver</Button>
                    </Col>
                    <Col md={6} className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            Registrarse
                        </Button>
                    </Col>
                </Row>
            </Form>
            {registerMessage && (
                <div className="mt-3">
                    <div className="mt-4 text-center">
                        <p className="text-success fw-bold">{registerMessage}</p>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={5000} />
        </AuthContainer>
    )
}

export default Register