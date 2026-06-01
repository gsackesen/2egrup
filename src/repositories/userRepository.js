const User = require('../models/User');

class UserRepository {
  async findAll() {
    return await User.findAll();
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async create(data) {
    return await User.create(data);
  }

  async update(user, data) {
    return await user.update(data);
  }

  async delete(id) {
    return await User.destroy({ where: { id } });
  }

  async findByMail(mail) {
    
    return await User.findOne({ where: { mail } });
  }
}

module.exports = new UserRepository();
