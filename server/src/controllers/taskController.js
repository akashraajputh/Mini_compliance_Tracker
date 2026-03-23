const Joi = require('joi');
const TaskModel = require('../models/taskModel');
const ClientModel = require('../models/clientModel');

const createTaskSchema = Joi.object({
  client_id: Joi.number().integer().required(),
  title: Joi.string().min(1).required(),
  description: Joi.string().allow(''),
  category: Joi.string().required(),
  due_date: Joi.string().isoDate().required(),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium')
});

exports.getTasksByClient = (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Invalid client ID' });
    }
    ClientModel.seedIfEmpty(); // Ensure clients exist
    TaskModel.seedIfEmpty(clientId);
    const tasks = TaskModel.getByClientId(clientId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = (req, res) => {
  try {
    const { error, value } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    TaskModel.create(value);
    res.status(201).json({ message: 'Task created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(taskId) || !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid ID or status' });
    }
    TaskModel.updateStatus(taskId, status);
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
