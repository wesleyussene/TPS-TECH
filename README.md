# Top Solutions

A responsive Portuguese storefront with original Top Solutions branding and the supplied SVG logo.

## Open the site

Open `dist/index.html` directly, or serve the `dist` folder with any static web server. No package installation or build is required.

## Add your product photos

1. Place the photos in `dist/assets/products/` (square JPG, WebP or PNG recommended).
2. Open `dist/products.js`.
3. Replace each empty `image` value with its relative path, for example:

```js
image: 'assets/products/smartphone.jpg'
```

Empty image values display the intentional image placeholder. Use the exact filename, including uppercase/lowercase. Photo changes are made in the source; there is no public image-upload form.

## Change products and prices

Use `/admin.html` to edit products, prices, photos, categories and subcategories; see `ADMIN-SETUP.md`. The panel saves `dist/content.json` and generates `dist/products.js` together. Product IDs must remain unique.

`dist/categories.js` defines the 17 categories and 86 subcategories shared by the website, admin editor and server validator. Each subcategory belongs to its parent category. Legacy category names are mapped to their current equivalents without adding duplicate options. Products may remain without a subcategory until a suitable one is selected. The homepage mixes categories and displays 10 products per page.

Set `price` to a number in MZN to show a formatted price, or leave it `null` for “Preço sob consulta”. All supplied items are illustrative, not verified store inventory.

Before a public launch, replace the sample products with the actual catalogue and update the “Prévia do catálogo”, sample note and product availability message in `dist/index.html` and `dist/app.js` as appropriate.

## Design

- Main stylesheet: `dist/styles.css`
- Supplied logo, unchanged: `dist/assets/top-solutions-logo.svg`
- Palette sampled from the supplied image: #0190FF, #02038A, #021520
- Logo's original blue: #008EFF
- No external fonts or third-party scripts.

## Included

Responsive layout, category links, category filters, accent-insensitive product search, empty-search state, native product-detail dialog, keyboard focus styles, reduced-motion support and branded favicon.

This is a catalogue storefront. Payments, checkout, order management and live stock are not connected. Store contact details and commercial policies were not invented.

## Validation

Checked JavaScript syntax, referenced local assets, logo loading, search and empty results, category filters, and mobile product details. Verified no horizontal page overflow at 390px and 1440px widths.
