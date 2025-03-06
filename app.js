const express = require('express');
const { sequelize } = require('./models');
const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
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
