require("dotenv").config();
const puppeteer = require("puppeteer");

const LOGIN = process.env.FB_LOGIN;
const PASSWORD = process.env.FB_PASS;
const PAGE_NAME = process.env.FB_PAGE_NAME;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const login = async (login, pass) => {
    await page.goto("https://www.facebook.com/login", {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("#email");

    await page.type("#email", login);
    await page.type("#pass", pass);

    await page.click("#loginbutton");

    console.log("login done");
    await page.waitForNavigation();
  };

  const createFanPage = async (pageName) => {
    await page.goto("https://www.facebook.com/pages/creation/", {
      waitUntil: "networkidle2",
    });

		await page.type("#jsc_c_f", pageName);
		await page.type("#jsc_c_l", "description");

    // await page.screenshot({
    //   path: "./facebook.png",
    // });
  };
  await login(LOGIN, PASSWORD);
  await createFanPage(PAGE_NAME);
})();
