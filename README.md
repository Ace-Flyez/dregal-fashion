# D’REGAL website redesign

A fresh vanilla HTML, CSS and JavaScript redesign. No framework or build step is required.

## Preview locally

1. Extract the ZIP.
2. Open this folder in VS Code.
3. Run `index.html` with Live Server, or open the file directly in a browser.
4. Internet access is required for the remote Unsplash photographs and Google Fonts.

## Typography

- Display/headline: **Krona One**.
- General UI/body: **Inter**, selected as a close, widely available visual match to the clean sans-serif body treatment observed on Remote WorkHER. The live site's exact font could not be independently verified from the publicly indexed page source, so this is an informed substitute, not a claim that Remote WorkHER uses Inter.
- If you want an exact match, inspect a paragraph or button on Remote WorkHER in Chrome DevTools and check Computed > Rendered Fonts, then update `--body` in `css/style.css`.

## Images

All current campaign/product images are real, remote Unsplash image URLs and are temporary references. Replace these URLs in the HTML and `js/products.js` with D’REGAL-owned photography before launch. Some external photo subjects may not exactly represent the actual garments.

## Confirmed product data

- Signature Joggers: ₦15,000. Colours listed as Black, Grey, Dark grey.
- Relaxed Jorts: ₦9,500.
- Essential Tank Top: ₦18,000.

Unconfirmed sizes, colour options for jorts/tank tops, delivery charges and production timing are not invented. They are presented as details to confirm with D’REGAL.

## Functionality

- Responsive navigation.
- Product category filtering, search and sorting.
- Product detail image selection, jogger colour selection and quantity control.
- Local-storage shopping bag with quantity adjustment and removal.
- WhatsApp order summary and contact enquiry form.
- FAQ accordions.
- NGN/USD display toggle (uses a simple default rate unless the site is later connected to a verified exchange-rate service).
- Newsletter UI is a placeholder until an email service is connected.

## Before publishing

- Replace temporary images with D’REGAL product and campaign photography.
- Add the approved logo and favicon assets.
- Confirm size guides, available variants, custom production times, delivery fees, payment arrangements and final return/exchange terms.
- Connect a real newsletter provider if sign-up collection is required.
- Test the actual live pages on physical iPhone and Android devices, and confirm all external image/font sources load in the target market.
