# Top Solutions

A responsive Portuguese storefront inspired by the product-category structure of https://vipsolutions.co.mz, with original Top Solutions branding and the supplied SVG logo.

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

Edit `dist/products.js`. Each entry contains `id`, `name`, `category`, `description`, `image`, and `price`. IDs must be unique. Use these existing categories: Smartphones, Computadores, Áudio, Gaming, Wearables, Acessórios. Add category definitions in `dist/app.js` if needed.

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
