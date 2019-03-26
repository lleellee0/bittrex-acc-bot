const mysql = require('mysql');
const db_conf = require('../conf/db-conf.js');

let connection = mysql.createPool(db_conf.module);

// connection.connect();

const log = require('../util/log.js');
const util = require('../util/util.js');

let names;
const timestamp_array = [
                'date_add(now(), interval -10 hour)',
                'date_add(now(), interval -12 hour)',
                'date_add(now(), interval -15 hour)',
                'date_add(now(), interval -21 hour)',
                'date_add(now(), interval -33 hour)',
                'date_add(now(), interval -81 hour)',
                'date_add(now(), interval -7 day)'
              ];

// const one_hour = 'date_add(now(), interval -10 hour)';
// const three_hour = 'date_add(now(), interval -12 hour)';
// const six_hour = 'date_add(now(), interval -15 hour)';
// const half_day = 'date_add(now(), interval -21 hour)';
// const one_day = 'date_add(now(), interval -33 hour)';
// const three_day = 'date_add(now(), interval -81 hour)';
// const one_week = 'date_add(now(), interval -7 day)';

connection.query('SELECT * FROM market_names', (err, results) => {
  if(err) throw err;
  names = results;
});

setInterval(() => {
  sum_volume();
}, 1000*60*3); // 3 minutes interval.

const sum_volume = () => {
  log.logWithTime('calc_rate is called! ( interval 3 minutes )');

  for(let i = 0; i < names.length; i++) {
    for(let j = 0; j < timestamp_array.length; j++) {
      connection.query('SELECT * FROM history_' + util.parseMarketName(names[i].market_name) + ' WHERE timestamp > ' + timestamp_array[j], (err, results) => {
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
