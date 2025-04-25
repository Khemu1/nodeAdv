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
  await page.close();
}, 90000);

describe("when logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await Promise.all([
      page.waitForNavigation({ waitUntil: "load" }),
      page.click("a.btn-floating"),
    ]);
    const url = await page.url();
    expect(url).toMatch(/localhost:3000\/blogs\/new/);
  });
  test("can see form", async () => {
    const label = await page.getContentOf("form label");
    expect(label).toEqual("Blog Title");
  });
  describe("adding invalid inputs ", async () => {
    beforeEach(async () => {
      await page.click("form button[type=submit]");
    });
    test("form should show error message", async () => {
      const titleError = await page.getContentOf(".title .red-text");
      const contentError = await page.getContentOf(".content .red-text");
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
  describe("adding valid inputs and submitting ", async () => {
    beforeEach(async () => {
      await page.type(".title input", "test title");
      await page.type(".content input", "test content");
      await page.click("form button[type=submit]");
    });
    test("should show confirmation page", async () => {
      const confirmationText = await page.getContentOf("form h5");
      expect(confirmationText).toEqual("Please confirm your entries");
      await page.click(".green.btn-flat");
      const url = await page.url();
      expect(url).toMatch(/localhost:3000\/blogs/);
      await page.waitForSelector(".card");
      const cardTitle = await page.getContentOf(".card-title");
      const cardContent = await page.getContentOf("p");
      expect(cardTitle).toEqual("test title");
      expect(cardContent).toEqual("test content");
    });
  });
}, 90000);

describe("user not logged in", () => {
  test("user shouldn't be able to create a blog", async () => {
    const result = await page.post("/api/blogs", {
      title: "test title",
      content: "test content",
    });

    expect(result.error).toContain("You must log in");
  });

  test("should return error when trying to get a list of blogs", async () => {
    const result = await page.get("/api/blogs");
    console.log("result", result);
    expect(result.error).toContain("You must log in");
  });
}, 90000);
