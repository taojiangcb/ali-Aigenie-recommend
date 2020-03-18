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

const container = new Container();
container.load(buildProviderModule());

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
}).setErrorConfig(app => {
  app.use(errorHandler)
})

const app = server.build();
app.use(serve(config.paths.static));

const port: number = config.http_port || 3000;
app.listen(port, () => {
  console.log('server at ' + port);
})