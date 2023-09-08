import { expect } from "@playwright/test";
import { Navigation } from "./navigation";
import { isDesktopViewPort } from "./../utils/isDesktopViewport";

export class ProductPage {
	// constructor
	constructor(page) {
		this.page = page;
		// add buttons
		this.addButtons = page.locator('[data-qa="product-button"]');
		// dropdown
		this.sortDropDown = page.locator('[data-qa="sort-dropdown"]');
		// product tiles
		this.productTitle = page.locator('[data-qa="product-title"]');
	}

	visit = async () => {
		await this.page.goto("/");
	};

	addProductToBasket = async (index) => {
		// nth will give 0 index element
		const specificAddButton = this.addButtons.nth(index);
		await specificAddButton.waitFor();
		await expect(specificAddButton).toHaveText("Add to Basket");
		// getting getBasketCounter function from navigation
		const navigation = new Navigation(this.page);
		// run only on desktop viewport
		let basketCountBeforeAdding;
		if (isDesktopViewPort(this.page)) {
			basketCountBeforeAdding = await navigation.getBasketCount();
		}

		await specificAddButton.click();
		await expect(specificAddButton).toHaveText("Remove from Basket");
		// run only on desktop viewport
		let basketCountAfterAdding;
		if (isDesktopViewPort(this.page)) {
			basketCountAfterAdding = await navigation.getBasketCount();
			expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding);
		}
	};

	sortByCheapest = async () => {
		// wait for the element to exist
		await this.sortDropDown.waitFor();
		// get order of products
		await this.productTitle.first().waitFor();
		const productTitlesBeforeSorting = await this.productTitle.allInnerTexts();
		await this.sortDropDown.selectOption("price-asc");
		// get order of products
		const productTitlesAfterSorting = await this.productTitle.allInnerTexts();
		// expect that order changes
		expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting);
	};
}
