import { expect } from "@playwright/test";
import { isDesktopViewPort } from "./../utils/isDesktopViewport";

export class Navigation {
	constructor(page) {
		this.page = page;
		// basket counter
		this.basketCounter = page.locator('[data-qa="header-basket-count"]');
		// checkout button
		this.checkoutLink = page.getByRole("link", { name: "Checkout" });
		// burger button for mobileviewport
		this.mobileBurgerButton = page.locator('[data-qa="burger-button"]');
	}

	getBasketCount = async () => {
		await this.basketCounter.waitFor();
		// returns "1", "2", "3"
		const text = await this.basketCounter.innerText();
		return parseInt(text, 10);
	};

	goToCheckout = async () => {
		// if mobile view, first open the burger menu
		if (!isDesktopViewPort(this.page)) {
			await this.mobileBurgerButton.waitFor();
			await this.mobileBurgerButton.click();
		}

		await this.checkoutLink.waitFor();
		await this.checkoutLink.click();
		await this.page.waitForURL("/basket");
	};
}
