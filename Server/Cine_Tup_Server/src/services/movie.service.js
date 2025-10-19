import { Movie } from "../entities/Movie.js";

import { ERROR_CODE } from "../errorCodes.js";

 

export const findMovies = async (_, res) => {

    const movies = await Movie.findAll()

    res.json(movies);

};

 

export const findMovie = async (req, res) => {

    const { id } = req.params;

    const Movie = await Movie.findByPk(id);

    if (!movie)

        return res.status(ERROR_CODE.NOT_FOUND).send({ message: "Pelicula no encontrada" });

 

    res.json(movie);

};

 

export const createMovie = async (req, res) => {

    const { title, director, rating, summary, imageUrl, isAvailable } = req.body;

 

    // Title and author are required

    if (!title || !director)

        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: "Título y director son campos requeridos" });

 

    const newMovie = await Book.create({

        title,

        author,

        rating,

        pageCount,

        summary,

        imageUrl,

        isAvailable

    })

    res.json(newBook)

};

export const updateMovie = async (req, res) => {

    const { id } = req.params;

 

    const { title, author, rating, pageCount, summary, imageUrl, isAvailable } = req.body;

 

    // Title and author are required

    if (!title || !author)

        return res.status(ERROR_CODE.BAD_REQUEST).send({ message: "Título y autor son campos requeridos" });

 

    const book = await Book.findByPk(id);

 

    await book.update({

        title,

        author,

        rating,

        pageCount,

        summary,

        imageUrl,

        isAvailable

    });

 

    await book.save();

 

    res.send(book);

};

 

export const deleteMovie = async (req, res) => {

    const { id } = req.params;

 

    const book = await Book.findByPk(id);

 

    if (!book)

        return res.status(ERROR_CODE.NOT_FOUND).send({ message: "Libro no encontrado" });

 

    await book.destroy();

 

    res.send(`Borrando libro con ID ${id}`);

};