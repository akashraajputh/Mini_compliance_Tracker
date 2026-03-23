const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router({ mergeParams: true });

router.get('/:clientId', taskController.getTasksByClient);
router.post('/', taskController.createTask);
router.patch('/:id/status', taskController.updateTaskStatus);

module.exports = router;
