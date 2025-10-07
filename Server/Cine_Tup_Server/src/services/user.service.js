import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { User } from "../entities/User.js";

import { validateEmail, validatePassword } from "../utils/validations.js";

 

export const register = async (req, res) => {

    const { name, email, password } = req.body;

 

    const user = await User.findOne({

        where: {

            email

        }

    });

 

    if (user)

        return res.status(400).send({ message: "Usuario existente" });

 

    const saltRounds = 10;

 

    const salt = await bcrypt.genSalt(saltRounds);

 

    const hashedPassword = await bcrypt.hash(password, salt);

 

    const newUser = await User.create({

        name,

        email,

        password: hashedPassword,

    })

 

    res.json({ message: `El usuario ${name} se ha registrado correctamente.` });

};

 

export const login = async (req, res) => {

    const { email, password } = req.body;

    const resultEmail = validateEmail(email);

    if (!resultEmail)

        return res.status(401).send({ message: "Email invalido" });

 

    const resultPassword = validatePassword(password, 7, 20, true, true);

    if (!resultPassword)

        return res.status(401).send({ message: "Contraseña invalida" });

 

    const user = await User.findOne({

        where: {

            email

        }

    });

 

    if (!user)

        return res.status(401).send({ message: "Usuario no existente" });
 

    const comparison = await bcrypt.compare(password, user.password);
 

    if (!comparison)

        return res.status(401).send({ message: "Contraseña incorrecta" });

 

    const secretKey = 'programacion3-2025';

 

    const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });

 

    return res.json(token);

};