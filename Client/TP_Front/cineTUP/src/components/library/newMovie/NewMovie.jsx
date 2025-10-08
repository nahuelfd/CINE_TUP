import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const NewMovie = () => {
    const handleChangeTitle = (event) => {
        console.log(event.target.value)
    }

    const handleChangeDirector = (event) => {
        console.log(event.target.value)
    }
    const handleChangeCategory = (event) => {
        console.log(event.target.value)
    }
    const handleChangeDuration = (event) => {
        console.log(event.target.value)
    }
    const handleChangeLenguage = (event) => {
        console.log(event.target.value)
    }   
    const handleChangeImageUrl = (event) => {
        console.log(event.target.value)
    }
    const handleChangeIsAvailable = (event) => {
        console.log(event.target.value)
    }

    const [title, setTitle] = useState("");
    const [director, setDirector] = useState("");
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState("");
    const [lenguage, setLenguage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isAvailable, setIsAvailabe] = useState(false);

    const handleAddMovie = (event) => {
        event.preventDefault();
        const movieData = {
            title,
            director,
            category,
            duration: parseInt(rating, 10),
            lenguage,
            imageUrl,
            isAvailable

        }

        console.log(movieData)
    }



    return (
        <Card className="m-4 w-50" bg="success">
            <Card.Body>
                <Form className="text-white">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" placeholder="Ingresar título" onChange={handleChangeTitle}/>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="director">
                                <Form.Label>Director</Form.Label>
                                <Form.Control type="text" placeholder="Ingresar director" onChange={handleChangeDirector} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="category">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Control
                                    type="text" placeholder="Ingresar la categoria" onChange={handleChangeCategory}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="duration">
                                <Form.Label>Duracion</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingresar duracion" onChange={handleChangeDuration}
                                    min={1}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="language">
                                <Form.Label>Lenguaje</Form.Label>
                                <Form.Control
                                    type="text" placeholder="Ingresar el lenguaje" onChange={handleChangeLenguage}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-between">
                        <Form.Group className="mb-3" controlId="imageUrl">
                            <Form.Label>URL de imagen</Form.Label>
                            <Form.Control type="text" placeholder="Ingresar url de imagen" onChange={handleChangeImageUrl} />
                        </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                        <Col md={3} className="d-flex flex-column justify-content-end align-items-end" onChange={handleChangeIsAvailable}> 
                            <Form.Check
                                type="switch"
                                id="isAvailable"
                                className="mb-3"
                                label="¿Disponible?"
                            />
                            <Button variant="primary" onSubmit={handleAddMovie}>
                                Agregar pelicula
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};


export default NewMovie;