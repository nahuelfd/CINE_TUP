import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { Movie } from "./Movie.js";
import { User } from "./User.js";

export const Ticket = sequelize.define("ticket", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  purchaseDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: false });

// relacion de ticket como movie y user
Ticket.belongsTo(Movie, { foreignKey: "movieId", onDelete: "CASCADE" });
Ticket.belongsTo(User, { foreignKey: "userId", onDelete: "SET NULL" });

// relacion inversa que implica que una movie o user pueden tener muchos tickets
Movie.hasMany(Ticket, { foreignKey: "movieId" });
User.hasMany(Ticket, { foreignKey: "userId" });
