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

    const pageNameLable = await page.$('[aria-label="Page name (required)"]');
    const pageNameElement = await pageNameLable.evaluateHandle(
      (e) => e.firstChild.firstChild.lastChild
    );
    await pageNameElement.type(PAGE_NAME);

    const categoryLable = await page.$('[aria-label="Category (required)"]');
    const categoryInputElement = await categoryLable.evaluateHandle(
      (e) => e.firstChild.firstChild.lastChild.lastChild
    );
    await categoryInputElement.type(PAGE_NAME);
    await categoryInputElement.click();
    await categoryInputElement.click();

    await page.waitForTimeout(2000);

    const categories = await page.$$('[role="option"]');
    await categories[categories.length - 1].click();

    const createPageElement = await page.$('[aria-label="Create Page"]');
    await createPageElement.click();
		console.log("page created");

		await page.waitForTimeout(5000);

		const uploadImageElement = await page.$('[aria-label="Add Profile Picture"]');
		await uploadImageElement.click();
  };


  await login(LOGIN, PASSWORD);
  await createFanPage(PAGE_NAME);
})();
