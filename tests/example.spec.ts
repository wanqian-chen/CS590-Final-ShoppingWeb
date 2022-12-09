import { test, expect } from '@playwright/test';

test('customer functions', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/')

  await expect(page).toHaveTitle(/UI/)

  // login
  await page.click('#login > a')
  await page.getByLabel('username').fill('alice')
  await page.getByLabel('password').fill('alice')
  await page.click('#kc-login')

  // start ordering
  await page.click('#order-now > a')
  await page.click('#choose-item')
  await page.selectOption("#choose-item", { value: "milk" })
  await page.click('#__BVID__12 > div:nth-child(1) > label > span')
  await page.click('#add-to-cart')
  await page.click('#clear-cart')
  await page.click('#choose-item')
  await page.selectOption("#choose-item", { value: "coffee" })
  await page.click('#__BVID__15 > div:nth-child(2) > label > span')
  await page.click('#add-to-cart')
  await page.click('#submit-order')

  // see history orders
  await page.click('#history-orders > a')

});

test('operator functions', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/')

  await expect(page).toHaveTitle(/UI/)

  // login
  await page.click('#login > a')
  await page.getByLabel('username').fill('jim')
  await page.getByLabel('password').fill('jim')
  await page.click('#kc-login')

  // revise menu
  await page.click('#menu > a')
  await page.click('body > div > div > div.accordion > div:nth-child(2) > header > button.btn.btn-info.collapsed')


});
