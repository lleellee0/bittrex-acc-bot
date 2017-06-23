const dateTime = require('node-datetime');
const dt = dateTime.create();
dt.format('m/d/Y H:M:S');

exports.logWithTime = (message) => {
  console.log(new Date(dt.now()) + ' ' + message);
}
