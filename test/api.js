/* eslint-env mocha */

require('babel-core')
var server = require('../server')
var request = require('supertest').agent(server.listen())

import User from '../app/models/user'
import Blog from '../app/models/blog'

const msgs = {
  usernameNotUnique: 'ValidationError: Path `password` is required., Error, expected `username` to be unique. Value: `cohars`',
  toomuchblog: 'You do not have permission to create more than one blog.'
}

const auth = {
  username: 'cohars',
  password: 'pcw'
}

const auth2 = {
  username: 'test',
  password: 'test'
}

let token = ''
let token2 = ''

describe('API', () => {
  describe('POST /signup', done => {
    it('should respond 201', done => {
      request
      .post('/api/signup')
      .send(auth)
      .expect('Content-Type', /json/)
      .expect(201, done)
    })

    it('should respond 201(test)', done => {
      request
      .post('/api/signup')
      .send(auth2)
      .expect('Content-Type', /json/)
      .expect(201, done)
    })

    it('should respond 400', done => {
      request
      .post('/api/signup')
      .send({
        username: 'cohars'
      })
      .expect('Content-Type', /json/)
      .expect(400, {
        message: msgs.usernameNotUnique
      }, done)
    })
  })

  describe('POST /signin', () => {
    it('should respond 200', done => {
      request
      .post('/api/signin')
      .send(auth)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) console.log(err)
        token = res.body.token
        done()
      })
    })

    it('should respond 200(test)', done => {
      request
      .post('/api/signin')
      .send(auth2)
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) console.log(err)
        token2 = res.body.token
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
      .expect(200, done)
    })
  })
  
  describe('Test Blog API', () => {
    describe('GET /blogs', () => {
      it('should respond 200, and body is []', done => {
        request
        .get('/api/blogs')
        .expect('Content-Type', /json/)
        .expect(200, [], done)
      })
    })

    describe('Create the first blog', () => {
      it('should respond 201', done => {
        request
        .post('/api/blogs')
        .send({
          blogname: 'test'
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(201, done)
      })
    })

    describe('Create the second blog', () => {
      it('should respond 412', done => {
        request
        .post('/api/blogs')
        .send({
          blogname: 'test2'
        })
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(412, {
          message: msgs.toomuchblog
        }, done)
      })
    })

    describe('Create same name blog (By other user(test))', () => {
      it('should respond 400', done => {
        request
        .post('/api/blogs')
        .send({
          blogname: 'test'
        })
        .set('Authorization', token2)
        .expect('Content-Type', /json/)
        .expect(400, done)
      })
    })

    describe('delete blog (owner)', () => {
      it('should be successed(200)', done => {
        request
        .delete('/api/blogs/test')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200, done)
      })
    })
    
    describe('delete others blog', () => {
      it('should be failed(404 Not Found)', done => {
        request
        .delete('/api/blogs/test2')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(404, done)
      })
    })
  })

  describe('Test unknow', () => {
    describe('GET /users/unknown', () => {
      it('should respond 4O4 not found', done => {
        request
        .get('/api/users/unknow')
        .expect('Content-Type', /json/)
        .expect(404, {
          message: 'Resource not found'
        }, async () => {
          await User.remove({})
          await Blog.remove({})
          done()
        })
      })
    })
  })
})