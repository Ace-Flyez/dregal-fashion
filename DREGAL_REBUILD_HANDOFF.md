# D’REGAL Rebuild Handoff

## Scope and current-state disclaimer

This document records the current codebase and decisions for a future clean rebuild. It does not change the existing website architecture. Claims below distinguish code inspection from genuine browser verification. No browser surface was available during this audit, so rendered layout, console state, responsive behavior, and click interactions are not verified.

## 1. Project structure

### Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage, hero, editorial content, dynamic catalogue rows, custom-made CTA and newsletter UI. |
| `shop.html` | Catalogue page with category navigation, search, filters, sorting, availability and horizontal product rows. |
| `product.html` | Product-detail shell populated from `?id=`. |
| `wishlist.html` | Saved-products page populated from local storage. |
| `about.html` | Brand story, values and editorial content. |
| `contact.html` | Contact details and WhatsApp enquiry form. |
| `faq.html` | FAQ accordions. |
| `size-guide.html` | Size and measurement guidance. |
| `privacy.html` | Privacy information. |
| `terms.html` | Terms and conditions. |
| `refund-policy.html` | Refund policy. |
| `subprocessors.html` | Subprocessor disclosure. |
| `data-requests.html` | Data access/deletion request form. |
| `unsubscribe.html` | Marketing unsubscribe page. |

### Runtime files

- `css/tokens.css`: design-system token layer, including beige palette and dark-theme surface tokens.
- `css/style.css`: all layout, typography, page components, responsive rules, legacy overrides and dark-mode rules. This is currently a large accumulated stylesheet and is the main CSS rebuild risk.
- `js/products.js`: product catalogue, currency state, exchange-rate fallback and `formatPrice()`.
- `js/store.js`: dynamic header/footer/cart shell, local-storage cart and wishlist helpers, theme, currency, search overlay, mobile navigation, compliance initialization, shared product-card renderer and shared carousel controller.
- `js/shop.js`: shop filters, category selection, search query, sorting, availability filtering, catalogue row rendering and delegated product actions.
- `js/product.js`: product-detail rendering, gallery, colour/size/quantity controls, availability handling, wishlist and add-to-cart actions.
- `js/wishlist.js`: wishlist-page rendering and remove/add actions. It now uses the shared `productCard()` renderer.
- `js/compliance.js`: consent, terms acceptance and data-request storage helpers.
- `js/monitoring.js`: lightweight monitoring hook; inspect before replacing.
- `scripts/typecheck.mjs`: syntax/type-style check over browser scripts.
- `tests/compliance.test.mjs`: compliance test entry point.

### Assets and dependencies

- `assets/favicon.svg` is the only local image/SVG asset currently present.
- Product and editorial photography uses remote Unsplash URLs. These are temporary references and should be replaced with D’REGAL-owned photography before launch.
- Fonts are loaded remotely in the HTML/CSS setup: Krona One is used for display typography and Inter for UI/body text.
- No framework, bundler or runtime package dependency is required. `package.json` only provides Node-based check/test scripts.
- External services currently used: Unsplash image delivery, Google Fonts, WhatsApp links, Instagram link, and a best-effort exchange-rate request in `store.js`. There are no API keys or credentials in the project.

### Local run

Open the project in VS Code and run `index.html` with Live Server, or open it directly in a browser. Remote images/fonts require internet access. From the project root, static checks are run with:

```text
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
```

The compliance test currently fails in this managed environment with `spawn EPERM`; that is an environment/process permission failure, not a reported assertion failure.

## 2. Existing functionality and verification status

| Feature | Current implementation | Status |
|---|---|---|
| Homepage | Static content plus dynamic catalogue sections from `products`. | Implemented, not browser-verified. |
| Shop catalogue | Search, category rows, filters, sort controls and availability states in `js/shop.js`. | Implemented, not browser-verified. |
| Product detail | Reads `id` query parameter, renders gallery/options and purchase actions. | Implemented, not browser-verified. |
| Product search | Header search overlay and shop query handling. | Implemented, not browser-verified. |
| Horizontal carousels | Shared `setupDregalCarousels()` with independent previous/next controls. | Implemented, not browser-verified. |
| Wishlist | `dregal-wishlist` local storage, save/remove state, count badges and wishlist page. | Implemented, not browser-verified. |
| Shopping bag | `dregal-cart` local storage, quantity changes, removal, subtotal and drawer. | Implemented, not browser-verified. |
| Availability | Available, out-of-stock and coming-soon labels; unavailable items are not addable. | Partially verified by code inspection only. |
| WhatsApp ordering | Cart and product/contact links build `wa.me` URLs with encoded messages. | Implemented, not browser-verified. |
| Currency | NGN/USD display toggle with local storage and fallback rate of 1500 NGN/USD. | Implemented, not browser-verified; rate is not a production exchange integration. |
| About/contact/FAQ/size guide | Pages and static content exist; FAQ uses delegated accordion initialization. | Implemented, not browser-verified. |
| Policies/data pages | Privacy, terms, refunds, subprocessors, data requests and unsubscribe pages exist. | Implemented, not browser-verified. |
| Dark mode | Preference stored as `dregal-theme`; theme attributes and many dark selectors exist. | Partially working by inspection; visual contrast is not verified. |
| Responsive navigation | Dynamic header, mobile drawer, Escape/outside-click handling and desktop sidebar rules exist. | Implemented in code, not browser-verified. |
| Newsletter | Form and consent UI exist, but no provider submission is connected. | Not implemented as a real subscription service. |

## 3. Product and business data

### Data structure

Each product object generally contains:

```js
{
  id, name, category, groups, availability, featured, price,
  description, colours, sizes, badge, image, images, tags
}
```

`availability` values currently include `available` and `coming-soon`; renderer logic also supports `out-of-stock`.

### Confirmed catalogue

| ID | Name | Category/groups | Price | Availability | Known variants |
|---|---|---|---:|---|---|
| `joggers` | Signature Joggers | joggers; streetwear, bottoms, everyday-essentials | ₦15,000 | Available | Black, Grey, Dark grey; sizes currently empty |
| `jorts` | Relaxed Jorts | jorts; streetwear, bottoms, everyday-essentials | ₦9,500 | Available | Colours and sizes currently unconfirmed/empty |
| `tank-tops` | Essential Tank Top | tank-tops; streetwear, tops, everyday-essentials | ₦18,000 | Available | Colours and sizes currently unconfirmed/empty |

These are the only confirmed priced products in the current data. They are marked `featured: true` and appear in the first edit.

### Future/placeholder catalogue

The following records are generated from a compact array in `js/products.js`. They are `coming-soon`, have no confirmed price, empty colours/sizes, a `Planned edit` badge, and use temporary Unsplash category imagery:

`t-shirts`, `polo-shirts`, `shirts`, `shorts`, `trousers`, `jeans`, `sweatshirts`, `hoodies`, `jackets`, `tracksuits`, `matching-sets`, `casual-dresses`, `tops`, `skirts`, `bespoke-dresses`, `traditional-menswear`, `traditional-womenswear`, `tailored-occasion`, `beanies`.

To edit products, update the `products` array and `comingSoonImages` map in `js/products.js`. Before launch, replace remote image URLs, confirm product facts, and add real variant/size data rather than filling unknown values.

## 4. Existing business logic

- Cart storage key: `dregal-cart`.
- Wishlist storage key: `dregal-wishlist`.
- Theme storage key: `dregal-theme`.
- Currency storage key: `dregal-currency`.
- Exchange-rate storage key: `dregal-usd-ngn-rate`.
- Cart quantities are summed by `getCart()` and `cartSubtotal()`. Matching cart lines use product ID and colour.
- `addToCart()` increments an existing matching line or adds a new line, then rerenders the drawer and count.
- Unavailable products do not render normal add controls; product detail also removes purchase actions for unavailable products.
- `cartWhatsAppMessage()` creates an encoded order summary containing item names, prices, quantities, subtotal and a request to confirm availability/payment/delivery.
- `makeWhatsAppLink()` targets the configured Nigerian WhatsApp number in `WHATSAPP_NUMBER`. This is a public business destination, not a secret.
- `formatPrice()` uses `Intl.NumberFormat`; NGN displays whole naira and USD divides by the stored/default rate.
- Shop search checks product text/tags and URL `search`; category filtering checks `groups`; sort modes are featured, low-high, high-low and name.
- Product detail receives its product from `product.html?id=<product-id>` and calls `getProduct()`.
- Theme is initialized from local storage or system preference, then toggled by sidebar/mobile controls.

No API keys, environment variables or credentials are required by the current code. The exchange-rate request is optional/best-effort and should be replaced with a verified service or a deliberate fixed-rate business policy before production.

## 5. Current design and implementation problems

The following issues were repeatedly reported during the project and remain rebuild risks even where code has since been added:

1. **Desktop header architecture drift** — `js/store.js` dynamically injects both sidebar and top-header elements. `css/style.css` contains many late media-query overrides, making it difficult to establish which version is authoritative.
2. **Search inconsistency** — earlier versions rendered only a search icon. The current code now creates `.header-search-bar` dynamically, but it has not been visually verified at desktop/tablet breakpoints.
3. **Bag icon/count regressions** — the bag starts as text in the template and is replaced later by JS. This creates a fragile intermediate state and has caused missing icon/text regressions. The live count is `[data-cart-count]`.
4. **Wishlist icon/badge regressions** — wishlist markup is replaced dynamically and count visibility depends on `[data-wishlist-count]`; this needs one stable component in a rebuild.
5. **Inconsistent icons** — `js/store.js` has `dregalIcon()` for some icons, while legacy CSS and HTML still contain decorative SVG backgrounds and Unicode symbols in places. A rebuild should use one inline-SVG icon map everywhere.
6. **Mobile menu fragility** — `.nav-links` is transformed into the drawer, while late CSS blocks control z-index, visibility and pseudo-element scrims. The click handler now includes close-button, Escape and outside-click logic, but has not been browser-tested.
7. **Sidebar/theme positioning** — desktop sidebar bottom anchoring depends on `.desktop-sidebar__foot { margin-top:auto; }` and a fixed sidebar media query. It should be rebuilt as a first-class layout component, not dependent on late overrides.
8. **Dark-mode inconsistency** — dark selectors are concentrated near the end of `style.css`; some components may still inherit light surfaces or insufficient contrast.
9. **Coming Soon presentation** — previous iterations showed unwanted blue rectangles. Current data uses remote images and availability badges; the final visual treatment remains unverified.
10. **CSS accumulation** — `style.css` is approximately 90KB and contains repeated selectors/media blocks and legacy purple variable names aliased to beige. This is the largest maintainability risk.
11. **Renderer duplication history** — homepage/shop/wishlist previously had separate product-card renderers. Homepage/shop/carousels now share code, and wishlist was moved to `productCard()`, but this should be revalidated during rebuild.
12. **Invalid/fragile markup risk** — dynamically generated controls, nested interactive elements and Unicode fallbacks have changed repeatedly. Rebuild should validate HTML and keep buttons outside product links.
13. **Remote asset risk** — Unsplash URLs are temporary, can change, and do not guarantee that the photograph represents the named garment.

## 6. Design instructions gathered from the project history

The latest detailed instruction takes precedence over earlier conflicting experiments:

- Use the NovaShop reference for information architecture, calm spacing, utility placement, sidebar structure, compact product cards and outline icon language, but retain D’REGAL branding and beige fashion direction.
- The preferred desktop architecture is a persistent left sidebar containing the logo, vertically spaced destinations, Wishlist, Shopping bag and bottom-anchored theme control. The main header should not duplicate the sidebar’s logo/navigation in the final rebuild; it should hold search and utility controls.
- The preferred utility order is search, `NGN / USD`, outline heart, outline bag, with small beige counts above the relevant icons and no visible “Bag” text.
- No purple UI, purple hover, purple badge or beige filter over photography. The beige palette is warm beige `#D6C2A1`, light beige `#E8DDCB`, cream `#F5F0E8`, charcoal/deep text, neutral grey and black/white.
- Mobile uses a slide-out drawer occupying approximately two-thirds of the viewport, with hamburger, close button, outside-click close, Escape close, clickable links, background-scroll lock and theme control inside the drawer.
- Product catalogue should be organized into horizontal category carousels. Product cards should clearly distinguish available, out-of-stock and coming-soon items, with transparent/quiet coming-soon treatment rather than a blue block.
- Use a shared product-card renderer, shared carousel controller, centralized product data, shared cart/wishlist logic and a consistent outline icon system.
- Preserve confirmed prices: Joggers ₦15,000, Jorts ₦9,500, Tank tops ₦18,000. Do not invent unknown sizes, colours, delivery terms or production timings.
- Brand direction: contemporary Nigerian fashion, effortless style, comfort, expression, Lagos/Ibadan identity and “Beyond the ordinary.”
- Typography currently chooses Krona One for display and Inter for body/UI as an informed substitute, not a verified copy of another site’s exact font.

Earlier requests experimented with centered mobile wordmarks, desktop top-header navigation, hidden/mobile utilities and alternate drawer placements. Those experiments should not override the latest sidebar-plus-utility architecture.

## 7. Technical risks and retention guidance

### Retain or port carefully

- Confirmed product facts and prices in `js/products.js`.
- Cart and wishlist storage keys and data shape in `js/store.js`.
- WhatsApp message construction and product/contact links.
- Product detail query-string contract `product.html?id=`.
- Compliance storage behavior in `js/compliance.js`.
- Existing page copy and legal/policy destinations until content is formally replaced.

### Rebuild risks

- `css/style.css` has repeated breakpoints and overrides; do not copy it wholesale.
- Dynamic header rendering means editing static HTML alone will not change the rendered header.
- Several old selectors still use names such as `--purple`, even where the value is now beige; rename tokens during rebuild to avoid accidental reintroduction.
- Remote images/fonts can fail offline and may not be production-safe.
- `ResizeObserver` is used by the carousel controller; provide a safe fallback if supporting older browsers.
- Accessibility needs a formal pass: focus trapping for drawers, focus restoration, skip links, clearer current-page semantics, and live announcements for cart/wishlist changes.
- The compliance test’s `spawn EPERM` failure was observed in this managed environment. It must be rerun in a normal local Node environment.
- No actual viewport, browser-console, interaction or dark-mode visual evidence has been captured in this session.

## 8. Recommended clean rebuild architecture

Keep vanilla HTML/CSS/JS, but separate responsibilities:

```text
dregal-final/
  pages/                 # optional future grouping; preserve current URLs during migration
  css/
    tokens.css           # palette, typography, spacing, radii, shadows, breakpoints
    base.css             # reset, typography, global elements
    layout.css           # app shell, sidebar, header, drawer, responsive grid
    components.css       # icons, cards, carousels, cart, forms, banners
    themes.css           # light/dark semantic mappings
  js/
    data/products.js     # catalogue only
    components/icons.js  # one inline-SVG icon map
    components/header.js # desktop header/sidebar/mobile drawer
    components/product-card.js
    components/carousel.js
    state/store.js       # cart, wishlist, theme, currency
    pages/home.js
    pages/shop.js
    pages/product.js
    pages/wishlist.js
  assets/
    images/              # owned/compressed photography
    icons/               # only if inline SVG is not sufficient
```

Recommended principles:

1. Render one app shell per page with stable DOM regions rather than replacing controls after render.
2. Use semantic tokens such as `--color-accent`, never legacy `--purple` names.
3. Keep one icon registry with a shared `viewBox`, stroke width, caps, joins and dimensions.
4. Make `renderProductCard(product, context)` the only card renderer; support catalogue, wishlist and related contexts through options.
5. Make the carousel controller attach to a shell and own arrows, keyboard controls, scroll state and resize behavior.
6. Keep cart/wishlist/theme/currency state in one small module with event dispatch so counts update everywhere.
7. Use CSS grid/flex layout for desktop sidebar and mobile drawer, with one breakpoint policy and no late emergency overrides.
8. Add browser-based smoke tests for desktop and mobile at the requested widths, including drawer, search, wishlist, cart and theme persistence.
9. Replace temporary photography and verify every product image matches its product name before launch.

## Current audit summary

The project is a functional vanilla prototype with confirmed catalogue facts, local cart/wishlist state, WhatsApp ordering, product detail pages, search/filtering, carousels, policy pages and a growing responsive/theme implementation. The primary reason it is not ready for a clean handoff as production UI is accumulated CSS, dynamically replaced header markup, inconsistent icon sources and the absence of genuine browser verification. This document is the requested rebuild handoff; no existing website files were changed for this audit.
