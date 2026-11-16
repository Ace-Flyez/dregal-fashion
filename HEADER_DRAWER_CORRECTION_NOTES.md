# D’REGAL Header and Drawer Correction

## Changes in this update
- Rebuilt the header layout around separate grid areas for the search field and utility controls. The desktop search field now occupies the centre column and no longer shares space with the currency, wishlist, or bag controls.
- Added a compact two-row mobile header: menu, wordmark, wishlist and bag on the first row; a full-width search field on the second row.
- Added a tablet layout with a working navigation drawer rather than hiding all navigation links.
- Standardised the wishlist and shopping bag controls as outline icons with dark, high-contrast count badges.
- Removed the dot after the D’REGAL wordmark in the shared header and mobile drawer brand.
- Updated the mobile drawer navigation to Home, Shop, Our Story, Contact, and FAQ, with outline icons for each item.
- Kept only the current page highlighted. Inactive links remain plain and dark slate, including hover and keyboard focus states.
- Changed Wishlist and Shopping Bag shortcuts to full-width rows with icons and right-aligned count badges.
- Kept the brand story card and placed it above the full-width Dark appearance control. The appearance control opens Light, Dark, and System options.

## Validation
- `npm run lint`: passed.
- `npm run typecheck`: passed (4 browser scripts checked).
- `npm test`: passed (4 tests).
- ZIP structure excludes `.git` metadata.

## Not verified
A live browser visual and interaction test was not available during this update. Please open the site locally and inspect desktop, tablet, and narrow mobile widths before deployment. No deployment or GitHub push was performed.
