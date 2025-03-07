const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); 
const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middlewares devem vir antes das rotas
app.use(cors());
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Define as rotas uma única vez
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/tags', tagRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => console.error('Erro ao sincronizar com o banco:', err));