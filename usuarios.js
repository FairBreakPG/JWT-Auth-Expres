import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'softjobs',
  port: 5432,
});


const JWT_SECRET = 'mi_secreta_llave';


export const registrarUsuario = async (email, password, rol, lenguage) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const consulta = `INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [email, hashedPassword, rol, lenguage];
  const { rows } = await pool.query(consulta, values);
  return rows[0];
};


export const loginUsuario = async (email, password) => {
  const consulta = 'SELECT * FROM usuarios WHERE email = $1';
  const values = [email];
  const { rows } = await pool.query(consulta, values);

  if (rows.length === 0) throw new Error('Usuario no encontrado');

  const usuario = rows[0];

 
  const passwordMatch = await bcrypt.compare(password, usuario.password);
  if (!passwordMatch) throw new Error('Contraseña incorrecta');

 
  const token = jwt.sign({ email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};


export const obtenerUsuarioPorEmail = async (email) => {
  const consulta = 'SELECT * FROM usuarios WHERE email = $1';
  const values = [email];
  const { rows } = await pool.query(consulta, values);
  if (rows.length === 0) throw new Error('Usuario no encontrado');
  return rows[0];
};