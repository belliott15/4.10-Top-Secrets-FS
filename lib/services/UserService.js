const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../controllers/users');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ first_name, last_name, email, password }){
    const passwordHash = await bcrypt.hash(
      password, 
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      first_name,
      last_name, 
      email, 
      passwordHash
    });

    return user;
  }
};
