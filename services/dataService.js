// TODO: fetch and store stats to local db
var path = require('path');
var sqlite3 = require('sqlite3').verbose()
const dbPath = path.resolve(__dirname, '../assets/stats.db')
var db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
})

var visitors = 0
var gameplays = 0

var init = () => {
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS scores (score INT(16), timestamp TEXT)')
        db.run('CREATE TABLE IF NOT EXISTS stats (visitors INT(16), gameplays INT(16), last_update TEXT)')
        db.run(`INSERT INTO stats(visitors, gameplays, last_update)
            SELECT 0, 0, "${new Date()}"
            WHERE NOT EXISTS(SELECT * FROM stats)`, (err) => {
            if (err) {
                console.log(err)
            }
        })
        db.get('SELECT visitors, gameplays FROM stats LIMIT 1', (err, row) => {
            if (err) {
                console.log(err)
            } else {
                visitors = row.visitors
                gameplays = row.gameplays
            }
        })
    })
}

var getVisitors = () => {
    return new Promise((resolve) => {
        resolve(visitors)
    })
}

var updateVisitors = () => {
    return new Promise((resolve, reject) => {
        visitors += 1
        db.run(`UPDATE stats SET visitors = ${visitors}, last_update = "${new Date()}"`, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(visitors)
            }
        })
    })
}

var getGameplays = () => {
    return new Promise((resolve) => {
        resolve(gameplays)
    })
}

var updateGameplays = () => {
    return new Promise((resolve, reject) => {
        gameplays += 1
        db.run(`UPDATE stats SET gameplays = ${gameplays}, last_update = "${new Date()}"`, (err) => {
            if (err) {
                console.log('Update gameplay counter failed')
                reject(err)
            } else {
                resolve(gameplays)
            }
        })
    })
}

var getRank = (score, timestamp) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT score FROM scores WHERE score >= ${score} LIMIT 3`, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                var diff = -1;
                if (rows.length === 3) {
                    diff = rows[rows.length - 1].score - score;
                    resolve({
                        "rank": -1,
                        "diff": diff,
                        "img": `/score/${score}/${diff}`
                    })
                } else {
                    db.run(`INSERT INTO scores (score, timestamp) VALUES (${score}, "${timestamp}")`, (err) => {
                        reject(err)
                    })
                    resolve({
                        "rank": rows.length + 1,
                        "img": `/score/${score}/${diff}`
                    })
                }
            }
        })
    })
}

var close = () => {
    console.log('Saving counter to db')
    console.log(`${visitors} ${gameplays}`)
    db.run(`UPDATE stats SET visitors = ${visitors}, gameplays = ${gameplays}`, (err) => {
        if (err) {
            console.log(`Failed with error: ${err}`)
        }
    })
    db.close()
}

module.exports = {
    getVisitors: getVisitors,
    updateVisitors: updateVisitors,
    getGameplays: getGameplays,
    updateGameplays: updateGameplays,
    getRank: getRank,
    init: init,
    close: close
}