# Store admin

The store admin lives at `/admin.html`. Production uses the Vercel function `/api/admin`; the local UI simulation is not included in the deployed site.

## Server configuration

Add these production environment variables to the existing Vercel `wdsgn/dist` project:

- `ADMIN_PASSWORD_HASH`: `salt:hash` where salt is 16 random bytes encoded as hex and hash is Node `crypto.scryptSync(password, salt, 64)` encoded as hex.
- `ADMIN_SESSION_SECRET`: at least 32 cryptographically random characters.
- `GITHUB_CONTENT_TOKEN`: a fine-grained GitHub token limited to `wesleyussene/TPS-TECH`, with **Contents: Read and write**. Do not use a personal token with access to all repositories. Renew this credential before it expires.
- `ADMIN_ORIGIN` is optional. The default permits only `https://www.topsolution.co.mz` and `https://topsolution.co.mz`.

Keep Vercel's root directory set to `dist`, framework preset `Other`, and deploy after changing environment variables. Credentials must never be committed to GitHub or added to frontend JavaScript. Rotate the session secret to invalidate all sessions.

## Editing workflow

1. Sign in at `/admin.html`.
2. Add or edit products, prices, descriptions and photos. Hide products using “Visível na loja”.
3. Edit the main banner, optional extra banners, announcement and About Us copy.
4. Apply changes to the draft. “Guardar rascunho” stores content and pending images in **this browser only**, not across devices. A restored draft keeps its original revision so it cannot silently overwrite someone else's changes.
5. Click “Publicar alterações”, review the confirmation, and publish. The server commits `content.json`, generated `products.js`, and uploaded image files together. Vercel's GitHub integration then deploys the new revision. The panel polls the public content and distinguishes a saved commit from a confirmed live publication.

Images are converted to WebP in the browser and bounded to 1600 px / 450 KB each. A publish request is limited to 3.9 MB. Split large image batches across publications. Existing images are retained in Git history; removing an image from a product does not delete the underlying file.

## Security and limitations

The API requires a signed eight-hour HttpOnly/Secure/SameSite=Strict cookie and checks the Origin for POST requests. Passwords are checked against a scrypt hash. Validation rejects arbitrary HTML, external banner links, invalid prices, duplicate IDs and non-raster image paths. Publication uses a non-force Git ref update to avoid losing concurrent changes. In-memory login throttling is per function instance, not a durable distributed account lockout; configure a Vercel Firewall rate limit for `/api/admin` if stricter protection is needed.

If the repository credential expires or Vercel deployment fails, the panel reports the failure or pending state without claiming that content is live. Repository history can restore previous content.

## Validation

Run `node --test tests/admin.test.cjs`. Browser checks cover editing prices/descriptions, image optimization, draft persistence, separate publishing, and mobile/desktop layout. Test fixtures and credentials are not in `dist`.
