/*"// testEnv.js
import dotenv from "dotenv";
import path from "path";

// Configurar dotenv con ruta absoluta (opcional)
dotenv.config({ path: path.resolve("./.env") });

// Leer las variables
console.log("PORT:", process.env.PORT);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_EXPIRATION:", process.env.JWT_EXPIRATION);
console.log("DB_STORAGE:", process.env.DB_STORAGE);

// Verificar con una función simple
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET NO se ha cargado desde .env");
} else {
  console.log("✅ JWT_SECRET se cargó correctamente");
}" */