import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("./movies.db", sqlite3.OPEN_READONLY, (err) => {
  if (err) return console.error("Error al abrir la base:", err.message);
  console.log("Conectado a la base de datos.");
});

db.all("SELECT * FROM movies", (err, rows) => {
  if (err) return console.error("Error al leer las peliculas:", err.message);
  console.log("Peliculas registradas:");
  console.table(rows);
});

db.close();