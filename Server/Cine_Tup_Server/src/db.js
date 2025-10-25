import { Sequelize } from "sequelize";
import { config } from "./config.js";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.db.storage
});