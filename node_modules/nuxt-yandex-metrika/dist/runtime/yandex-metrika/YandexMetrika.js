import chalk from "chalk";
import { Methods } from "./types.js";
export * from "./types.js";
export class YandexMetrika {
  #id;
  #debug = false;
  #verification = null;
  static src(cdn = false) {
    return cdn ? "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js" : "https://mc.yandex.ru/metrika/tag.js";
  }
  constructor(id) {
    this.#id = id;
  }
  get debug() {
    return this.#debug;
  }
  set debug(value) {
    this.#debug = value;
  }
  get verification() {
    return this.#verification;
  }
  set verification(value) {
    this.#verification = value;
  }
  get id() {
    return this.#id;
  }
  init(options = {}) {
    this.#call(Methods.Init, ...arguments);
  }
  addFileExtension(extensions) {
    this.#call(Methods.AddFileExtension, ...arguments);
  }
  extLink(url, options = {}) {
    this.#call(Methods.ExtLink, ...arguments);
  }
  file(url, options) {
    this.#call(Methods.File, ...arguments);
  }
  firstPartyParams(people) {
    this.#call(Methods.FirstPartyParams, ...arguments);
  }
  firstPartyParamsHashed(people) {
    this.#call(Methods.FirstPartyParamsHashed, ...arguments);
  }
  getClientID(cb) {
    this.#call(Methods.GetClientID, ...arguments);
  }
  hit(url = "", options) {
    this.#call(Methods.Hit, ...arguments);
  }
  notBounce(options = {}) {
    this.#call(Methods.NotBounce, ...arguments);
  }
  params(params = {}) {
    this.#call(Methods.Params, ...arguments);
  }
  reachGoal(target, params, callback, ctx) {
    this.#call(Methods.ReachGoal, ...arguments);
  }
  setUserID(userId) {
    this.#call(Methods.SetUserID, ...arguments);
  }
  userParams(params = {}) {
    this.#call(Methods.UserParams, ...arguments);
  }
  #call(type, ...args) {
    if (this.#debug) {
      console.log(`${chalk.bgGreen(chalk.black("[yandex-metrika]"))} ${chalk.blue(type)}`, ...args);
    }
    if (typeof window !== "undefined" && window.ym) {
      window.ym(this.id, type, ...args);
    }
  }
}
