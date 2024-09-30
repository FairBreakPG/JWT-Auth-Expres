import express from 'express';
import cors from 'cors';
import { obtenerJoyas, filtrarJoyas } from './detalle.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Middleware para generar reportes
app.use((req, res, next) => {
  console.log(`Consulta realizada a la ruta: ${req.path} - Método: ${req.method}`);
  next();
});

// Ruta GET /joyas con paginación, ordenamiento y HATEOAS
app.get('/joyas', async (req, res) => {
  try {
    const { limit = 10, page = 1, order_by = 'id_ASC' } = req.query;
    const [orderField, orderDirection] = order_by.split('_');
    const offset = (page - 1) * limit;

    const joyas = await obtenerJoyas(limit, offset, `${orderField} ${orderDirection}`);
    
    // Estructura HATEOAS
    const totalJoyas = joyas.length;
    const links = {
      self: `/joyas?page=${page}&limit=${limit}&order_by=${order_by}`,
      next: `/joyas?page=${+page + 1}&limit=${limit}&order_by=${order_by}`,
      prev: page > 1 ? `/joyas?page=${+page - 1}&limit=${limit}&order_by=${order_by}` : null,
    };

    res.json({ totalJoyas, joyas, links });
  } catch (error) {
    res.status(500).send('Error al obtener las joyas');
  }
});

// Ruta GET /joyas/filtros con filtros de precio, categoría y metal
app.get('/joyas/filtros', async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;

    const joyasFiltradas = await filtrarJoyas(precio_min, precio_max, categoria, metal);

    res.json(joyasFiltradas);
  } catch (error) {
    res.status(500).send('Error al filtrar las joyas');
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error del servidor');
});

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
