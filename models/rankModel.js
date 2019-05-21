var mongoose = require('mongoose')

var RankSchema = mongoose.Schema({
    score: Number,
    timestamp: String
})

var RankModel = mongoose.model('RankModel', RankSchema)

module.exports = RankModel