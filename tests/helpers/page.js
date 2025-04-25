const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/session-factory");
const userFactory = require("../factories/user-factory");
class CustomPage {
  // can't access private attributes or methods of a class with proxies
  // you can use a warpper class or instead check for the prop exists if it doesn't exist
  // bind it to the custom class
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: (target, property, receiver) => {
        if (target[property]) {
          return target[property];
        }

        let value = browser[property];
        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? browser : this, args);
          };
        }

        value = page[property];
        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? page : this, args);
          };
        }

        return value;
      },
    });
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    // add the cookies
    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    // refresh the page
    await this.page.goto("http://localhost:3000/blogs", {
      waitUntil: "load",
      timeout: 90000,
    });
  }

  constructor(page) {
    this.page = page;
  }

  async getContentOf(selector) {
    return await this.page.$eval(selector, (el) => {
      return el.innerHTML;
    });
  }
  async get(path) {
    return await this.page.evaluate(async (_path) => {
      const res = await fetch(_path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });
      return await res.json();
    }, path);
  }
  async post(path, body) {
    return await this.page.evaluate(
      async (_path, _body) => {
        const res = await fetch(_path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_body),
          credentials: "same-origin",
        });
        return await res.json();
      },
      path,
      body
    );
  }
}

module.exports = CustomPage;
