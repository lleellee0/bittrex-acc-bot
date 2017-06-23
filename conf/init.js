const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');

const log = require('../util/log.js');

let connection = mysql.createConnection(db_conf.module);

connection.connect();

connection.query('CREATE TABLE market_names ( ' +
  'no INT PRIMARY KEY AUTO_INCREMENT, ' +
  'market_name VARCHAR(20) UNIQUE ' +
  ')', (err, results) => {
  if(err) {
    log.logWithTime('aleady exist table. (market_names)');
     return;
   }
});

const table_schema = ' ( ' +
'no INT PRIMARY KEY AUTO_INCREMENT, ' +
'market_name VARCHAR(20) UNIQUE, ' +
'one_hour DOUBLE, ' +
'three_hour DOUBLE, ' +
'six_hour DOUBLE, ' +
'half_day DOUBLE, ' +
'one_day DOUBLE, ' +
'three_day DOUBLE, ' +
'one_week DOUBLE ' +
')';

connection.query('CREATE TABLE buy_volume ' + table_schema, (err, results) => {
  if(err) {
    log.logWithTime('aleady exist table. (buy_volume)');
     return;
   }
});



connection.query('CREATE TABLE sell_volume ' + table_schema, (err, results) => {
  if(err) {
    log.logWithTime('aleady exist table. (sell_volume)');
   }
   return;
});

connection.query('CREATE TABLE buy_rate ' + table_schema, (err, results) => {
  if(err) {
    log.logWithTime('aleady exist table. (buy_rate)');
     return;
   }
});
