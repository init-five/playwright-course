export const isDesktopViewPort = (page) => {
	// returns true or false
	const size = page.viewportSize();
	return size.width >= 600;
};
