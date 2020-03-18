import { Model } from "../modules/User";

export interface IndexServer {
  getUser(id?:string): Model.User;
}