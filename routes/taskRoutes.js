const express = require('express');
const router = express.Router();
const { Task, Tag } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.userId
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.userId }, 
      include: 'tags',
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId 
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada ou sem permissão' });
    }
    
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId 
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada ou sem permissão' });
    }
    
    await task.destroy();
    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar tag à task
router.post('/:id/tags', async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada ou sem permissão' });
    }

    const tag = await Tag.findByPk(req.body.tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }

    await task.addTag(tag);
    res.json({ message: 'Tag atrelada à tarefa com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/filter', async (req, res) => {
  try {
    const { tags } = req.query;
    if (!tags) {
      return res.status(400).json({ error: 'Informe as tags para filtrar' });
    }
    
    const tagsArray = tags.split(',').map((t) => t.trim());
    const tasks = await Task.findAll({
      where: { userId: req.userId },
      include: {
        model: Tag,
        as: 'tags',
        where: { name: tagsArray },
      },
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;