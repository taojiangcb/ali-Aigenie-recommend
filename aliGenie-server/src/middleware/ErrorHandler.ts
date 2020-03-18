// import { Log } from "../log/Log";
import { Context } from "koa";

export function simpleError(err) {
  var msg = err.message || "";
  var stack = err.stack || "";
  var err_msg = `${msg}==${stack}`
  // Log.errorLog(err_msg);
}



export async function errorHandler(ctx: Context, next: any) {
  try {
    await next();
  }
  catch (err) {
    // Log.errorLog(JSON.stringify(err.message || err.stack));
    // 未知异常状态，默认使用 500
    if (!err.status) err.status = 500;
    ctx.status = err.status;
    // 获取客户端请求接受类型
    let acceptedType = ctx.accepts('html', 'text', 'json');
    switch (acceptedType) {
      case 'text':
        ctx.type = 'text/plain';
        ctx.body = err.message;
        break;
      case 'json':
        ctx.type = 'application/json';
        ctx.body = { error: err.message }
        break;
      case 'html':
      default:
        // 默认返回页面
        ctx.type = 'text/html';
        ctx.redirect(getUrl(ctx, err.status));
        break;
    }

    /**
    * 根据 Http 状态码，获取重定向页
    * param {number} status http状态码
    */
  }
}
function getUrl(ctx, status) {
  var url: string = "";
  switch (status) {
    case 401: url = '401.html'; break;
    case 404: url = '404.html'; break;
    case 500: url = '500.html'; break;
    case 502: url = '502.html'; break;
    default:
      if (status < 500) {
        url = '40x.html';
      } else {
        url = '50x.html';
        ctx.redirect('50x.html');
      }
  }
  return url;
}