// URL -  https://bittrex.com/api/v1.1/public/getmarkethistory?market=$market.MarketName

const bittrex = require('node.bittrex.api');
const request = require('request');
const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');
const util = require('../util/util.js');

let connection = mysql.createConnection(db_conf.module);
let history_url = 'https://bittrex.com/api/v1.1/public/getmarkethistory?market=';

connection.connect();

const log = require('../util/log.js');

let names;

connection.query('SELECT * FROM market_names', (err, results) => {
  if(err) throw err;
  names = results;
});

setTimeout(() => {
  get_history();
}, 1000*15); // first check-acc after 15 seconds.

setInterval(() => {
  get_history();
}, 1000*60*5); // 5 minutes interval.

const get_history = () => {
  log.logWithTime('get_history is called! ( interval 5 minutes )');
  for(let i = 0; i < names.length; i++) {
    setTimeout(() => {
      request.get(history_url + names[i].market_name, (err, response, body) => {
        log.logWithTime(history_url + names[i].market_name);
        try {
          body = JSON.parse(body);
        } catch (e) {
          log.logWithTime(err);
          return;
        }
  
        let results = body.result;
  
        if(results !== null && results.length !== null)
          for(let j = 0; j < results.length; j++) {
            let obj = results[j];
            connection.query('INSERT INTO history_' + util.parseMarketName(names[i].market_name) + ' (id, timestamp, total, order_type) VALUES (?, ?, ?, ?)',
            [obj.Id, obj.TimeStamp, obj.Total, obj.OrderType], (err, results) => {
              if(err) {
                // occured Error: ER_DUP_ENTRY: Duplicate entry 'XXXXXX' for key 'id'
                // 나중에 쿼리 자체를 안날리도록 수정해야겠다.
                // log.logWithTime(err);
                return;
              }
            });
          }
      });
    }, i * 1000);
  }
}
