const { Router } = require('express');

module.exports = Router()
  .get('/secrets', async (req, res) => {
    const secrets = await Secret.getAll();
    res.json(secrets);
  })
;

