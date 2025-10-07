import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

// Creacion de usuario en la base de datos, verificando que los input ingresados sean correctos

export const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, { timestamps: false })