const request = require('supertest')
const { User, } = require('../../models');

let app;

describe('Users Endpoints', () => {
  it('should list users', async (done) => {
    await User.create({
      active: 'pending',
      phone: '771111111',
    })
    await User.create({
      active: 'pending',
      phone: '775555555',
    })
    jest.mock('../../middlewares', () => ({ auth: (_req, _res, next) => next() }))
    app = require('../../app');
    const res = await request(app).get('/users')
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(2)
    expect(res.body[1].phone).toEqual('775555555')
    done()
  })
})