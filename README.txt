KEYSQUARE.CO WEBSITE
====================

HOW TO UPLOAD
Upload everything in this folder to the root of the keysquare.co web space
(usually public_html/ or www/), keeping the folder structure exactly as is.
Include the hidden file .htaccess. Replace the old single-page file.

FOLDER STRUCTURE
/
  index.html              Home
  platform.html           Platform (8 modules)
  solutions.html          Solutions by industry (9 industries)
  technology.html         Data and technology
  about.html              Company
  contact.html            Contact and demo request form
  privacy-policy.html     Privacy Policy
  terms-of-use.html       Terms of Use
  404.html                Page-not-found page
  favicon.ico / favicon.svg / favicon-16x16.png / favicon-32x32.png
  apple-touch-icon.png    iPhone / iPad home-screen icon
  android-chrome-*.png    Android and app icons
  site.webmanifest        App manifest (name, colours, icons)
  robots.txt              Search engine rules
  sitemap.xml             Page list for Google Search Console
  .htaccess               Apache: HTTPS, 404 page, clean URLs, caching
  assets/css/style.css    All styles
  assets/js/main.js       Map, site scorer, menu, contact form
  assets/img/og-image.png Image shown when links are shared (WhatsApp, LinkedIn, X)

BEFORE GOING LIVE
1. Contact form: open assets/js/main.js and set FORM_ENDPOINT to a
   form-handling URL (your own server script, or a service such as
   Formspree, Getform or Web3Forms). Until then, the form only shows
   a thank-you message and does not send anything.
2. Add a company email address to contact.html, the footer and the
   Privacy Policy once one is available.
3. Have Privacy Policy and Terms of Use reviewed by a lawyer, and confirm
   who the Grievance Officer is.
4. Confirm founder title, business hours and the DPDP / India-hosting
   statements on technology.html.
5. Submit https://keysquare.co/sitemap.xml in Google Search Console.

NOT USING APACHE?
.htaccess is ignored on Nginx, IIS and static hosts (Netlify, Vercel,
Cloudflare Pages). Set the 404 page and HTTPS redirect in that host's
settings instead. All internal links use root paths (/platform.html),
so the site must be served from the domain root, not a subfolder.
