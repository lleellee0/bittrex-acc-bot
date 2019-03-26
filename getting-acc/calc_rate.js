const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');

let connection = mysql.createConnection(db_conf.module);

connection.connect();

const log = require('../util/log.js');

let names;

connection.query('SELECT * FROM market_names', (err, results) => {
  if(err) throw err;
  names = results;
});

setInterval(() => {
  sum_volume();
}, 1000*60*1); // 1 minutes interval.

const sum_volume = () => {
  log.logWithTime('calc_rate is called! ( interval 1 minutes )');

  for(let i = 0; i < names.length; i++) {
    for(let j = 0; j < timestamp_array.length; j++) {
      connection.query('SELECT * FROM history WHERE market_name=? AND timestamp > ' + timestamp_array[j], [names[i].market_name], (err, results) => {
        if(err) return;

        let target_column_name;

        switch(j) {
          case 0: // one hour
            target_column_name = 'one_hour';
            break;
          case 1: // three hours
            target_column_name = 'three_hour';
            break;
          case 2: // six hours
            target_column_name = 'six_hour';
            break;
          case 3: // half days
            target_column_name = 'half_day';
            break;
          case 4: // one day
            target_column_name = 'one_day';
            break;
          case 5: // three days
            target_column_name = 'three_day';
            break;
          case 6: // one week
            target_column_name = 'one_week';
            break;
        }

        let buy_total_sum = 0;
        let sell_total_sum = 0;

        for(let k = 0; k < results.length; k++) {
          if(results[k].order_type === 'BUY')
            buy_total_sum += results[k].total;
          else if(results[k].order_type === 'SELL')
            sell_total_sum += results[k].total;
        }

        connection.query('UPDATE buy_volume set ' + target_column_name + '=? WHERE market_name=?', [buy_total_sum, names[i].market_name], (err, results) => {
          if(err) throw err;
        });

        connection.query('UPDATE sell_volume set ' + target_column_name + '=? WHERE market_name=?', [sell_total_sum, names[i].market_name], (err, results) => {
          if(err) throw err;
        });
      });
    }
  }
}
