import { Model } from "../modules/User";
import { IRouterContext } from "koa-router";
import { iMovieInfo } from "../modules/IMoveStruct";
import { iResBody } from "../modules/AligenieStruct";

export interface IndexServer {
  //getUser(id?:string): Model.User;
  getMovie(type: string, ctx: IRouterContext, limited?: number);
  returnMovieInfo(ctx: IRouterContext, movieInfo: iMovieInfo, error?: string):iResBody;
  question(ctx: IRouterContext, paramName: string,q:string);
  returnMessage(str:string);
}