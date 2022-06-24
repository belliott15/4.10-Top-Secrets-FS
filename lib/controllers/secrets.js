const { Router } = require('express');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/secrets', async (req, res) => {
    const secrets = await Secret.getAll();
    res.json(secrets);
  })
;

