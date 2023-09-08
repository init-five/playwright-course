import { test, expect } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";
import { ProductPage } from "../page-objects/productPage";
import { Navigation } from "../page-objects/navigation";
import { Checkout } from "../page-objects/checkout";
import { LoginPage, Register } from "../page-objects/loginPage";
import { RegisterPage } from "../page-objects/registerPage";
import { DeliveryDetails } from "../page-objects/deliveryDetails";
import { deliveryDetails as userAddress } from "../data/deliveryDetails";
import { PaymentPage } from "../page-objects/paymentPage";
import { paymentDetails } from "../data/paymentdetails";

test("New user full end-to-end test journey", async ({ page }) => {
	// initiate the class
	const productsPage = new ProductPage(page);
	await productsPage.visit();
	await productsPage.sortByCheapest();
	await productsPage.addProductToBasket(0);
	await productsPage.addProductToBasket(1);
	await productsPage.addProductToBasket(2);
	const navigation = new Navigation(page);
	await navigation.goToCheckout();

	const checkout = new Checkout(page);
	await checkout.removeCheapestProduct();
	await checkout.continueToCheckout();

	const login = new LoginPage(page);
	await login.moveToSignup();

	const registerPage = new RegisterPage(page);
	const email = uuidv4() + "@gmail.com";
	const password = uuidv4();
	await registerPage.signUpAsNewUser(email, password);

	const deliveryDetails = new DeliveryDetails(page);
	await deliveryDetails.fillDetails(userAddress);
	await deliveryDetails.saveDetails();
	await deliveryDetails.continueToPayment();

	const paymentPage = new PaymentPage(page);
	await paymentPage.activateDiscount();
	await paymentPage.fillPaymentDetails(paymentDetails);
	await paymentPage.completePayment();
	//await page.pause();
});
