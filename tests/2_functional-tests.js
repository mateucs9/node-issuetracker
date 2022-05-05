const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  test('1.Create an issue with every field: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Office',
        issue_text: 'This does not work',
        created_by: 'Matt',
        assigned_to: 'Jim',
        status_text: 'To be fixed'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'open');
        assert.property(res.body, 'status_text');
        assert.property(res.body, '_id');
        if (err) {
          done(err)
        } else {
          done()
        }
      })


  })

  test('2.Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Powerpoint',
        issue_text: 'This does not work',
        created_by: 'Matt',
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'open');
        assert.property(res.body, 'status_text');
        assert.property(res.body, '_id');
        assert.equal(res.body.assigned_to, '')
        assert.equal(res.body.status_text, '')
        if (err) {
          done(err)
        } else {
          done()
        }
      })


  })

  test('3.Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Hello',
        issue_text: 'This does not work',
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.text, '{"error":"required field(s) missing"}')
        if (err) {
          done(err)
        } else {
          done()
        }
      })


  })

  test('4.View issues on a project: GET request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('5.View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .query({ created_by: 'Matt' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        assert.equal(res.body[0].created_by, 'Matt')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('6.View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .query({ created_by: 'Matt', issue_title: 'Office' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isArray(res.body)
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        assert.equal(res.body[0].created_by, 'Matt')
        assert.equal(res.body[0].issue_title, 'Office')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('7.Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({ _id: '61d03536f49462d482bd98af', created_by: 'Jim', assigned_to: 'Claire' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, '61d03536f49462d482bd98af')
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })

  test('8.Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({ _id: '61d03536f49462d482bd98af', created_by: 'Jim', issue_title: 'this error' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, '61d03536f49462d482bd98af')
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  test('9.Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'missing _id')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('10.Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({ _id: '61cecb7ff1860fc70d803c47' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error');
        assert.property(res.body, '_id');
        assert.equal(res.body.error, 'no update field(s) sent')
        assert.equal(res.body._id, '61cecb7ff1860fc70d803c47')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('11.Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({ _id: '1', created_by: 'Jim' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error');
        assert.property(res.body, '_id');
        assert.equal(res.body.error, 'could not update')
        assert.equal(res.body._id, '1')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('12.Delete an issue: DELETE request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({ _id: '61d0377cb82dcf1e310c91b8' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'result');
        assert.property(res.body, '_id');
        assert.equal(res.body.result, 'successfully deleted')
        assert.equal(res.body._id, '61d0377cb82dcf1e310c91b8')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('13.Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({ _id: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error');
        assert.property(res.body, '_id');
        assert.equal(res.body.error, 'could not delete')
        assert.equal(res.body._id, '1')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

  test('14Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'missing _id')
        if (err) {
          done(err)
        } else {
          done()
        }
      })

  })

});
