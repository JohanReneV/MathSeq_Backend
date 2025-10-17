import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Conectado a MySQL correctamente");
});




app.get("/", (req, res) => {
  res.send("🚀 Backend MathSEQ funcionando");
});


app.get("/api/modulos", (req, res) => {
  const sql = "SELECT * FROM modulos ORDER BY orden ASC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Error del servidor" });
    res.json(result);
  });
});


app.post("/api/usuarios/register", async (req, res) => {
  const { nombre, correo, contrasena, id_rol } = req.body;
  if (!nombre || !correo || !contrasena || !id_rol)
    return res.status(400).json({ error: "Faltan datos" });

  const hashedPassword = await bcrypt.hash(contrasena, 10);

  const sql = "INSERT INTO usuarios (nombre, correo, contrasena, id_rol) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, correo, hashedPassword, id_rol], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Usuario ya existe" });
      return res.status(500).json({ error: "Error del servidor" });
    }
    res.json({ message: "Usuario registrado", id: result.insertId });
  });
});


app.post("/api/usuarios/login", (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) return res.status(400).json({ error: "Faltan datos" });

  const sql = "SELECT * FROM usuarios WHERE correo = ?";
  db.query(sql, [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error del servidor" });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

    res.json({
      message: "Login exitoso",
      user: { id: user.id_usuario, nombre: user.nombre, correo: user.correo, id_rol: user.id_rol }
    });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
