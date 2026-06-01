/*const userService = require('../src/services/userService');
const userRepository = require('../src/repositories/userRepository');

// Repository metodlarını mockla
jest.mock('../src/repositories/userRepository');

describe('UserService', () => {
  test('getAllUsers çağrısı repository.findAll kullanmalı', async () => {
    userRepository.findAll.mockResolvedValue([{ id: 1, name: 'Ali' }]);
    const users = await userService.getAllUsers();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('Ali');
  });

  test('createUser çağrısı repository.create kullanmalı', async () => {
    userRepository.create.mockResolvedValue({ id: 2, name: 'Veli' });
    const user = await userService.createUser({ name: 'Veli' });
    expect(user.id).toBe(2);
  });

  test('updateUser kullanıcı yoksa null dönmeli', async () => {
    userRepository.findById.mockResolvedValue(null);
    const result = await userService.updateUser(99, { name: 'Test' });
    expect(result).toBeNull();
  });

  test('deleteUser çağrısı repository.delete kullanmalı', async () => {
    userRepository.delete.mockResolvedValue(1);
    const result = await userService.deleteUser(1);
    expect(result).toBe(1);
  });
});
*/