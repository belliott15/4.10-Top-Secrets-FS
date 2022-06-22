const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testPerson = {
  first_name: 'Billy',
  last_name: 'Butcherson', 
  email: 'billyB@unmarkedgrave.com',
  password: 'mmmMHMHhhhmmmm'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testPerson.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...testPerson, ...userProps });

  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
}

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('POST / should create a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(testPerson);
    const { first_name, last_name, email } = testPerson;
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      first_name,
      last_name,
      email
    });
  });

  it('GET / should get the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent
      .get('/api/v1/users/me');

    expect(res.body).toEqual(user);
  });

  afterAll(() => {
    pool.end();
  });
});
