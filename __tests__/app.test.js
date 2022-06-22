const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testPerson = {
  first_name: Billy,
  last_name: Butcherson, 
  email: 'billyB@unmarkedgrave.com',
  password: 'mmmMHMHhhhmmmm'
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('POST / should create a new user', () => {
    const res = await request(app)
    .post('/api/v1/users')
    .send(testPerson);
    const { first_name, last_name, email } = testPerson;
    expect(res.body).toEqual({
      id: expect.any(string),
      first_name, 
      last_name, 
      email
    });
  });

  // it('POST / should create a new user', () => {
  //   const res = await request(app)
  //   .post('/api/v1/users')
  //   .send(testPerson);
  //   const { first_name, last_name, email } = testPerson;
  //   expect(res.body).toEqual({
  //     id: expect.any(string),
  //     first_name, 
  //     last_name, 
  //     email
  //   });
  // });

  afterAll(() => {
    pool.end();
  });
});
