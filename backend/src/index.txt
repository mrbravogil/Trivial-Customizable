import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import preguntasRoutes from './routes/preguntas.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/preguntas', preguntasRoutes);
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
