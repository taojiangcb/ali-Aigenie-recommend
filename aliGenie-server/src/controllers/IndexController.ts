import { interfaces, TYPE, controller, httpGet, httpPost } from "inversify-koa-utils";
import { provideThrowable, TAGS, TYPES } from "../ioc/Ioc";
import { inject } from "inversify";
import Router = require("koa-router");
import { Context } from "koa";
import { iReqBody } from '../modules/AligenieStruct';
import { IRouterContext } from "koa-router";
import { iMovieInfo } from '../modules/IMoveStruct';
import { IndexServer } from "../interface/IndexService";
import { Log } from "../log/Log";

const OK = "OK";
const OKEND = "OKEND";
const MOVIETYPE = 'movietype';
const DEFAULT_TYPE = "豆瓣高分";

@controller('/api')
@provideThrowable(TYPE.Controller, 'IndexController')
export class IndexController implements interfaces.Controller {
  private indexService: IndexServer;
  constructor(@inject(TAGS.InderSvervices) indexService) {
    console.log('indexService', indexService);
    this.indexService = indexService;
  }

  @httpPost('/begin')
  private async begin(ctx: IRouterContext) {
    let repBody: iReqBody = ctx.request.body as iReqBody;
    Log.infoLog(JSON.stringify(repBody));
    if (repBody.slotEntities == null || repBody.slotEntities == undefined || repBody.slotEntities.length === 0 || repBody.utterance == repBody.skillName) {
      let req = this.indexService.question(ctx, OK, '你好,要给您推荐一部电影吗');
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
    }
    else {
      let [okEntry] = repBody.slotEntities.filter(item => {
        return item.intentParameterName === OK
      })
      let [okEnd] = repBody.slotEntities.filter(item => {
        return item.intentParameterName === OKEND
      })
      if (okEntry && okEntry.liveTime == 0) {
        let movieInfo: iMovieInfo = await this.indexService.getMovie(DEFAULT_TYPE, ctx);
        let moveReturn = await this.indexService.returnMovieInfo(ctx, movieInfo);
        let reply = moveReturn.returnValue.reply;
        let req = this.indexService.question(ctx, OKEND, reply + ",这部行吗");
        Log.infoLog(JSON.stringify(req));
        ctx.body = req;
      }
      else if (okEnd && okEnd.liveTime === 0) {
        let req = this.indexService.returnMessage('谢谢，期待您的下次使用');
        Log.infoLog(JSON.stringify(req));
        ctx.body = req;
      }
      else {
        let req = this.indexService.question(ctx, 'EMPTY', `我没听明白,你能在重试试一次说${repBody.skillName}吗`);
        Log.infoLog(JSON.stringify(req));
        ctx.body = req;
      }
    }
  }

  @httpPost('/recommendmovie')
  private async recommendmovie(ctx: IRouterContext) {
    let repBody: iReqBody = ctx.request.body as iReqBody;
    Log.infoLog(JSON.stringify(repBody));
    let [okEnd] = repBody.slotEntities.filter(item => {
      return item.intentParameterName === OKEND
    })
    if (okEnd && okEnd.liveTime === 0) {
      let req = this.indexService.returnMessage('谢谢，期待您的下次使用');
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
    }
    else {
      let movieInfo: iMovieInfo = await this.indexService.getMovie(DEFAULT_TYPE, ctx);
      let moveReturn = this.indexService.returnMovieInfo(ctx, movieInfo);
      let reply = moveReturn.returnValue.reply;
      let req = this.indexService.question(ctx, OKEND, reply + ",这部行吗");
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
    }
  }

  @httpPost('/dislike')
  private async dislike(ctx: IRouterContext) {
    let repBody: iReqBody = ctx.request.body as iReqBody;
    Log.infoLog(JSON.stringify(repBody));
    let [okEnd] = repBody.slotEntities.filter(item => {
      return item.intentParameterName === OKEND
    })
    if (okEnd && okEnd.liveTime === 0) {
      let req = this.indexService.returnMessage('谢谢，期待您的下次使用');
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
    }
    else {
      let [movietype] = repBody.slotEntities.filter(item => {
        return item.intentParameterName === MOVIETYPE
      })
      if (movietype && movietype.liveTime === 0) {
        let type: string = movietype.standardValue;
        let movieInfo: iMovieInfo = await this.indexService.getMovie(type, ctx);
        if (movietype) {
          let moveReturn = this.indexService.returnMovieInfo(ctx, movieInfo);
          let reply = moveReturn.returnValue.reply;
          let req = this.indexService.question(ctx, OKEND, reply + ",这部行吗");
          Log.infoLog(JSON.stringify(req));
          ctx.body = req;
        }
      }
      else {
        let req = this.indexService.question(ctx, MOVIETYPE, '那您可以告诉我你喜欢的其他类型。');
        Log.infoLog(JSON.stringify(req));
        ctx.body = req;
      }
    }
  }

  @httpPost('/change')
  private async change(ctx: IRouterContext) {
    let repBody: iReqBody = ctx.request.body as iReqBody;
    Log.infoLog(JSON.stringify(repBody));

    let [okEnd] = repBody.slotEntities.filter(item => {
      return item.intentParameterName === OKEND
    })

    if (okEnd && okEnd.liveTime === 0) {
      let req = this.indexService.returnMessage('谢谢，期待您的下次使用');
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
      return;
    }

    let [movietype] = repBody.slotEntities.filter(item => {
      return item.intentParameterName === MOVIETYPE
    })

    let type: string = movietype ? movietype.standardValue : DEFAULT_TYPE;
    let movieInfo: iMovieInfo = await this.indexService.getMovie(type, ctx);
    let moveReturn = this.indexService.returnMovieInfo(ctx, movieInfo);
    let reply = moveReturn.returnValue.reply;
    let req = this.indexService.question(ctx, OKEND, reply + ",这部行吗");
    Log.infoLog(JSON.stringify(req));
    ctx.body = req;
  }

  @httpPost('/selectType')
  private async selectType(ctx: IRouterContext) {
    let repBody: iReqBody = ctx.request.body as iReqBody;
    Log.infoLog(JSON.stringify(repBody));

    let [okEnd] = repBody.slotEntities.filter(item => {
      return item.intentParameterName === OKEND
    })

    if (okEnd && okEnd.liveTime === 0) {
      let req = this.indexService.returnMessage('谢谢，期待您的下次使用');
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
      return;
    }

    let [movietype] = repBody.slotEntities.filter(item => {
      return item.intentParameterName === MOVIETYPE
    })

    if (movietype && movietype.liveTime === 0) {
      let type: string = movietype ? movietype.standardValue : DEFAULT_TYPE;
      let movieInfo: iMovieInfo = await this.indexService.getMovie(type, ctx);
      let moveReturn = this.indexService.returnMovieInfo(ctx, movieInfo);
      let reply = moveReturn.returnValue.reply;
      let req = this.indexService.question(ctx, OKEND, reply + ",这部行吗");
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
    }
    else {
      let req = this.indexService.question(ctx, MOVIETYPE, '我这有:热门,最新,经典,喜剧,恐怖,豆瓣高分等类型,您想要看哪种？');
      Log.infoLog(JSON.stringify(req));
      ctx.body = req;
    }
  }
}