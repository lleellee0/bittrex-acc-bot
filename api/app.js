const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');
const general_conf = require('../conf/general-conf.js').module;

let connection = mysql.createConnection(db_conf.module);

connection.connect();

const path = require('path');
const express = require('express');
const app = express();

const log = require('../util/log.js');

const tables = {
  buy_rate_table: null,
  buy_volume_table: null,
  sell_volume_table: null
}


app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/v1/tables', (req, res) => {
  res.json(tables);
});

app.get('/api/v1/buy-rate', function (req, res) {
  res.json(tables.buy_rate_table);
});

app.get('/api/v1/buy-volume', function (req, res) {
  res.json(tables.buy_volume_table);
});

app.get('/api/v1/sell-volume', function (req, res) {
  res.json(tables.sell_volume_table);
});

app.listen(general_conf.webserver_port, function () {
  console.log(`Example app listening on port ${general_conf.webserver_port}!`);
});

setTimeout(() => {
  tick_table();
}, 0);  // trick

setInterval(() => {
  tick_table();
}, 1000*60*1); // 1 minutes interval.


const tick_table = () => {
  log.logWithTime('tick_table is called! ( interval 1 minutes )');
  connection.query('DELETE FROM buy_rate', (err, results) => {
    if(err) return;
    connection.query('INSERT INTO buy_rate (market_name, one_hour, three_hour, six_hour, half_day, one_day, three_day, one_week) ' +
      'SELECT ' +
      'b.market_name, ' +
      'b.one_hour / (b.one_hour + s.one_hour) AS one_hour, ' +
      'b.three_hour / (b.three_hour + s.three_hour) AS three_hour, ' +
      'b.six_hour / (b.six_hour + s.six_hour) AS six_hour, ' +
      'b.half_day / (b.half_day + s.half_day) AS half_day, ' +
      'b.one_day / (b.one_day + s.one_day) AS one_day, ' +
      'b.three_day / (b.three_day + s.three_day) AS three_day, ' +
      'b.one_week / (b.one_week + s.one_week) AS one_week ' +
      'FROM buy_volume b, sell_volume s WHERE b.market_name = s.market_name',
      (err, results, field) => {
        if(err) return;
        connection.query('SELECT * FROM buy_rate', (err, results) => {
          tables.buy_rate_table = results;
        });
        connection.query('SELECT * FROM buy_volume', (err, results) => {
          tables.buy_volume_table = results;
        });
        connection.query('SELECT * FROM sell_volume', (err, results) => {
          tables.sell_volume_table = results;
        });
      });
  });
}
