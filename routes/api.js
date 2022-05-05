'use strict';
const mongo = require('mongodb');
const mongoose = require('mongoose');

module.exports = function(app) {

  mongoose.connect(
    process.env['MONGO_URI'], {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )

  const connection = mongoose.connection;
  connection.once('open', () => console.log('Successfully connected to MongoDB.'))

  const { Schema, Types } = mongoose;

  const issueSchema = new Schema({
    project: { type: String },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: Date },
    updated_on: { type: Date },
    created_by: { type: String, required: true },
    assigned_to: { type: String },
    open: { type: Boolean },
    status_text: { type: String }
  })

  const ISSUE = mongoose.model('ISSUE', issueSchema);

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;

      let keys = Object.keys(req.query)
      let values = Object.values(req.query)
      let filter = {}

      if (keys.length != 0) {
        for (let i = 0; i < keys.length; i++) {
          filter[keys[i]] = values[i]
        }
      }

      filter['project'] = project

      ISSUE.find(filter, (err, documents) => {
        if (err) {
          console.log(err)
        } else {
          let documentsCopy = []

          for (let doc of documents) {
            let { __v, project, ...rest } = doc['_doc']
            documentsCopy.push(rest)
          }
          res.send(documentsCopy)
        }
      })
    })

    .post(function(req, res) {
      let project = req.params.project;

      const newIssue = new ISSUE({
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || ''
      })

      newIssue.save((err, issue) => {
        if (err) {
          if (err instanceof mongoose.Error.ValidationError) {
            res.send({ error: 'required field(s) missing' })
          }
        } else {
          let issueCopy = Object.assign({}, issue['_doc'])
          delete issueCopy['__v']
          delete issueCopy['project']
          res.send(issueCopy)
        }
      })

    })

    .put(function(req, res) {
      let project = req.params.project;

      let fields = Object.keys(req.body)
      let values = Object.values(req.body)
      let update = {}

      for (let i = 0; i < fields.length; i++) {
        if (values[i] != '' && fields[i] != '_id') {
          update[fields[i]] = values[i]
        }
      }

      update['updated_on'] = new Date();

      if (req.body._id == '' || req.body._id == undefined || req.body._id == null) {
        res.send({ error: 'missing _id' })
      } else if (Object.keys(update).length == 1) {
        res.send({ error: 'no update field(s) sent', _id : req.body._id })
      } else {
        ISSUE.findOneAndUpdate({ project: project, _id: req.body._id }, update, async (err, newDocument) => {
          if (err) {
            res.send({ error: 'could not update', '_id': req.body._id })
          } else {
            if (newDocument == null) {
              res.send({ error: 'could not update', '_id': req.body._id })
            } else {
              res.send({
                result: 'successfully updated',
                _id: req.body._id
              })
            }
          }
        })
      }

    })

    .delete(async function(req, res) {
      let project = req.params.project;

      if (req.body._id == '' || req.body._id == undefined) {
        res.send({ error: 'missing _id' })

      } else if (!req.body._id.match(/^[0-9a-fA-F]{24}$/)) {
        res.send({
          error: 'could not delete',
          _id: req.body._id
        })
      } else {
        ISSUE.deleteOne({ project: project, _id: req.body._id }, (err, deletedDocument) => {
          if (err) {
            console.log(err)
            res.send({
              error: 'could not delete',
              _id: req.body._id
            })
          } else {
            console.log(deletedDocument)
            if (deletedDocument.deletedCount == 0) {
              console.log({
                error: 'could not delete',
                _id: req.body._id
              })
              res.send({
                error: 'could not delete',
                _id: req.body._id
              })
            } else {
              res.json({
                result: 'successfully deleted',
                _id : req.body._id
              })
            }

          }
        })
      }




    });

};
