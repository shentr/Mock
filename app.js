const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const Router = require('./router/index');

let count = 1;
/*
*       自定义路由：需在router文件夹中定义路由
* 注意：1.自定义的路由覆盖自动路由
* */
(function defineRouter () {
    const routes = new Router().getRoutes();
    for (let filePath in routes) {
        app.all(filePath, function (req, res) {
            const localFilePath = path.resolve('mock', routes[filePath]);
            try {
                setHeader(req, res);
                const content = fs.readFileSync(localFilePath);
                res.end(content);
                console.log(`${req.method} OK! ${filePath}   ->   ${localFilePath}  *** ${count++}`);
            } catch (e) {
                console.log(`ERROR! ${e}      ${count++}`);
            }
        })
    }
})();
/*
*       自动路由，根据请求的路径在/mock相应路径中寻找文件。
* 注意：1.新增文件在/mock文件夹里的路径需和请求的path相对应
*       2.新增文件在/mock文件夹里的路径所有下划线风格转驼峰
* */
(function autoDefineRouter () {
    app.all(/.*/, function(req, res) {
        let [filePath='', fileDir='', fileName=''] = req.url.match((/(.*\/)(.*)/));
        let [ , suffix=''] = fileName.match(/.*(\..*)/) || [];
        let localFilePath = filePath;
        if (!suffix) {
            localFilePath += '.json';
        }
        localFilePath = localFilePath.replace(/\_(\w)/g, function(all, letter){   // 下划线转驼峰
            return letter.toUpperCase();
        });
        localFilePath = localFilePath.replace(/^\//, '');  // 删除路径最前面的/
        localFilePath = path.resolve('mock', localFilePath);
        try {
            setHeader(req, res);
            const content = fs.readFileSync(localFilePath);
            res.end(content);
            console.log(`${req.method} OK! ${filePath}  ->  ${localFilePath}  ==auto== *** ${count++}`);
        } catch (e) {
            console.log(`ERROR! ${e}      ${count++}`);
        }
    })
})();

app.listen(80);

function setHeader(req, res) {
    res.set({
        'Content-Type': 'application/json',
        'access-control-allow-origin': req.headers.origin || '*',
        'access-control-allow-credentials': true,
        'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept, X-HTTP-Method-Override, Cookie, AccessToken'
    });
}