import express from 'express';
import cors from 'cors';
import { obtenerPost, escribirPost, modificarPost, eliminarPost } from './detalle.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/posts", async (req, res) => {
  try {
    const alcanzarPost = await obtenerPost();
    res.json(alcanzarPost);
  } catch (error) {
    res.status(500).send('Error al obtener posts');
  }
});

app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  try {
    await escribirPost(titulo, url, descripcion);
    res.send("El post fue Agregado");
  } catch (error) {
    res.status(500).send('Error al agregar el post');
  }
});


app.put("/posts/", async (req, res) => {
  const { id } = req.params;
  const { titulo, url, descripcion } = req.body;
  try {
    await modificarPost(id, titulo, url, descripcion);
    res.send(`El post con id ${id} fue modificado`);
  } catch (error) {
    res.status(500).send('Error al modificar el post');
  }
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await eliminarPost(id);
    res.send(`El post con id ${id} fue eliminado`);
  } catch (error) {
    res.status(500).send('Error al eliminar el post');
  }
});

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
