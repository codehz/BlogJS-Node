/* eslint-env mocha */

require('babel-core')
var server = require('../server')
var request = require('supertest').agent(server.listen())

import User from '../app/models/user'

const msgs = {
  usernameNotUnique: 'ValidationError: Path `password` is required., Error, expected `username` to be unique. Value: `cohars`'
}

const auth = {
  username: 'cohars',
  password: 'pcw'
}

let token = ''

describe('API', () => {
  describe('POST /users/signup', done => {
    it('should respond 201', done => {
      request
      .post('/api/users/signup')
      .send(auth)
      .expect('Content-Type', /json/)
      .expect(201, done)
    })

    it('should respond 400', done => {
      request
      .post('/api/users/signup')
      .send({
        username: 'cohars'
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        message: msgs.usernameNotUnique
      }, done)
    })
  })

  describe('POST /users/signin', () => {
    it('should respond 200', done => {
      request
      .post('/api/users/signin')
      .send(auth)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) console.log(err)
        token = res.body.token
        done()
      })
    })

    it('should give access to the private routes', done => {
      request
      .get('/api/private')
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200, done)
    })
  })

  describe('PUT /users/update', () => {
    it('should return 200', done => {
      request
      .put('/api/users/update')
      .send({
        username: 'exists'
      })
      .set('Authorization', token)
      .expect('Content-Type', /json/)
      .expect(200, done)
    })
  })

  describe('GET /users/exists', () => {
    it('should respond 200', done => {
      request
      .get('/api/users/exists')
      .expect('Content-Type', /json/)
      .expect(200, {
        username: 'exists'
      }, () => {
        User.remove({username: 'exists'}, done)
      })
    })
  })

  describe('Test errors', () => {
    describe('GET /users/unknown', () => {
      it('should respond 4O4 not found', done => {
        request
        .get('/api/users/unknow')
        .expect('Content-Type', /json/)
        .expect(404, {
          message: 'Resource not found'
        }, done)
      })
    })
  })
})
