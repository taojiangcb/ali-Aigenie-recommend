

export interface iMovieInfo {
  id: number;
  rate: string;
  title: string;
  type: string;
  recommend: boolean;
  returnStr?: string;
}

export type Pool = { type: string, list: iMovieInfo[] }

export interface iUserPool {
  userId: string;
  pool: Map<string, iMovieInfo[]>;
  date?: string;
}

export function CreateMovieInfo(data: any, type: string): iMovieInfo {
  // cover: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2570615901.jpg"
  // cover_x: 750
  // cover_y: 1000
  // id: "30391241"
  // is_new: true
  // playable: false
  // rate: "7.4"
  // title: "切尔诺贝利·禁区电影版"
  // url: "https://movie.douban.com/subject/30391241/"
  if (!data) return null;
  let { title, rate, id } = data;
  return { title, rate, type, id, recommend: false }
}