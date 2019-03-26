exports.module = {
    limit_volume: process.env.BAB_LIMIT_VOLUME ? process.env.BAB_LIMIT_VOLUME : 10,
    webserver_port: process.env.BAB_WEB_SERVER_PORT ? process.env.BAB_WEB_SERVER_PORT : 3000
};
