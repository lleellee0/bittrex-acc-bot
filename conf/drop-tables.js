const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');

const log = require('../util/log.js');

let connection = mysql.createConnection(db_conf.module);

connection.connect();

connection.query('DROP DATABASE bittrex_acc_bot', (err, results) => {
  if(err) {
    log.logWithTime(err);
     return;
   }
   log.logWithTime('DROP DATABASE bittrex_acc_bot');
   connection.query('CREATE DATABASE bittrex_acc_bot', (err, results) => {
     if(err) {
       log.logWithTime(err);
        return;
      }
      log.logWithTime('CREATE DATABASE bittrex_acc_bot');
      console.log('CLEAR COMPLETE... :)');
   });
});
