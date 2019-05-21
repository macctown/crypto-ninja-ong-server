var express = require('express');
var router = express.Router();

var path = require('path');

router.get('/', function(req, res) {
    // send index.html to start client side
    res.sendFile('index.html', { root: path.join(__dirname, '../static') });
});

router.get('/score/:score/:diff', function(req, res) {
    var score = +req.params.score;
    var level = Math.ceil(score / 10);
    if (level > 6) {
        level = 6;
    }
    var imageName = `jiucai-${level}.png`;
    res.render('score', { imageName: imageName, score: req.params.score, diff: req.params.diff });
});

module.exports = router;