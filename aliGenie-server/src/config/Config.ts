import { env } from '../env/Evn'
import { iConfig } from './IConfig';

let mode = env.mode || "dev";

let importCfg = require(`./Config.${mode}`).config;
let config:iConfig = importCfg || {};

export { config }