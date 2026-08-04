# Cream & Crumbs — Cake Studio Website

A responsive, editorial-style website and structured cake enquiry flow for **Cream & Crumbs**, a custom cake business serving selected areas in KL and Selangor.

## Included

- Premium responsive homepage
- Custom Cake Studio flow
- Date and delivery-area qualification
- Cake gallery with category filters
- Weekend Drop section
- Structured WhatsApp enquiry message
- Delivery and FAQ sections
- Optimized cake photography supplied for the concept
- Schema.org bakery metadata
- No build tools or dependencies required

## Run locally

Open `index.html` directly, or run a local server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Required before going live

### 1. Add the bakery's WhatsApp number

Open `app.js` and replace:

```js
const WHATSAPP_NUMBER = "";
```

with the owner's number in international format without `+`, spaces or dashes, for example:

```js
const WHATSAPP_NUMBER = "60123456789";
```

When it is blank, the prototype opens WhatsApp's general share composer instead of a direct business chat.

### 2. Confirm business information

The following content is based on the supplied Instagram and Threads profiles and should be confirmed with the owner:

- Exact delivery areas
- Pickup location and procedure
- Current flavours
- Starting prices
- Weekend Drop availability
- Deposit, cancellation and amendment policies
- Allergy wording
- Whether RM55 remains the current combo price

### 3. Deploy

This is a static website and can be deployed to:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel

For GitHub Pages, choose the repository's `main` branch and `/ (root)` directory under **Settings → Pages**.

## Files

- `index.html` — structure and content
- `styles.css` — responsive UI and visual system
- `app.js` — navigation, gallery filtering and booking flow
- `assets.js` — loads the embedded image assets
- `asset1.js`, `asset2.js`, `asset6.js` — optimized embedded cake images

## Next production phase

The enquiry prototype can later connect to:

- Supabase for customer enquiries and production slots
- Billplz for FPX deposits
- Orderla for ready-to-order items
- Cloudinary or Supabase Storage for customer reference images
- A simple owner dashboard with order statuses
