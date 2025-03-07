const express = require('express');
const router = express.Router();
const { Tag, Task } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create({
      ...req.body,
      userId: req.userId
    });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      where: { userId: req.userId },
      order: [['name', 'ASC']]
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada ou sem permissão' });
    }
    
    await tag.update(req.body);
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada ou sem permissão' });
    }

    const tasksWithTag = await Task.findOne({
      include: {
        model: Tag,
        as: 'tags',
        where: { id: req.params.id }
      },
      where: { userId: req.userId }
    });

    if (tasksWithTag) {
      return res.status(400).json({ 
        error: 'Esta tag está sendo usada em uma ou mais tarefas e não pode ser removida' 
      });
    }
    
    await tag.destroy();
    res.json({ message: 'Tag removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'IDs inválidos' });
    }

    const tags = await Tag.findAll({
      where: {
        id: ids,
        userId: req.userId
      }
    });

    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;