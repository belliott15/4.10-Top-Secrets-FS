const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const UserService = require('../services/UserService');

const ONE_DAY = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try{
      const user = await UserService.create(req.body);
      res.json(user);  
    } catch (e){
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try{
      const { email, password } = req.body;
      const sessionToken = await UserService.signIn({ email, password });

      res.cookie(process.env.COOKIE_NAME, sessionToken, {
        httpOnly: true,
        maxAge: ONE_DAY,
      })
        .json({ message: 'You have Signed in Successfully!' });
    }catch(e){
      next(e);
    }
  })
  .get('/me', authenticate, async (req, res) => {
    res.json(req.user);
  })
  .get('/', [authenticate, authorize], async (req, res, next) => {
    try{
      const users = await User.getAll();
      res.send(users);
    }catch(e){
      next(e);
    }
  })
  .delete('/sessions', (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'You have signed out successfully!' });
  })
;
