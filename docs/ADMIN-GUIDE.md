# Admin & Handover Guide

## How the site works
* The site is built with **Jekyll**. **GitHub Pages** builds and publishes it automatically about a minute after every change to the `main` branch.
* Domain: `riskmantraadvisors.com` (set in `CNAME`). SSL is issued by GitHub Pages for free.
* All content is plain text in this repository, so the Git history is a complete backup and audit trail. Any change can be reverted.

## Where content lives

| Content | File(s) | Admin panel section |
|---|---|---|
| Articles (Knowledge hub) | `_articles/*.md` | **Articles** |
| Partners / authors | `_authors/*.md` + photos in `assets/img/team/` | **People & Authors** |
| Services | `_data/services.yml` | **Site content → Services** |
| Initiatives & products | `_data/initiatives.yml` | **Site content → Initiatives & products** |
| Knowledge categories | `_data/categories.yml` | Edit file (also update the category list in `admin/config.yml`) |
| Main menu | `_data/navigation.yml` | Edit file |
| Who we serve | `_data/sectors.yml` | Edit file |
| Email, WhatsApp, address, form & analytics IDs | `_config.yml` | Edit file |

Any file can also be edited directly on github.com with the pencil icon.

## Writing an article
Front matter fields:

```yaml
---
title: "Article title"
slug: short-url-name          # → /knowledge/short-url-name/
date: 2026-10-12
author: arpit-sarawagi        # file name in _authors/
category: alm                 # treasury | risk-management | alm | banking | regulatory | market-insights
tags: [IRRBB, Liquidity]
summary: One or two sentences shown on cards and in search.
premium: false                # true = members only (see below)
featured: false
---
Body in Markdown…
```

**Premium articles:** set `premium: true`. Put `<!--more-->` after the free preview. Everything above it is shown to all visitors, followed by the membership paywall. Until the Phase 2 membership backend exists, **do not put the full premium text in the repository**, because the repository's contents are publicly readable. See `TECHNICAL-RECOMMENDATION.md`.

## One-time setup

### 1. GitHub Pages
Repository **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main` / root. Tick **Enforce HTTPS**.

### 2. Enquiry form
Create a form at a form-backend service (for example Formspree). Copy its endpoint into `form_endpoint` in `_config.yml`. Until then, the form opens the visitor's email client addressed to `contact@riskmantraadvisors.com`.

### 3. Analytics
Create a Google Analytics 4 property and paste the Measurement ID (`G-…`) into `google_analytics` in `_config.yml`. Enquiry submissions are recorded as `generate_lead` events.

### 4. Admin panel (`/admin/`)
The admin panel is [Decap CMS](https://decapcms.org). It signs editors in with their GitHub accounts. GitHub Pages cannot run the sign-in step itself, so it needs a small OAuth relay. This is a one-time setup and free on the Cloudflare Workers or Vercel free tiers:

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**. Set *Homepage URL* = `https://riskmantraadvisors.com` and *Authorization callback URL* = `https://<your-relay-domain>/callback`.
2. Deploy one of the open-source Decap/Netlify-CMS GitHub OAuth relays. Search for "decap cms github oauth cloudflare worker". Give it the OAuth App's Client ID and Client Secret as secrets.
3. In `admin/config.yml`, set `base_url` to the relay's URL.
4. Give each editor **write** access to the repository. Require **two-factor authentication** for the organisation.
5. Recommended: add a **branch protection rule** on `main` so that only maintainers can push.

Editors then visit `https://riskmantraadvisors.com/admin/` and sign in with GitHub. New articles go through *Drafts → In review → Ready → Publish*. Publishing creates a commit, and the site updates within about a minute.

## Local preview (optional, for developers)
```bash
bundle install
bundle exec jekyll serve      # http://localhost:4000
```
