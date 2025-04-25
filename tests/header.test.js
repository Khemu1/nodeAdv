const Page = require("./helpers/page");
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
}, 90000);

afterEach(async () => {
  console.log("closing ");
  await page.close();
}, 90000);

test("launch a browser and navigate", async () => {
  console.log("Navigation complete. URL:", page.url());
  await page.screenshot({ path: "page.png" });
  // tring to reach the logo
  const text = await page.getContentOf("a.brand-logo");
  expect(text).toEqual("Blogster");
}, 90000);

test("click on the login button to start oauth flow", async () => {
  await Promise.all([
    page.waitForNavigation({ waitUntil: "load" }),
    page.click(".right a"),
  ]);

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
}, 90000);
test("login with google", async () => {
  await page.goto("http://localhost:3000", {
    waitUntil: "load",
    timeout: 90000,
  });
  await page.login(); // Assuming this handles the login flow
  await page.waitForSelector('a[href="/auth/logout"]', {
    timeout: 90000,
  });
  const logoutText = await page.getContentOf('a[href="/auth/logout"]');
  expect(logoutText).toEqual("Logout");
}, 90000); // Increase timeout for this test
