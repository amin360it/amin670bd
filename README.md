# Amin670BD — Portfolio / CV

**Live:** https://amin670bd.github.io
**Author:** Md. Asaduzzaman (Aminur) — IT & Digital Operations Specialist
**Location:** Savar, Dhaka, Bangladesh
**Built:** June 2026 — Single-page Vue 3 application (no build tool)

---

## Table of Contents

1. [Tech Stack & Versions](#1-tech-stack--versions)
2. [File Structure (Every File Explained)](#2-file-structure-every-file-explained)
3. [Application Architecture](#3-application-architecture)
4. [Data Layer — CV Data (138 fields)](#4-data-layer--cv-data-138-fields)
5. [Vue Components — 10 Views + App Shell](#5-vue-components--10-views--app-shell)
6. [Router Configuration (11 Routes)](#6-router-configuration-11-routes)
7. [CSS Design System](#7-css-design-system)
   - 7.1 CSS Custom Properties (Light/Dark)
   - 7.2 12 Keyframe Animations
   - 7.3 48 Component Classes
8. [Contact Form — Email Validation Engine](#8-contact-form--email-validation-engine)
9. [SEO Implementation](#9-seo-implementation)
10. [Performance Optimizations](#10-performance-optimizations)
11. [Deployment](#11-deployment)

---

## 1. Tech Stack & Versions

| Technology | Version | Source | Purpose |
|---|---|---|---|
| **Vue 3** | 3.x (prod) | `assets/js/vue.global.prod.js` | Reactive component framework (Options API, no build) |
| **Vue Router** | 4.x (prod) | `assets/js/vue-router.global.prod.js` | Hash-based SPA routing |
| **Tailwind CSS** | v4 (static) + v3 CDN runtime | `assets/css/tailwind.css` + `assets/js/tailwind.min.js` | Utility classes (v4 build) + responsive breakpoints (CDN) |
| **jQuery** | 3.7.1 | `assets/js/jquery-3.7.1.min.js` | Skill bar animation only (`$.find` + `$.css` in IntersectionObserver) |
| **Outfit** | Variable weight 400-800 | `assets/fonts/outfit-*.woff2` (local, preloaded) | Primary display font |
| **Material Icons** | — | `assets/css/material-icons.css` + `assets/webfonts/MaterialIcons-Regular.woff2` | Icon system (async-loaded) |
| **Web3Forms** | — | API `10c1a904-df2c-4b15-8e7c-6407e5ae6943` | Serverless form-to-email handler |
| **Tailwind CLI** | devDependency | `package.json` | Build `tailwind.css` from `input.css` |

---

## 2. File Structure (Every File Explained)

### Root (11 entries)

```
/ (project root)
├── index.html                     # Vue 3 mount point — SPA entry
├── 404.html                       # Custom 404 error page (zero external HTTP requests)
├── thanks.html                    # Standalone fallback thank-you page (form submission backup)
├── README.md                      # This file — project documentation
├── Assaduzzaman_Aminur_CV_2026.pdf
│                                  # Downloadable CV/resume (linked from sidebar + hero)
├── package.json                   # Tailwind CLI dependency (build only, not runtime)
├── package-lock.json              # npm dependency lock file
├── .gitignore                     # Ignored: node_modules, extras/
│
├── assets/                        # All client-facing resources
│   ├── favicon.svg                # SVG favicon — brand gradient "A" logo
│   ├── css/
│   │   ├── style.css              # 1,259 lines — all custom CSS (components, animations, modals, theme)
│   │   ├── tailwind.css           # ~59 KB — Tailwind v4 build output from input.css
│   │   ├── material-icons.css     # Material Icons font declaration (local WOFF2)
│   │   └── input.css              # Tailwind v4 source (@import "tailwindcss")
│   ├── js/
│   │   ├── app.js                 # 1,388 lines — Vue app, 10 components, router, data, validation
│   │   ├── vue.global.prod.js     # Vue 3 runtime (production build, vendored)
│   │   ├── vue-router.global.prod.js # Vue Router 4 runtime (production build, vendored)
│   │   ├── jquery-3.7.1.min.js    # jQuery (kept only for skill bar animate)
│   │   └── tailwind.min.js        # Tailwind CDN engine (responsive breakpoints)
│   ├── data/
│   │   ├── cv.json                   # All CV data (personal, skills, experience, etc.)
│   │   └── projects.json             # 25 projects, 17 detail pages
│   ├── fonts/
│   │   ├── outfit-latin.woff2     # Outfit font — Latin subset (preloaded)
│   │   └── outfit-latin-ext.woff2 # Outfit font — Latin Extended subset (preloaded)
│   ├── images/
│   │   ├── profile.jpg            # Profile photo (used in sidebar, hero, about)
│   │   ├── placeholder.png        # Image placeholder for projects without screenshots
│   │   └── dtl-weight-apps/       # 13 screenshots of the Weight Checker project
│   └── webfonts/
│       └── MaterialIcons-Regular.woff2  # Material Icons font (137 KB)
│
└── extras/                        # Backups and unused files (not deployed)
    ├── backups/                   # Full project snapshot (pre-restructure)
    ├── style.css.bak              # Style backup before padding reduction
    ├── index.html.backup*         # HTML backups before each edit
    ├── plans.md                   # Running todo/summary of our session
    └── ...
```

---

## 3. Application Architecture

### Mount Flow

```
index.html
  └── <div id="app"> (mount target)
       ├── assets/js/vue.global.prod.js    ← Vue 3 runtime
       ├── assets/js/vue-router.global.prod.js ← Router
       ├── assets/js/jquery-3.7.1.min.js   ← jQuery
       ├── assets/data/cv.json          ← CV data (fetched at bootstrap)
       ├── assets/data/projects.json    ← Projects data (fetched at bootstrap)
       └── assets/js/app.js                 ← Vue components, router, App definition
                                            index.html bootstrap script → fetch JSON → mount
```

### Rendering Pipeline

```
Vue.createApp(App)
  ├── use(router)
  └── mount('#app')
       └── <App> (root component)
            ├── <MobileNav> (responsive, < 1024px)
            ├── <OffcanvasSidebar> (mobile menu, right-side flyout)
            ├── <Sidebar> (desktop, left rail, 300px)
            ├── <router-view> (swapped on route change)
            │    ├── HomeView         → /
            │    ├── AboutView        → /about
            │    ├── SkillsView       → /skills
            │    ├── ExperienceView   → /experience
            │    ├── EducationView    → /education
            │    ├── ProjectsView     → /projects
            │    ├── ProjectDetailView → /project/:id
            │    ├── AchievementsView → /achievements
            │    ├── ReferencesView   → /references
            │    └── ContactView      → /contact
            ├── <Footer>
            └── <ScrollToTopButton>
```

### Data Binding Pattern

All views use the shared reactive `DATA` object (line 4-216):

```js
const DATA = Vue.reactive({ ... });
```

Each view injects `DATA` via `data() { return { DATA }; }` in Options API — single source of truth, no props drilling,
no pinia needed.

---

## 4. Data Layer — CV Data (138 fields)

The `DATA` reactive object contains every piece of content on the site:

### `personal` (15 fields)
| Field | Value |
|---|---|
| `name` | Md. Asaduzzaman |
| `nickname` | Aminur |
| `title` | IT & Digital Operations Specialist |
| `phone1` | +880 1979 670601 |
| `phone2` | +880 1719 670601 |
| `email` | amin670bd@gmail.com |
| `email2` | amin670job@gmail.com |
| `location` | Ashuliya, Savar, Dhaka, Bangladesh |
| `linkedin` | linkedin.com/in/aminur670bd |
| `website` | https://amin670bd.github.io |
| `photo` | assets/images/profile.jpg |
| `dob` | 22/01/1997 |
| `blood` | O+ |
| `religion` | Islam |
| `currentSalary` | 21,800 BDT |
| `expectedSalary` | Negotiable |
| `available` | Immediately |

### `languages` (3 entries)
Bangla (Native, 100%), English (Fluent, 85%), Hindi (Intermediate, 60%) — each with `name`, `level`, `pct`

### `objective` — 1 paragraph, 52 words
### `summary` — 1 paragraph, 63 words

### `stats` (3 entries)
`15+ Sites Built`, `60% Efficiency Boost`, `100+ Users Managed`

### `skills` (15 categories, 75+ items)
| # | Category | Items |
|---|---|---|
| 1 | Office & Productivity | 5 |
| 2 | Design & Graphics | 7 |
| 3 | Video & AI Multimedia | 3 |
| 4 | ERP & Business Systems | 9 |
| 5 | E-Commerce & Marketplaces | 8 |
| 6 | C / C++ & .NET Stack | 7 |
| 7 | PHP & Laravel Stack | 7 |
| 8 | Frontend Stack | 7 |
| 9 | Databases & SQL | 5 |
| 10 | AI & Automation Tools | 6 |
| 11 | Web Dev & CMS | 9 |
| 12 | IT Support & System Admin | 7 |
| 13 | System Integration & Hardware | 6 |
| 14 | Email & Communication | 5 |
| 15 | Networking & Security | 7 |

### `experience` (7 jobs, 42 highlights)
| # | Title | Company | Period |
|---|---|---|---|
| 1 | Sr. Officer (In-Charge, Barcode) | Dhaka Thai ALCOMAXX PLC | Sep 2025–Present |
| 2 | Officer - IT (G-Pro) | Keya Cosmetic Ltd. | May 2022–Jul 2025 |
| 3 | IT Assistant | Rahamat Sweaters Ltd. | Jan 2022–May 2022 |
| 4 | Web Developer | Faith Media Ltd. | Jan 2021–Jul 2021 |
| 5 | Remote IT Assistant to CEO | TIC Accessories Inc. NYC | Jan 2020–Dec 2020 |
| 6 | ICT Teacher & IT Trainer | EEE & IT Training Center | Jul 2019–Dec 2019 |
| 7 | IT Assistant | ZSN Computers | Jul 2018–Dec 2018 |

Each has `title`, `company`, `location`, `period`, and `highlights[]` (4-7 bullet points each).

### `education` (2 degrees)
| Degree | School | Year | Grade |
|---|---|---|---|
| Diploma in Computer Engineering | Bogura Polytechnic Institute | 2018 | CGPA 2.92/4.00 |
| S.S.C. (Vocational, ICT) | Naogaon Technical School & College | 2013 | GPA 4.88/5.00 |

Each has `skills[]`, `achievements[]` with `{ text, award }` structure.

### `training` (4 certifications)
| Title | Institution | Duration |
|---|---|---|
| Web Design & Development | Bangladesh IT Institute, Dhaka | 3 months |
| Software Development | Smart Softwares, Bogura | 6 months |
| Graphics Design | Rahim IT Solutions, Bogura | 3 months |
| CompTIA A+ | Opurbo Computers, Naogaon | 6 months |

Each has `topics[]` (3-7 skills).

### `achievementCategories` (3 groups, 7 items)
Technical Impact (3), Training & Leadership (2), Awards & Recognition (2)

### `references` (4 people)
Each with `name`, `title`, `company`, `phone`

### `menuItems` (9 routes)
Home, About, Skills, Experience, Education, Projects, Achievements, References, Contact — each with `path`, `label`,
`icon` (Material Icons name)

### `project*` fields (loaded from external file)
| Field | Source | Type |
|---|---|---|
| `featuredProject` | `PROJECTS_DATA.featuredProject` | Object (title, company, tech, images, details) |
| `projectCategories` | `PROJECTS_DATA.projectCategories` | Array 4 categories × 25 items |
| `projectDetails` | `PROJECTS_DATA.projectDetails` | Object 17 detailed project pages |
| `projectsLoaded` | Set true after load | Boolean |

---

## 5. Vue Components — 10 Views + App Shell

### App Shell (`App` component, line 1156)

Root component managing:
- **Dark mode toggle**: `toggleDark()` — toggles `.dark` class on `<html>`, persists to `localStorage`
- **Mobile menu**: `toggleMobile()` / `closeMobile()` — responsive offcanvas sidebar
- **Scroll-to-top**: `handleScroll()` — shows floating button at `scrollY > 100`
- **Skill bar animation**: `observeSkillBars()` — IntersectionObserver + jQuery `$.find` + `$.css`
- **Projects data load**: On mount — reads global `PROJECTS_DATA`, merges into `DATA`
- **Template structure**:
  - Mobile nav bar (`< 1024px`, hamburger menu)
  - Offcanvas sidebar (right-side flyout, `w-72`, Z-50)
  - Desktop sidebar (left rail, `w-[300px]`)
  - `<router-view>` (main content area)
  - Footer (`© 2026`)
  - Scroll-to-top button (floating, gradient)

### HomeView (line 228)

**Route:** `/`
**Features:**
- Typewriter effect cycling 5 roles: *IT Support Specialist → ERP Systems Specialist → Web Developer → Digital
  Operations Expert → Systems Integrator*
- `startTypewriter()` — `setInterval` 80ms, types/deletes characters, 1.5s pause at full text
- Hero section with name + gradient nickname + photo
- 3 CTA buttons: Contact Me, Download CV, View Portfolio
- 3 highlight cards with floating icons (60% Efficiency Boost, 15+ Sites, 100+ Users)
- Stats bar (15+, 60%, 100+)
- Responsive: `flex-col lg:flex-row`, `sm:grid-cols-3`

### AboutView (line 339)

**Route:** `/about`
**Structure:** 2-column grid (`lg:grid-cols-5`):
- **Left column** (2/5): Visiting card with photo + contact info, Personal Details (DOB, Blood, Religion), Languages
  (with skill bars), Employment Details (salary, availability)
- **Right column** (3/5): Career Objective, Professional Summary + Stats

### SkillsView (line 455)

**Route:** `/skills`
**Structure:** Responsive grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
**Each card:** Icon + category title + pill tags (`skill-pill` class)

### ExperienceView (line 480)

**Route:** `/experience`
**Structure:** Vertical timeline with `.timeline-item`, `.timeline-dot`, `.timeline-date`
Each entry: dot marker, date badge, title, company + location, bullet highlights

### EducationView (line 509)

**Route:** `/education`
**Structure:**
- Education timeline (2 degrees) — each with performance bar, core skills tags, achievements with trophy emoji for
  awards
- Training grid (`md:grid-cols-2`) — 4 cards with topic pills, institution, duration, year

### ProjectsView (line 593)

**Route:** `/projects`
**Features:**
- Featured project hero card (from `DATA.featuredProject`) with image gallery grid
- Sticky filter bar (`border-bottom`, `backdrop-filter`) — filter buttons by category
- `activeFilter` data property, `filteredProjects` computed
- Transition group with `mode="out-in"` for filter animation
- `beforeRouteLeave` — saves scroll position to `sessionStorage`
- 4 categories: Software Development (9), Web & E-Commerce (9), IT Support (5), Graphics & Design (4)

### ProjectDetailView (line 982)

**Route:** `/project/:id`
**Data source:** `DATA.projectDetails[id]`
**Structure:**
- Breadcrumb nav (Home → Projects → Title)
- Dark hero section with title, subtitle, company, developer
- Image gallery (`lg:col-span-2` main + sidebar thumbnails)
- 4 metrics cards (value + label)
- Content: System Abstract, Engineering Flow (4-step icon cards), Key Achievements
- Tech stack pills, "Need Something Similar?" CTA card, Back link

### AchievementsView (line 740)

**Route:** `/achievements`
**Structure:** 3 categories, each with icon + color-coded left border

### ReferencesView (line 767)

**Route:** `/references`
**Structure:** Responsive grid `md:grid-cols-2` — each card has avatar initial, name, title, company, phone link

### ContactView (line 797)

**Route:** `/contact`
**Features:**
- 2-column: contact info + availability (left) / form (right)
- Form fields: name, email, message — with `@blur` validation (`validateField()`)
- `submitForm()`: validates all → validates email → Web3Forms POST → success modal or error modal
- Submit button shows spinner (`animate-spin`) + "Sending..." text
- **Success modal** (`.success-overlay > .success-card`): animated checkmark SVG, "Message Sent!", "OK" button → clears
  form
- **Error modal** (`.success-overlay > .success-card.error-card`): X mark SVG, "Message Not Sent", error cause, "OK"
  button → keeps form data

---

## 6. Router Configuration (11 Routes)

```js
const routes = [
  { path: '/',                           component: HomeView         },
  { path: '/about',                      component: AboutView        },
  { path: '/skills',                     component: SkillsView       },
  { path: '/experience',                 component: ExperienceView   },
  { path: '/education',                  component: EducationView    },
  { path: '/projects',                   component: ProjectsView     },
  { path: '/project/:id',                component: ProjectDetailView},
  { path: '/achievements',               component: AchievementsView },
  { path: '/references',                 component: ReferencesView   },
  { path: '/contact',                    component: ContactView      },
  { path: '/:pathMatch(.*)*',            redirect: '/'               },
];
```

**Mode:** Hash history (`createWebHashHistory`) — ensures file:// protocol compatibility.
**Scroll behavior:** On `/projects` revisit, restores `sessionStorage` scroll position; otherwise scrolls to top.

---

## 7. CSS Design System

### 7.1 CSS Custom Properties (Light/Dark)

**Light theme** (`:root`):

| Variable | Value | Purpose |
|---|---|---|
| `--primary` | `#0891b2` | Accent links, icons |
| `--bg` | `linear-gradient(135deg, #f0fdf4, #f0fdfa, #ecfdf5)` | Page background |
| `--bg-card` | `rgba(255,255,255,0.85)` | Card surface |
| `--text` | `#1e293b` | Body text |
| `--text-heading` | `#020617` | Headings |
| `--border` | `rgba(0,0,0,0.08)` | Dividers, borders |
| `--sidebar-bg` | `rgba(255,255,255,0.88)` | Sidebar surface |
| `--glass-bg` | `rgba(255,255,255,0.7)` | Glass cards |
| `--shadow-glow` | `0 0 20px rgba(20,184,166,0.15)` | Teal glow |

**Dark theme** (`.dark`):

| Variable | Dark value |
|---|---|
| `--primary` | `#2dd4bf` |
| `--bg` | `linear-gradient(135deg, #022c22, #021a17, #022c22)` |
| `--bg-card` | `rgba(5,46,33,0.55)` |
| `--text` | `#cbd5e1` |
| `--text-heading` | `#e2e8f0` |
| `--border` | `rgba(45,212,191,0.12)` |
| `--sidebar-bg` | `rgba(5,46,33,0.92)` |
| `--glass-bg` | `rgba(5,46,33,0.5)` |

### 7.2 12 Keyframe Animations

| Name | CSS | Used On |
|---|---|---|
| `gradient-shift` | 10s ease infinite, `background-position` 0→100→0% | `<body>` background |
| `shake` | translateX(0/-4/4/0) | Contact form input `.error` |
| `fadeInUp` | opacity 0→1, translateY(30→0) | Card entrance |
| `fadeIn` | opacity 0→1 | Generic fade |
| `slideInLeft` | translateX(-30→0) | Sidebar entrance |
| `pulse` | opacity 1→0.5→1 | Loading states |
| `pulse-dot` | box-shadow scale | Status indicator dot |
| `float` | translateY(0→-6→0) | Home highlight icons |
| `shimmer` | `background-position` 200%→-200% | Button shine effect |
| `ripple` | scale(1→4), opacity→0 | Button click ripple |
| `glow-border` | border-color teal/emerald | Focus states |
| `slideUp` | translateY(20→0) | Section entrance |
| `blink` | opacity 1→0 | Typewriter cursor |
| `modalIn` | translateY(30→0) scale(0.95→1) | Modal overlay |
| `drawCheck` | stroke-dashoffset 50→0 | Success checkmark animation |

### 7.3 48 Component Classes

| Class | Purpose |
|---|---|
| `.sidebar` | Fixed desktop sidebar, 300px |
| `.mobile-nav` | Responsive mobile nav, `< 1024px` |
| `.main-content` | Content area, margin-left 300px |
| `.nav-link` | Navigation link item |
| `.nav-link-active` | Active route highlight |
| `.section` | Content section wrapper |
| `.hero-section` | Home hero section |
| `.section-tag` | Small uppercase tag above titles |
| `.section-title` | Large bold section heading |
| `.hero-title` | Home page name headline |
| `.hero-subtitle` | Home page role typewriter |
| `.hero-btn` | Home page CTA buttons |
| `.hero-stats` | Stats bar row |
| `.hero-stat-value` | Large stat number |
| `.gradient-text` | Teal gradient text fill |
| `.gradient-bg` | Teal gradient background |
| `.btn-shimmer` | Button with animated shine overlay |
| `.card-glass` | Standard glass card |
| `.card-glass-alt` | Alternative glass card (featured project) |
| `.skill-bar-track` | Gray track bar |
| `.skill-bar-fill` | Green filled portion |
| `.skill-pill` | Skill tag chip |
| `.timeline` | Vertical timeline container |
| `.timeline-item` | Timeline entry row |
| `.timeline-dot` | Circle marker on timeline |
| `.timeline-date` | Date badge on timeline |
| `.ref-card` | Reference person card |
| `.ref-avatar` | Initial avatar circle |
| `.achievement-card` | Achievement with colored left border |
| `.project-card-item` | Project grid card |
| `.project-filter-btn` | Filter tab button |
| `.project-title-link` | Project title link |
| `.project-cat-tag` | Category badge |
| `.project-card` | Gallery image card |
| `.btn-outline` | Outline button |
| `.contact-info` | Contact detail card |
| `.contact-input` | Form input/textarea |
| `.footer` | Bottom copyright |
| `.scroll-top` | Floating scroll-to-top button |
| `.theme-toggle` | Dark/light toggle button |
| `.success-overlay` | Modal backdrop |
| `.success-card` | Success modal card |
| `.success-check` | Green circle with checkmark |
| `.success-tag` | "Success" / "Failed" label |
| `.success-title` | Modal heading |
| `.success-text` | Modal body text |
| `.success-btn` | Modal action button |
| `.error-card` | Red-tinted error card variant |
| `.error-check` | Red circle X variant |
| `.error-btn` | Red gradient button |
| `.img-placeholder` | Image error fallback |
| `.offcanvas` | Mobile sidebar slide transition |
| `.typewriter-cursor` | Blinking cursor after role text |

---

## 8. Contact Form — Email Validation Engine

The `ContactView.validateEmail()` function (line 821) performs 7 checks:

### 1. Format regex
```js
/^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

### 2. Length limits
- Local part: max 64 chars
- Domain part: max 255 chars

### 3. Fake pattern detection (8 patterns)
```
test@, asdf@, 123@, abc@, qwerty@, example@, user@, admin@
```

### 4. Fake TLDs (6 TLDs)
```
localhost, test, example, invalid, fake, local
```

### 5. Disposable domain blocklist (20 domains)
```
mailinator.com, guerrillamail.com, tempmail.com, throwaway.com,
yopmail.com, 10minutemail.com, trashmail.com, sharklasers.com,
maildrop.cc, getairmail.com, temp-mail.org, fakeinbox.com,
dispostable.com, mailcatch.com, spambox.us, mailexpire.com,
mintemail.com, spamgourmet.com, spamfree24.org, wh4f.org
```

### 6. Common typo correction (11 typo mappings)
```
gamil.com → gmail.com
gmial.com → gmail.com
gmal.com → gmail.com
yaho.com → yahoo.com
yahooo.com → yahoo.com
hotmal.com → hotmail.com
hotnail.com → hotmail.com
hotmil.com → hotmail.com
outlok.com → outlook.com
outllok.com → outlook.com
protonmil.com → protonmail.com
protonmal.com → protonmail.com
```

### 7. Form submission flow
```
submitForm()
  ├── validateField('name')
  ├── validateField('email')
  ├── validateField('message')
  ├── validateEmail(email)  ← 6 checks above
  │    └── if error → showError modal, return
  ├── FormData.append('access_key', '10c1a904-...')
  ├── fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
  │    ├── success → showSuccess modal
  │    └── error → showError modal with API message
  └── catch network error → showError modal with connection message
```

### closeModal() behavior (line 872)
- If closing **error modal**: keeps form data, clears validation state
- If closing **success modal**: clears form + validation state

---

## 9. SEO Implementation

### Meta Tags

| Tag | Value |
|---|---|
| `title` | Md. Asaduzzaman (Aminur) — IT & Digital Operations Specialist \| Portfolio |
| `description` | IT professional since 2018 with 6.5+ years of hands-on employment across IT
support, ERP systems (GPRO), web development (Vue, Laravel), and system integration.
Based in Dhaka, Bangladesh. |
| `keywords` | IT Support Specialist Dhaka, ERP System Administrator, GPRO ERP, Web Developer Bangladesh, Vue.js Developer, Laravel Developer, Md. Asaduzzaman Aminur, IT Portfolio Bangladesh |
| `author` | Md. Asaduzzaman (Aminur) |
| `robots` | `index, follow` |
| `canonical` | `https://amin670bd.github.io/` |
| `color-scheme` | `dark light` |
| `favicon` | `assets/favicon.svg` (SVG gradient "A") |

### Open Graph (6 tags)

| Property | Value |
|---|---|
| `og:type` | website |
| `og:title` | Md. Asaduzzaman (Aminur) — IT & Digital Operations Specialist |
| `og:description` | IT professional since 2018 with 6.5+ years of hands-on employment
across IT support, ERP systems, web development, and system integration. |
| `og:image` | `https://avatars.githubusercontent.com/u/214401422?v=4` |
| `og:image:width` | 460 |
| `og:image:height` | 460 |
| `og:url` | `https://amin670bd.github.io` |
| `og:locale` | `en_US` |
| `og:site_name` | Amin670BD Portfolio |

### Twitter Card (4 tags)

| Tag | Value |
|---|---|
| `twitter:card` | summary |
| `twitter:title` | Md. Asaduzzaman (Aminur) — IT & Digital Operations Specialist |
| `twitter:description` | IT professional since 2018 with 6.5+ years of hands-on employment
across IT support, ERP, web dev, and system integration. |
| `twitter:image` | `https://avatars.githubusercontent.com/u/214401422?v=4` |

### JSON-LD Structured Data (Person schema)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Md. Asaduzzaman",
  "alternateName": "Aminur",
  "url": "https://amin670bd.github.io",
  "email": "amin670bd@gmail.com",
  "telephone": "+880 1979 670601",
  "jobTitle": "IT & Digital Operations Specialist",
  "knowsAbout": ["IT Support","ERP Systems","Web Development","System Integration","Vue.js","Laravel","WordPress"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Savar, Dhaka",
    "addressCountry": "BD"
  },
  "sameAs": [
    "https://linkedin.com/in/aminur670bd",
    "https://github.com/amin360it"
  ]
}
```

---

## 10. Performance Optimizations

### Bytes Saved

| Action | Before | After | Saved |
|---|---|---|---|
| Injected extension CSS (stndz-*, dark-reader) | ~287 KB | 0 | **287 KB** |
| Google Fonts preconnect + Inter stylesheet | 2 requests | 0 | **2 HTTP requests** |
| Material Icons loading | Blocking | Async (`media="print" onload`) | **Non-blocking** |
| Outfit fonts | Not preloaded | Preload with `<link rel="preload">` | **Faster font swap** |
| File root clutter | 20+ files | 11 entries | **Clean structure** |
| Raw CSS in files | Mixed | All in `style.css` | **1 CSS file** |

### Loading Strategy
1. **Critical render path**: `<head>` has only CSS links + preloads (no blocking JS)
2. **Async CSS**: Material Icons loads without blocking paint
3. **Font preloading**: Both Outfit subsets preloaded, `font-display: swap` in `@font-face`
4. **Deferred JS**: Vue, Router, jQuery, data, app — loaded at end of `<body>`
5. **No build step**: Zero tooling overhead, direct deployment

---

## 11. Deployment

### GitHub Pages
```bash
git push origin main
# Settings → Pages → Source: main → / (root) → Save
# https://amin670bd.github.io
```

### Any Static Host
Upload the root directory (minus `extras/` and `node_modules/`).

### Required Files
```
index.html       ← Entry point
404.html         ← Custom error page
assets/          ← All client resources (CSS, JS, fonts, images, favicon)
thanks.html      ← Fallback thank-you page
CV.pdf           ← Downloadable resume
```

That's it — no build, no config, no server-side processing.


