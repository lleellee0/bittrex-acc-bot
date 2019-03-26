const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');

let connection = mysql.createPool(db_conf.module);

const log = require('../util/log.js');
const util = require('../util/util.js');

let names;

connection.query('SELECT * FROM market_names', (err, results) => {
    if(err) throw err;
      names = results;
});

setInterval(() => {
    delete_over_week_history();
}, 1000*60*60*24); // 1 day interval.

const delete_over_week_history = () => {
    log.logWithTime('delete_over_week_history is called! ( interval 3 minutes )');
  
    for(let i = 0; i < names.length; i++) {
        connection.query('DELETE FROM history_' + util.parseMarketName(names[i].market_name) + ' WHERE timestamp < date_add(now(), interval -7 day)', (err, results) => {
            if(err) return;
        });
    }
}