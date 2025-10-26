import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Movie = sequelize.define("movie", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
    },
    summary: {
        type: DataTypes.TEXT,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },

    duration: {
        type: DataTypes.INTEGER,
    },
    language: {
        type: DataTypes.STRING
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }


}, { timestamps: false })