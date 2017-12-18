const Router = require('../base');
const fs = require('fs');
const fileList = fs.readdirSync('./mock/example/');

let routes = {};
fileList.forEach(function (fileName) {
    let [ , fileNameWithoutSuffix] = fileName.match(/(.*)\.(.*)/);
    routes[`/example/detail/${fileNameWithoutSuffix}`] = `example/detail/${fileName}`;
});

new Router().mixRoutes(routes);