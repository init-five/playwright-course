import { expect } from "@playwright/test";

export class PaymentPage {
	constructor(page) {
		this.page = page;
		this.discountCode = page
			.frameLocator('[data-qa="active-discount-container"]')
			.locator('[data-qa="discount-code"]');
		this.discountInput = page.locator('[data-qa="discount-code-input"]');
		this.activateDiscountButton = page.locator(
			'[data-qa="submit-discount-button"]'
		);
		this.discountActivatedMessage = page.locator(
			'[data-qa="discount-active-message"]'
		);
		this.discountedValue = page.locator(
			'[data-qa="total-with-discount-value"]'
		);
		this.totalValue = page.locator('[data-qa="total-value"]');
		this.creditCardOwnerInput = page.locator('[data-qa="credit-card-owner"]');
		this.creditCardNumberInput = page.locator('[data-qa="credit-card-number"]');
		this.validUntilInput = page.locator('[data-qa="valid-until"]');
		this.creditCardCVCInput = page.locator('[data-qa="credit-card-cvc"]');
		this.payButton = page.locator('[data-qa="pay-button"]');
	}

	activateDiscount = async () => {
		await this.discountCode.waitFor();
		const code = await this.discountCode.innerText();
		await this.discountInput.waitFor();
		// option 1 for laggy inputs
		await this.discountInput.fill(code);
		await expect(this.discountInput).toHaveValue(code);
		// option 2 using keyboard
		// 1000 milliseconds wait b/w each keystroke
		// await this.discountInput.focus();
		// await this.page.keyboard.type(code, { delay: 1000 });
		// expect(await this.discountInput.inputValue()).toBe(code);
		await this.activateDiscountButton.waitFor();
		await expect(this.discountActivatedMessage).toBeHidden();
		//expect(await this.discountActivatedMessage.isVisible()).toBe(false);
		await this.activateDiscountButton.click();
		await this.discountActivatedMessage.waitFor();
		await this.discountedValue.waitFor();
		const discounted_total = await this.discountedValue.innerText();
		const discounted_total_withoutDollar = discounted_total.replace("$", "");
		const actual_total = await this.totalValue.innerText();
		const actual_total_withoutDollar = actual_total.replace("$", "");
		console.warn(discounted_total_withoutDollar, actual_total_withoutDollar);
		expect(parseInt(discounted_total_withoutDollar)).toBeLessThan(
			parseInt(actual_total_withoutDollar)
		);
	};

	fillPaymentDetails = async (paymentDetails) => {
		await this.creditCardOwnerInput.waitFor();
		await this.creditCardOwnerInput.fill(paymentDetails.creditCardOwner);
		await this.creditCardNumberInput.waitFor();
		await this.creditCardNumberInput.fill(paymentDetails.creditCardNumber);
		await this.validUntilInput.waitFor();
		await this.validUntilInput.fill(paymentDetails.validUntil);
		await this.creditCardCVCInput.waitFor();
		await this.creditCardCVCInput.fill(paymentDetails.creditcardCVC);
	};

	completePayment = async () => {
		await this.payButton.waitFor();
		await this.payButton.click();
		await this.page.waitForURL("/thank-you");
	};
}
