const ClientModel = require('../models/clientModel');

exports.getAllClients = (req, res) => {
  try {
    ClientModel.seedIfEmpty();
    const clients = ClientModel.getAll();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
