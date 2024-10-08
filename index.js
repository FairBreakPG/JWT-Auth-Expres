import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { registrarUsuario, loginUsuario, obtenerUsuarioPorEmail } from './usuarios.js';

const app = express();
const port = 3000;

//midle
app.use(express.json());
app.use(cors());

//key
const JWT_SECRET = 'mi_secreta_llave';

// Middle
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token requerido');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token inválido');
    req.email = decoded.email;  
    next();
  });
};

app.post('/usuarios', async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    const nuevoUsuario = await registrarUsuario(email, password, rol, lenguage);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).send('Error al registrar el usuario');
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUsuario(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).send('Credenciales inválidas');
  }
});


app.get('/usuarios', verificarToken, async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorEmail(req.email);
    res.json(usuario);
  } catch (error) {
    res.status(500).send('Error al obtener el usuario');
  }
});


app.use((req, res, next) => {
  console.log(`Consulta realizada a la ruta: ${req.path} - Método: ${req.method}`);
  next();
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error del servidor');
});

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
