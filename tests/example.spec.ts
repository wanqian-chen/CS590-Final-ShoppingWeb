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
  await page.click('body > div > div > div.mb-2.custom-control.custom-switch > label')
  // revise existing ingredients
  await page.click('#ingredient-america')
  await page.keyboard.type('n')
  await page.click('body > div > div > div.mb-2.custom-control.custom-switch > label')
  await page.click('body > div > div > div.mb-2.custom-control.custom-switch > label')
  // add and delete ingredient
  await page.click('#menu-add-ingredient-coffee')
  await page.click('#input-ingredient')
  await page.keyboard.type('water')
  await page.click('#menu-cancel-ingredient')  // cancel
  await page.click('#menu-add-ingredient')
  await page.click('#input-ingredient')
  await page.keyboard.type('italian')
  await page.click('#menu-save-ingredient')
  await page.click('#menu-delete-ingredient-italian')
  // add and delete items
  await page.click('#menu-add-item')
  await page.click('#input-item')
  await page.keyboard.type('milktea')
  await page.click('menu-save-item')
  await page.click('#menu-delete-item-milktea')
});
