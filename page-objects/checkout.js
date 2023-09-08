import { expect } from "@playwright/test";

export class Checkout {
	constructor(page) {
		this.page = page;
		this.basketCard = page.locator('[data-qa="basket-card"]');
		this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
		this.basketItemRemoveButton = page.locator(
			'[data-qa="basket-card-remove-item"]'
		);
		// continue to checkout
		this.continueToCheckoutButton = page.locator(
			'[data-qa="continue-to-checkout"]'
		);
	}

	removeCheapestProduct = async () => {
		await this.basketCard.first().waitFor();
		// counting the basket cards
		const itemsBeforeRemoval = await this.basketCard.count();
		await this.basketItemPrice.first().waitFor();
		const allPriceTexts = await this.basketItemPrice.allInnerTexts();
		console.warn({ allPriceTexts }); // [499$, 599$, 320$]
		// iterate over items
		const justNumbers = allPriceTexts.map((element) => {
			const withoutDollarSign = element.replace("$", "");
			return parseInt(withoutDollarSign, 10);
		});
		// getting minimum price
		const smallestPrice = Math.min(justNumbers);
		// getting the index of smallest number
		const smallestPriceIndex = justNumbers.indexOf(smallestPrice);
		const specficRemoveButton =
			this.basketItemRemoveButton.nth(smallestPriceIndex);
		await specficRemoveButton.waitFor();
		await specficRemoveButton.click();
		// checking if the items count is reduced
		// const itemsAfterRemoval = await this.basketCard.count();
		await expect(this.basketCard).toHaveCount(itemsBeforeRemoval - 1);
		//await this.page.pause();
	};

	continueToCheckout = async () => {
		await this.continueToCheckoutButton.waitFor();
		await this.continueToCheckoutButton.click();
		await this.page.waitForURL(/\/login/);
	};
}
