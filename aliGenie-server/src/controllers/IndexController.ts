import { interfaces, TYPE, controller, httpGet } from "inversify-koa-utils";
import { provideThrowable, TAGS, TYPES } from "../ioc/Ioc";
import { inject } from "inversify";
import Router = require("koa-router");
import { Model } from "../modules/User";
import { Context } from "koa";

@controller('/')
@provideThrowable(TYPE.Controller, 'IndexController')
export class IndexController implements interfaces.Controller {
  private indexService;
  constructor(@inject(TAGS.InderSvervices) indexService) {
    console.log('indexService', indexService);
    this.indexService = indexService;
  }

  @httpGet('/')
  private async index(ctx: Context) {
    const res: Model.User = this.indexService.getUser("0");
    ctx.body = await ctx.render("index", {
      name: res.name,
      email: res.email
    })
  }
}