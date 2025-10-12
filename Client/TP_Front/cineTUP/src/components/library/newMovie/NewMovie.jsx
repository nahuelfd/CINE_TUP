import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const NewMovie = ({ onAddMovie }) => {
    const [title, setTitle] = useState("");
    const [director, setDirector] = useState("");
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState("");
    const [language, setLanguage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isAvailable, setIsAvailabe] = useState(false);

    const handleAddMovie = (event) => {
        event.preventDefault();
        const movieData = {
            title,
            director,
            category,
            duration: parseInt(duration, 10),
            language,
            imageUrl,
            isAvailable

        }
        onAddMovie(movieData);
        setTitle("");
        setDirector("");
        setCategory("");
        setDuration("");
        setLanguage("");
        setImageUrl("");
        setIsAvailabe(false);
    }



    return (
        <Card className="m-4 w-50" bg="success">
            <Card.Body>
                <Form className="text-white" onSubmit={handleAddMovie}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" placeholder="Ingresar título" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="director">
                                <Form.Label>Director</Form.Label>
                                <Form.Control type="text" placeholder="Ingresar director" value={director} onChange={(e) => setDirector(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="category">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Control
                                    type="text" placeholder="Ingresar la categoria" value={category} onChange={(e) => setCategory(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="duration">
                                <Form.Label>Duracion</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingresar duracion" value={duration} onChange={(e) => setDuration(e.target.value)} 
                                    min={1}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="language">
                                <Form.Label>Lenguaje</Form.Label>
                                <Form.Control
                                    type="text" placeholder="Ingresar el lenguaje" value={language} onChange={(e) => setLanguage(e.target.value)} 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-between">
                        <Form.Group className="mb-3" controlId="imageUrl">
                            <Form.Label>URL de imagen</Form.Label>
                            <Form.Control type="text" placeholder="Ingresar url de imagen" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                        </Form.Group>
                    </Row>
                    <Row className="justify-content-end">
                        <Col md={3} className="d-flex flex-column justify-content-end align-items-end">
                            <Form.Check
                                type="switch"
                                id="isAvailable"
                                label="¿Disponible?"
                                checked={isAvailable}
                                onChange={(e) => setIsAvailabe(e.target.checked)}
                            />
                            <Button variant="primary" type="submit">
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