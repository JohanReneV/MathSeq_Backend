import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

// Crear conexión a la base de datos
const db = mysql.createConnection(dbConfig);

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    throw err;
  }
  console.log("✅ Conectado a MySQL correctamente");
});

export default db;
