import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'likeme',
  port: 5432,
});

export const obtenerPost = async () => {
  const { rows } = await pool.query("SELECT * FROM posts;");
  return rows; 
};

export const escribirPost = async (titulo, url, descripcion) => {
  const consulta =
    "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)";
  const values = [titulo, url, descripcion];
  try {
    const result = await pool.query(consulta, values);
    console.log("Post Agregado", result);
  } catch (error) {
    console.error("Error al agregar el post:", error);
    throw new Error('Error al agregar el post');
  }
};



export const modificarPost = async (id, titulo, url, descripcion) => {
  const consulta = 
    "UPDATE posts SET titulo = $1, img = $2, descripcion = $3 WHERE id = $4";
  const values = [titulo, url, descripcion, id];
  
  try {
    const result = await pool.query(consulta, values);
    console.log("Post modificado", result);
  } catch (error) {
    console.error("Error al modificar el post:", error);
    throw new Error('Error al modificar el post');
  }
}


export const eliminarPost = async (id) => {
  const query = 'DELETE FROM posts WHERE id = $1';
  try {
    await pool.query(query, [id]);
  } catch (error) {
    throw new Error('Error al eliminar el post');
  }
};

