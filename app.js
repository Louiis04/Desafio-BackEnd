const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/tags', tagRoutes);
app.use('/auth', authRoutes); 

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  })
  .catch((err) => console.error('Erro ao sincronizar com o banco:', err));
