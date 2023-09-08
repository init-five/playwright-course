import { test, expect } from "@playwright/test";

test.skip("proudct page add to basket", async ({ page }) => {
	await page.goto("/");
	const addToBasketButton = page.locator('[data-qa="product-button"]').first();
	const headerBasketCount = page.locator('[data-qa="header-basket-count"]');
	const checkoutButton = page.getByRole("link", { name: "Checkout" });

	await addToBasketButton.waitFor();
	// using an expect
	await expect(addToBasketButton).toHaveText("Add to Basket");
	await expect(headerBasketCount).toHaveText("0");
	await addToBasketButton.click();
	await headerBasketCount.waitFor();
	await expect(headerBasketCount).toHaveText("1");
	await expect(addToBasketButton).toHaveText("Remove from Basket");

	await checkoutButton.waitFor();
	await checkoutButton.click();
	await page.waitForURL("/basket");

	//await page.pause();
});
