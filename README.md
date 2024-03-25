# Astro emails

Using Astro to build emails.

- Todo:
  - [ ] **Make builds faster**
    - How can we build just the file that changed? We currently build & transform the entire `pages/` and `dist/` directory.
  - [ ] Build out Astro components
    - [ ] Link
    - [ ] Text
    - [ ] Image
    - [ ] Divider (Hr)
    - [x] IfOutlook/IfNotOutlook
    - [x] Spacer
    - [x] Div
    - [x] Row
    - [x] Col
    - [x] ~~Button/Clickable~~ (not applicable in email)
  - [ ] Build an email!
  - [ ] Auto-VML - i.e. no components, all done behind the scenes.
    - Ref: https://maizzle.com/docs/components/vml
  - [ ] Can I use [`postcss-preset-env`](https://www.npmjs.com/package/postcss-preset-env) for emails?
  - [ ] Images get clipped by Gmail at 102kb. We should warn ourselves!
  - [ ] Report astro bug: having a JSX comment i.e. `{/* @ts-expect-error sdjf */}` ahead of `<html>` causes the `<html>`, `<head>`, and `<body>` tags to be removed during build.
- Maybe:
  - [ ] Base URL (for images, etc.). See https://maizzle.com/docs/transformers/base-url
  - [ ] URL parameters (for tracking, etc.). See https://maizzle.com/docs/transformers/url-parameters
  - [ ] Widow words could be useful. See https://maizzle.com/docs/transformers/widows
  - [ ] Batch replace strings in files? See https://maizzle.com/docs/transformers/replace-strings
- Done:
  - [x] Astro integration + Vite plugin combo
  - [x] Remove unused CSS (for minification). See https://maizzle.com/docs/transformers/remove-unused-css
  - [x] HTML minify - Astro does some for us so... needed? I'm putting it in anyway.
  - [x] Create "Safe class names" (ex. replacing `:`)
    - Refs: https://maizzle.com/docs/transformers/safe-class-names

## Resources

- [caniemail](https://www.caniemail.com/)
- Coding emails best practices
  - [Litmus - Outlook Email Rendering Issues and How to Solve Them](https://www.litmus.com/blog/a-guide-to-rendering-differences-in-microsoft-outlook-clients)
  - [Litmus - Understanding Retina Images in HTML Email](https://www.litmus.com/blog/understanding-retina-images-in-html-email)
  - [Litmus - 7 Interactive Emails for Inspiration](https://www.litmus.com/blog/interactive-emails-top-trend-anyone-using)
  - [Parcel - How to Target Email Clients](https://www.howtotarget.email/)
  - [Campaign Monitor - The Ultimate Guide to CSS](https://www.campaignmonitor.com/css)
  - [Litmus - Outlook Overview](https://litmus.com/community/learning/8-outlook-overview)
  - [Litmus - Your Guide to Bulletproof Email Buttons that Work](https://www.litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design)
  - [Litmus - Responsive vs. Hybrid emails](https://www.litmus.com/blog/understanding-responsive-and-hybrid-email-design)
  - [Litmus - The ultimate guide to bulleted lists](https://www.litmus.com/blog/the-ultimate-guide-to-bulleted-lists-in-html-email)
  - [Sitepoint - Essential Tips and Tricks for Coding HTML Emails](https://www.sitepoint.com/html-email-tips-tricks/)
- [Foundation for Emails docs](https://get.foundation/emails/docs/index.html)
- [tailwindcss core plugins ref](https://tailwindcss.com/docs/configuration#core-plugins)
- [CSS Fonts - How safe are your fonts?](https://www.cssfontstack.com/)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

# Documentation

To be organized at a later date.
