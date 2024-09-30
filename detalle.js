import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'joyas',
  port: 5432,
});

// Obtener todas las joyas con paginación y ordenamiento
export const obtenerJoyas = async (limit, offset, orderBy) => {
  const consulta = `
    SELECT * FROM inventario
    ORDER BY ${orderBy} 
    LIMIT $1 OFFSET $2
  `;
  const values = [limit, offset];
  const { rows } = await pool.query(consulta, values);
  return rows;
};

// Filtros para joyas
export const filtrarJoyas = async (precioMin, precioMax, categoria, metal) => {
  let consulta = 'SELECT * FROM inventario WHERE 1=1';
  const values = [];
  
  if (precioMin) {
    values.push(precioMin);
    consulta += ` AND precio >= $${values.length}`;
  }
  if (precioMax) {
    values.push(precioMax);
    consulta += ` AND precio <= $${values.length}`;
  }
  if (categoria) {
    values.push(categoria);
    consulta += ` AND categoria = $${values.length}`;
  }
  if (metal) {
    values.push(metal);
    consulta += ` AND metal = $${values.length}`;
  }
  
  const { rows } = await pool.query(consulta, values);
  return rows;
};
