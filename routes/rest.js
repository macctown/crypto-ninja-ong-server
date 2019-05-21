var express = require('express');
var router = express.Router()
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var dataService = require('../services/dataService')
router.get('/visitors', function(req, res) {
    dataService.getVisitors().then(
        counter => res.json(counter),
        err => res.status(400).send(err)
    )
})

router.post('/visitors', function(req, res) {
    dataService.updateVisitors().then(
        counter => res.json(counter),
        err => res.status(400).send(err)
    )
})

router.get('/gameplays', function(req, res) {
    dataService.getGameplays().then(
        counter => res.json(counter),
        err => res.status(400).send(err)
    )
})

router.post('/gameplays', function(req, res) {
    dataService.updateGameplays().then(
        counter => res.json(counter),
        err => res.status(400).send(err)
    )
})

router.post('/rank', jsonParser, function(req, res) {
    const score = req.body.score
    const timestamp = new Date()
    dataService.getRank(score, timestamp)
        .then(msg => res.json(msg), err => res.status(400).send('Request Failed'))
})

module.exports = router