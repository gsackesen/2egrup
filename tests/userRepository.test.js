/*const User = require('../src/models/User');
const userRepository = require('../src/repositories/userRepository');
const sequelize = require('../src/config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('create user', async () => {
  const user = await userRepository.create({ name: 'Ali', email: 'ali@example.com' });
  expect(user.id).toBeDefined();
  expect(user.name).toBe('Ali');
});

test('find user by id', async () => {
  const user = await userRepository.create({ name: 'Veli', email: 'veli@example.com' });
  const found = await userRepository.findById(user.id);
  expect(found.email).toBe('veli@example.com');
});

test('update user', async () => {
  const user = await userRepository.create({ name: 'Ayşe', email: 'ayse@example.com' });
  const updated = await userRepository.update(user, { name: 'Ayşe Yeni' });
  expect(updated.name).toBe('Ayşe Yeni');
});

test('delete user', async () => {
  const user = await userRepository.create({ name: 'Mehmet', email: 'mehmet@example.com' });
  const deleted = await userRepository.delete(user.id);
  expect(deleted).toBe(1);
});*/
