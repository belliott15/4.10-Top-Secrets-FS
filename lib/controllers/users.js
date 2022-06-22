const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try{
      const user = await UserService.create(req.body);
      res.json(user);  
    } catch (e){
      next(e);
    }
  })
  .get('/me', authenticate, async (req, res) => {
    res.json(req.user);
  })
;
