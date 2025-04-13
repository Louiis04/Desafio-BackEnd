const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); 
const taskRoutes = require('./routes/taskRoutes'); 
const tagRoutes = require('./routes/tagRoutes');   
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
require('dotenv').config(); 

const app = express();

// 1. Aplica CORS primeiro
app.use(cors({
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(userRoutes); 
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/tags', tagRoutes);

app.get('/', (req, res) => {
  res.send('API app.js funcionando!'); 
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log('Database synchronized (app.js).');
    app.listen(PORT, () => {
      console.log(`Servidor (app.js) rodando na porta ${PORT}`);
    });
  })
  .catch((err) => console.error('Erro ao sincronizar com o banco (app.js):', err));
