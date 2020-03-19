import { IndexServer } from '../interface/IndexService';
import { Model } from '../modules/User';
import { provide } from 'inversify-binding-decorators';
import { TAGS } from '../ioc/Ioc';
import { IRouterContext } from 'koa-router';

import Axios, { AxiosResponse } from 'axios'
import { iUserPool, iMovieInfo, CreateMovieInfo } from '../modules/IMoveStruct';
import { Log } from '../log/Log';
import { request } from 'inversify-koa-utils';
import { iReqBody, iResBody, ReturnValue } from '../modules/AligenieStruct';
import moment from 'moment';


//用户缓存---后面改redis
let userMap: Map<string, iUserPool> = new Map();

@provide(TAGS.InderSvervices)
export class IndexService implements IndexServer {

  constructor() { }
  //private url:string = 'https://movie.douban.com/j/search_subjects?type=movie&tag=%E6%9C%80%E6%96%B0&page_limit=50&page_start=0'
  // private url: string = 'https://movie.douban.com/j/search_subjects?type=movie&tag={0}page_limit={1}&page_start=0'
  public async getMovie(type: string, ctx: IRouterContext, limited: number = 300) {
    let userId = this.getUserId(ctx);
    if (userMap.has(userId)) {
      let curDate: string = moment(Date.now()).format("YYYYMMDD");
      let userPool = userMap.get(userId);
      if (userPool.date === curDate) {
        let typeList = userPool.pool.get(type);
        if (typeList) {
          for (let i = 0; i < typeList.length; i++) {
            if (!typeList[i].recommend) {
              typeList[i].recommend = true;
              return typeList[i];
            }
          }
        }
      }
    }
    let tag: string = encodeURIComponent(type);
    let url = `https://movie.douban.com/j/search_subjects?type=movie&tag=${tag}&page_limit=${limited}&page_start=0`;
    try {
      let res: AxiosResponse = await Axios.get(url, {
        headers: {
          referer: 'https://movie.douban.com',
          host: 'movie.douban.com'
        }
      })
      if (res.status === 200) {
        let subjects: any[] = res.data.subjects;
        let movieList: iMovieInfo[] = subjects.map(item => {
          return CreateMovieInfo(item, type);
        });
        movieList.sort((a, b) => (Number(b.rate) - Number(a.rate)))
        if (userMap.has(userId)) {
          let userPool = userMap.get(userId);
          userPool.pool.set(type, movieList);
        }
        else {
          let pool: Map<string, iMovieInfo[]> = new Map();
          pool.set(type, movieList);
          let userPool: iUserPool = {
            userId: userId, pool, date: moment(Date.now()).format('YYYYMMDD')
          }
          userMap.set(userId, userPool);
        }
        movieList[0].recommend = true;
        return movieList[0];
      }
      else {
        Log.errorLog(res.statusText)
      }
    }
    catch (e) {
      Log.errorLog(e.stack || e.message)
    }
    return null;
  }

  public getUserId(ctx: IRouterContext) {
    let reqBody: iReqBody = ctx.request.body as iReqBody;
    if (reqBody && reqBody.requestData) {
      let uuid = reqBody.requestData.userOpenId || reqBody.requestData.deviceOpenId || '___test__';
      return uuid;
    }
  }


  /**产生一个追问 */
  public question(ctx: IRouterContext, paramName: string, q: string) {
    let reqBody: iReqBody = ctx.request.body;
    // "returnCode": "0",
    // "returnErrorSolution": "",
    // "returnMessage": "",
    // "returnValue": {
    //   "reply": "请问您要查询哪个城市的天气？",
    //   "resultType": "ASK_INF",
    //   "askedInfos": [
    //     {
    //       "parameterName": "city",
    //       "intentId": "34567"
    //     }
    //   ],
    //   "executeCode": "SUCCESS",
    //   "msgInfo": ""
    // }
    let resp: iResBody = {
      returnCode: "0",
      returnValue: {
        reply: q,
        resultType: "ASK_INF",
        askedInfos: [
          {
            parameterName: paramName,
            intentId: reqBody.intentId
          }
        ],
        executeCode: "SUCCESS"
      }
    }
    return resp;
  }

  public returnMessage(str: string) {
    let returnStr = str;
    let resp = {
      returnCode: '0',
      returnValue: {
        reply: returnStr,
        resultType: "RESULT",
        executeCode: "SUCCESS",

      }
    }
    return resp;
  }

  public returnMovieInfo(ctx: IRouterContext, movieInfo: iMovieInfo, error?: string): iResBody {
    let resp: iResBody = null;
    if (error) {
      resp = {
        returnCode: '1',
        returnErrorSolution: error,
        returnValue: {
          reply: '请您再尝试一次',
          resultType: 'RESULT',
          executeCode: 'REPLY_ERROR'
        }
      }
      return resp;
    }

    let returnStr = `${movieInfo.title},这部在豆瓣评分为:${movieInfo.rate}`;
    resp = {
      returnCode: '0',
      returnValue: {
        reply: returnStr,
        resultType: "RESULT",
        executeCode: "SUCCESS",

      }
    }
    return resp;
  }
}