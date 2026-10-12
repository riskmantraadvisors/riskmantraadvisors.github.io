# RiskMantra Website: Technical Recommendation

**Question:** What is the right platform for the Knowledge hub? It needs secure admin controls to publish, edit and delete articles, plus paid access to premium articles. It also has to support the Learning App and future products.

**Short answer:** Run it in three phases on one architecture. The public website stays a fast, static site. Two services sit behind it: a Git-based CMS for editorial control, and later a small authenticated backend with Razorpay for paid content. That same backend becomes the foundation for the Learning App and the RegTech products. Phase 1 is built and in this repository.

---

## 1. Options considered

| | A. WordPress (+ membership plugin) | B. Custom database-backed app | C. Static site + Git CMS (Jamstack) | D. Ghost (hosted publishing + membership) |
|---|---|---|---|---|
| **Admin publish / edit / delete** | Excellent, familiar UI | Must be built | Good (Decap CMS web UI, editorial workflow) | Excellent |
| **Paid content** | Yes (Paid Memberships Pro / MemberPress + Razorpay add-on) | Yes, full control (Razorpay Subscriptions) | Not on its own. Needs a backend (Phase 2) | Yes, but Stripe only. Stripe is restricted for many new Indian accounts |
| **Security** | Largest attack surface (core, themes and plugins need constant patching) | Good if built well; we own the risk | Strongest: no server or database to attack. Admin protected by GitHub sign-in with 2FA | Good (managed) |
| **Performance / SEO** | Moderate; needs caching plugins | Good | Excellent (pre-built HTML on a global CDN) | Good |
| **Running cost** | ₹1–3k/month for managed hosting + premium plugins | Hosting + developer time | **₹0** (GitHub Pages) | Monthly subscription (tiered) |
| **Backups / audit trail** | Plugin-based | Must be built | Built in: every change is a Git commit and can be rolled back | Managed |
| **Supports Learning App / products** | Poor fit. Would end up as a second system anyway | Native | Pairs with the backend from option B | Poor fit |
| **Vendor lock-in** | Low–medium | None | None (content is plain Markdown) | Medium |

## 2. Recommendation: phased hybrid (C now, then C + B)

### Phase 1: delivered in this repository
* **Jekyll static site on GitHub Pages**, with HTTPS on `riskmantraadvisors.com`. Separate pages and URLs, shared header and footer, breadcrumbs, responsive layout, SEO metadata, sitemap and structured data.
* **Knowledge hub** with categories, search, filters (category, author, premium), preview cards, full article pages, author profiles and tags.
* **Admin panel at `/admin/`** (Decap CMS). Partners sign in with GitHub and can create, edit, unpublish and delete articles, author profiles, services and initiatives through a web form. An *editorial workflow* (Draft → In review → Ready) means nothing goes live until an editor approves it.
* **Premium flag on articles.** A premium article shows its teaser and a paywall with "Become a member" and "Institutional access" calls to action.
* **Initiatives** are driven by one data file. Adding a product or a whole new platform is a form edit, not a redesign.
* **Enquiry form** with consultation/enquiry/training intent, pre-filled from service, partner and product links, plus GA4 lead events.

> **Important limitation, by design.** On a static site, anything in the repository is public. For premium articles, only the teaser (the text above `<!--more-->`) should be stored in the repository. Keep the full premium text outside the repo until Phase 2. Until then, deliver premium content to members directly (PDF or email) or through institutional arrangements.

### Phase 2: paid Knowledge (when premium content is ready to sell)
Add a small backend, for example **Supabase** (managed PostgreSQL + authentication + row-level security) or an equivalent, plus **Razorpay Subscriptions**:

1. Readers sign up or sign in on the website (email magic link or Google).
2. "Become a member" opens Razorpay Checkout. A Razorpay **webhook** to a serverless function marks the member as active in the database. The signature is verified server-side.
3. Premium article bodies are stored in the database, readable only by active members (row-level security). The article page fetches the full text after sign-in.
4. The admin keeps using `/admin/` for the public teaser. Premium bodies are edited in a protected admin view.

This is the only robust way to deliver *reliable, secure* paid access. It cannot be done with HTML or JavaScript alone.

*Alternative, if speed matters more than integration:* move the Knowledge hub only to a managed **WordPress** install at `knowledge.riskmantraadvisors.com` with Paid Memberships Pro + Razorpay. This is faster to launch, but it adds a second system to patch and does not help the Learning App.

### Phase 3: Learning App and digital products
Reuse the Phase 2 backend (same user accounts, payments and database) for the **RiskMantra Learning App** (web/PWA first, then native apps if needed), and for product pilots such as **RBEWS** and the **Risk Model Validation Tool** on `app.riskmantraadvisors.com`. The marketing site stays static, fast and secure. Products live behind sign-in.

## 3. Enhancements checklist

| Area | Delivered now | Next step |
|---|---|---|
| Design | BFSI-grade navy/gold design system built on the RiskMantra logo and deck | Professional photography; case-study visuals |
| Navigation | Multi-page site, sticky header, mobile menu, breadcrumbs, clean URLs (`/services/`, `/knowledge/…`) | Mega-menu once there are more than 10 service pages |
| Contact | Enquiry, consultation and training form; WhatsApp; email; map | Connect `form_endpoint` (Formspree or similar) or a CRM (Zoho/HubSpot) |
| Content | Services, people, initiatives and articles editable via `/admin/` or the YAML/Markdown files | Individual service landing pages; case studies |
| Security | No server or database; admin via GitHub sign-in (enforce 2FA); every change versioned; `/admin/` excluded from search engines | Branch protection on `main`; restrict repository write access to editors |
| SEO | Per-page titles and descriptions, Open Graph, sitemap.xml, robots.txt, JSON-LD (organisation and breadcrumbs) | Google Search Console verification; article schema |
| Performance | Static HTML on CDN, images optimised (old page was 3.3 MB; images are now ~30–50 KB each), lazy loading, no JS frameworks | WebP/AVIF variants |
| Analytics | GA4 ready (paste ID in `_config.yml`); `generate_lead` event on enquiries | Conversion goals; monthly dashboard |
| Deployment | GitHub Pages auto-deploys on every commit; custom domain via `CNAME`; free SSL | Uptime monitoring |
| Scalability | Data-driven services and initiatives; collection-based articles and people | Phase 2 backend shared with the Learning App |

## 4. Indicative cost (annual)

| Item | Phase 1 | Phase 2 |
|---|---|---|
| Hosting (GitHub Pages) | Free | Free |
| Domain | Existing | Existing |
| Form backend (Formspree free tier / paid) | ₹0–8k | ₹0–8k |
| Supabase (free tier → Pro) | – | ₹0–25k |
| Razorpay | – | ~2% per transaction, no fixed fee |
