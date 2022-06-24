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
};

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

    expect(res.body).toEqual({ ...user, 
      exp: expect.any(Number), 
      iat: expect.any(Number),
    });
  });

  it('GET / should sign in a user or give a 401 if they are not signed in.', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.body).toEqual({
      message: 'Please sign in to continue',
      status: 401
    });
  });

  it('GET / should return a 403 when signed in but not an admin', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users');

    expect(res.body).toEqual({
      message: 'Only admins have access to this page',
      status: 403
    });
  });

  it('GET / should return a list of users when signed in as an admin', async () => {
    const [agent, user] = await registerAndLogin({ email: 'admin' });
    const res = await agent.get('/api/v1/users');

    expect(res.body).toEqual([{ ...user }]);
  });

  it('delete /sessions should remove the user from being logged in', async () => {
    const [agent, user] = await registerAndLogin({ email: 'admin' });
    const res = await agent.get('/api/v1/users');

    expect(res.body).toEqual([{ ...user }]);
  });

  it('GET /secrets should show secrets to signed in users', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');

    expect(res.body[0]).toEqual({
      id: '1',
      title: 'Victorias Secret', 
      description: 'Who really knows', 
      created_at: expect.any(String)
    });
  });

  it('POST /secrets should allow authorized users to post a new secret', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/secrets').send({ title: 'Cool Secret', description: 'Wow Secrets' });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Cool Secret', 
      description: 'Wow Secrets', 
      created_at: expect.any(String)
    });
  });

  afterAll(() => {
    pool.end();
  });
});

