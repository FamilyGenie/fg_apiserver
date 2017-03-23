var app = require('express');
var router = app.Router();
var auth = require('../authentication');

var StagedPeople = require('./api_calls/stagedpeople-api.js');

// Manage StagedPerson
router.get('/api/v2/staging/people', auth.isAuthenticated, StagedPeople.get);
router.post('/api/v2/staging/person/update', auth.isAuthenticated, StagedPeople.create);
