const bittrex = require('node.bittrex.api');
const request = require('request');
const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');
const general_conf = require('../conf/general-conf.js');
const util = require('../util/util.js');
const log = require('../util/log.js');

let connection = mysql.createConnection(db_conf.module);

let list_url = 'https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries';
let limit_volume = general_conf.limit_volume;

connection.connect();

request.get(list_url, (err, response, body) => {
  body = JSON.parse(body);
  result = body.result;
  for(let i = 0; i < result.length; i++) {
    let market = result[i].Market;
    let summary = result[i].Summary;
    if( (market.BaseCurrency === 'BTC') && (summary.BaseVolume < limit_volume) ) { // 비트코인 기준, 볼륨 작은 것만.
      connection.query('INSERT INTO market_names (market_name) VALUES (?)', [market.MarketName], (err, results) => {
        if(err) {
          return;
        }
        connection.query('create table history_' + util.parseMarketName(market.MarketName) + ' ( ' +
          'no int primary key auto_increment, ' +
          'id int unique, ' +
          'timestamp timestamp, ' +
          'total double, ' +
          'order_type varchar(4) ' +
          ')', (err, results) => {
            if(err) {
              log.logWithTime('aleady exist table. (history)');
              return;
            }
        });
      });
      connection.query('INSERT INTO buy_volume (market_name) VALUES (?)', [market.MarketName], (err, results) => {
        if(err) return;
      });
      connection.query('INSERT INTO sell_volume (market_name) VALUES (?)', [market.MarketName], (err, results) => {
        if(err) return;
      });
    }
  }
});
