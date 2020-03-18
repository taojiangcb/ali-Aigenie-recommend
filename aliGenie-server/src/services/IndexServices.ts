import { IndexServer } from '../interface/IndexService';
import { Model } from '../modules/User';
import { provide } from 'inversify-binding-decorators';
import { TAGS } from '../ioc/Ioc';

@provide(TAGS.InderSvervices)
export class IndexService implements IndexServer {
  private users: Model.User[] = [
    {
      email: "yuanzhijia@yidengfe.com",
      name: "老袁"
    },
    {
      email: "laowang@yidengfe.com",
      name: "老王"
    }
  ]
  constructor() { }

  getUser(id?: string): Model.User {
    return this.users[0];
  }
}