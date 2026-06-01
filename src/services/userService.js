const userRepository = require('../repositories/userRepository');

class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }

  async createUser(data) {
    return await userRepository.create(data);
  }

  async updateUser(id, data) {
    const user = await userRepository.findById(id);
    if (!user) return null;

    return await userRepository.update(user, data);
  }

  async deleteUser(id) {
    return await userRepository.delete(id);
  }

  async getUserByMail(mail) {    
    return await userRepository.findByMail(mail);
  }

  async getUserById(id) {
    return await userRepository.findById(id);
  }

}

module.exports = new UserService();
