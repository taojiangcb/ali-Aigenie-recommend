import { Container, injectable, inject } from 'inversify';
import { interfaces, controller, InversifyKoaServer, httpGet, TYPE } from 'inversify-koa-utils';
import "reflect-metadata";
import co from "co";
import render from 'koa-swig';
import serve from 'koa-static';

import { config } from './config/Config';
import { buildProviderModule } from './ioc/Ioc';
import { errorHandler } from './middleware/ErrorHandler';

import './controllers/IndexController';
import './services/IndexServices';

const session = require('koa-session');
import bodyparser = require("koa-bodyparser");
import { Log } from './log/Log';
const koaCors = require("koa2-cors");

Log.initConfig();

const container = new Container();
container.load(buildProviderModule());

/*** 当node 进程退出时候处理 */
process.addListener("exit", (code: number) => {
  console.log("exit code" + code);
});

/*** 当node 进程崩溃的时候处理 */
process.addListener("uncaughtException", (err: Error) => {
  if (err.message) { Log.errorLog(err.message); }
  if (err.stack) { Log.errorLog(err.stack); }
})

/*** 当node 进程退出时候处理 */
process.addListener("exit", (code: number) => {
  Log.errorLog("exit code " + code);
});



const server = new InversifyKoaServer(container);
server.setConfig(app => {
  app.use(serve(config.paths.static));
  app.context.render = co.wrap(render({
    root: config.paths.view,
    autoescape: true,
    cache: "memory",
    ext: 'html',
    writeBody: false
  }))

  /** 先要设置跨域 */
  app.use(koaCors({ credentials: true }));
  app.use(bodyparser({ enableTypes: ["json", "from"] }))

}).setErrorConfig(app => {
  app.use(errorHandler)
})

const app = server.build();
// app.use(serve(config.paths.static));

const port: number = config.http_port || 3000;
app.listen(port, () => {
  console.log('server at ' + port);
})