import { argv } from "yargs";

const env = Object.assign({}, argv, process.env);
export { env }
