# CarGo Car Rental — How the Project Works

CarGo is a **front-end-only** car rental website for Kigali and the rest of Rwanda. Visitors can browse the fleet, see prices in Rwandan Francs (RWF), sign up or log in, book a car, and manage their bookings.

There is **no backend and no database**. All data is either hard-coded in a data file or saved in the browser's `localStorage` / `sessionStorage`. Logins and bookings are simulated, so nothing leaves the user's browser.

---

## 1. Two versions of the same site

The folder holds the same website built two ways:

|              | Static version (root folder)    | React version (`CarGo_react/`)               |
| ------------ | ------------------------------- | -------------------------------------------- |
| Tech         | Plain HTML + CSS + vanilla JS   | React 18 + Vite 5 + React Router 6           |
| Pages        | One `.html` file per page       | One component per page in `src/pages/`       |
| Shared logic | `js/app.js`                     | `src/context/`, `src/hooks/`, `src/utils/`   |
| Data         | `js/data.js` (global constants) | `src/data.js` (ES module exports)            |
| Styles       | `css/style.css`                 | `src/index.css` (same 1,643-line stylesheet) |
| Images       | `image/`                        | `public/images/`                             |
| How to run   | Open `index.html` in a browser  | `npm install` then `npm run dev`             |

The two versions have the same features, prices, validation rules and storage keys. The React version is the newer port.

---

## 2. Folder structure

```
CarGo/
├── index.html, cars.html, car.html, pricing.html,     ← static pages
│   booking.html, login.html, signup.html,
│   account.html, contact.html
├── css/style.css                                       ← all styling
├── js/
│   ├── data.js        ← packages, cars, locations, demo users, testimonials
│   └── app.js         ← header/footer, fake auth, bookings, validation, helpers
├── image/                                              ← car photos + logo
│
└── CarGo_react/
    ├── index.html                 ← Vite entry (<div id="root">)
    ├── vite.config.js             ← dev server on port 5173
    ├── package.json
    ├── public/images/             ← car photos (served at /images/...)
    ├── dist/                      ← production build output
    └── src/
        ├── main.jsx               ← mounts <App/> with Router + providers
        ├── App.jsx                ← route table, header/footer layout
        ├── data.js                ← same data as js/data.js
        ├── index.css
        ├── context/
        │   ├── AuthContext.jsx    ← fake login/signup/logout
        │   └── ToastContext.jsx   ← pop-up notifications
        ├── hooks/
        │   ├── useForm.js         ← form state + validation
        │   └── useReveal.js       ← fade-in-on-scroll animation
        ├── utils/
        │   ├── helpers.js         ← RWF formatting, pricing, storage, bookings
        │   └── validators.js      ← email, phone, ID, licence, password rules
        ├── components/            ← Header, Footer, CarCard, FormField,
        │                            PageBanner, PasswordInput, ProtectedRoute
        └── pages/                 ← Home, Cars, CarDetails, Pricing, Booking,
                                     Login, Signup, Account, Contact, NotFound
```

---

## 3. Running it

**Static version:** open `index.html` in a browser. A local server such as the VS Code Live Server extension also works. No build step is needed.

**React version:**

```bash
cd CarGo_react
npm install
npm run dev       # dev server at http://localhost:5173 (opens automatically)
npm run build     # production build into dist/
npm run preview   # serve the built dist/ folder
```

**Demo accounts** (both versions):

| Email          | Password  |
| -------------- | --------- |
| demo@cargo.rw  | Demo@123  |
| aline@cargo.rw | Aline@123 |

---

## 4. The data model (`data.js`)

Everything the site displays comes from one file.

### Packages and pricing

Each car belongs to one of two packages. The daily rate depends on the package and on **where the car will be driven**:

| Package  | Inside Kigali    | Outside Kigali   |
| -------- | ---------------- | ---------------- |
| Standard | RWF 30,000 / day | RWF 50,000 / day |
| Premium  | RWF 50,000 / day | RWF 70,000 / day |

Each package also has a tagline and a list of perks shown on the Pricing page.

### Cars (`CARS`), 13 vehicles

Each car has: `id`, `name`, `type`, `package`, `seats`, `transmission`, `fuel`, `year`, `image`, `description`, `features[]`.

- **Standard (5):** Toyota Yaris Hybrid, Hyundai Sonata, Kia Sorento, BYD Song Plus, Toyota Hiace
- **Premium (8):** Mercedes C200, BYD Ti7, Land Cruiser 200, Land Cruiser 300, Mercedes G-Class, LC200 Pickup, Toyota Coaster, Safari Land Cruiser

### Locations (`LOCATIONS`)

There are 10 destinations, and each has a `zone`. **Kigali City** is `"kigali"`. The other nine (Musanze, Rubavu, Huye, Nyungwe, Akagera, Karongi, Rusizi, Nyagatare, Muhanga) are `"outside"`. The zone decides which rate applies.

### Other data

- `DUMMY_USERS`: the two demo accounts above.
- `TESTIMONIALS`: three customer quotes shown on the home page.

---

## 5. Core logic

### Pricing

```js
zoneOf(location)    // "kigali" or "outside", looked up from LOCATIONS
rateFor(car, zone)  // PACKAGES[car.package].kigali or .outside
total = rate × days // days = return date − pick-up date
formatRWF(n)        // → "RWF 30,000"
```

### Storage

A small `store` wrapper reads and writes JSON in `localStorage` inside `try/catch`, so the site keeps working when storage is blocked (for example in some private-browsing modes).

| Key              | Where                              | Contents                                      |
| ---------------- | ---------------------------------- | --------------------------------------------- |
| `cargo_users`    | localStorage                       | Accounts created on the Sign up page          |
| `cargo_session`  | localStorage **or** sessionStorage | The logged-in user (`id, name, email, phone`) |
| `cargo_bookings` | localStorage                       | Every booking made in this browser            |

### Fake authentication

- **Users** = `DUMMY_USERS` + `cargo_users` from storage.
- **Login** finds the user by email (case-insensitive) and compares the password in plain text. With "Remember me" ticked, the session goes in `localStorage` and survives closing the browser. Without it, the session goes in `sessionStorage` and ends when the tab closes.
- **Signup** rejects duplicate emails, saves the new user to `cargo_users`, then logs them in.
- **Logout** clears both session stores.

In the static version this is the `Auth` object in `js/app.js`. In React it is `AuthContext`, and any component reads it with `useAuth()`, which returns `{ user, login, signup, logout, emailExists }`.

### Bookings

The `Bookings` helper:

- `add(booking)` creates an id like `CG-4F9K2A`, sets `status: "confirmed"` and `createdAt`, and saves it.
- `forUser(email)` returns that user's bookings.
- `cancel(id)` sets `status` to `"cancelled"`. Bookings are never deleted.

A saved booking holds the car, location, zone, pick-up point, dates, days, rate, total, driver details and notes.

### Protected pages and redirects

- **Account** requires a login. React wraps it in `<ProtectedRoute>`. The static `account.html` checks `Auth.current()` itself. Both send a logged-out visitor to `/login?next=<page>`.
- **Booking** shows a "Log in to book a car" prompt instead of the form when no one is logged in.
- After login or signup the user returns to the `next` page. The `next` value is first checked against a strict pattern (`safeNext()` in React, and a regex in `login.html`), so the site can't be used to redirect people to outside websites.

### Form validation

Each form declares its rules as `{ field: [[testFn, "error message"], ...] }`, and each field's rules run in order until one fails.

- Static: `attachValidation(form, rules, onValid)` in `app.js` validates a field on blur or change, re-checks it while the user types, and on submit focuses the first invalid field.
- React: the `useForm(initialValues, rules)` hook returns `field(name)` (props to spread on an input), `status(name)` (`"valid"` / `"invalid"`), `errors` and `handleSubmit`.

The built-in validators (`Validators`):

| Rule             | What it accepts                                                                    |
| ---------------- | ---------------------------------------------------------------------------------- |
| `email`          | `name@domain.tld`                                                                  |
| `phone`          | A Rwandan mobile number: `07[2389]XXXXXXX` or `+2507…` (MTN / Airtel)              |
| `name`           | Letters only, with at least first and last name                                    |
| `strongPassword` | 8 or more characters, with upper case, lower case and a digit                      |
| `idOrPassport`   | A 16-digit National ID starting with `1`, or a passport number such as `PC1234567` |
| `licence`        | 6–16 letters or digits                                                             |

`passwordScore()` rates a password from 0 to 4 for the strength meter on the Sign up page.

---

## 6. Pages and user flow

```
Home ──► Our Fleet ──► Car details ──► Booking ──► Confirmation ──► My Account
  │          ▲                            │
  └─ quick   │                            └─ not logged in → Login / Sign up → back to Booking
     search ─┘
```

| Page        | React route | Static file     | What it does                                                                                                                                                                                                                                                                                                           |
| ----------- | ----------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home        | `/`         | `index.html`    | Hero section, a quick price estimator (location + package + dates), featured cars, testimonials. The estimator links to `/cars?package=…&zone=…`.                                                                                                                                                                      |
| Our Fleet   | `/cars`     | `cars.html`     | Filter by search text, package, type and minimum seats. Sort by price, seats or name. Toggle Kigali / outside prices. `package` and `zone` live in the URL so links can share a filtered view.                                                                                                                         |
| Car details | `/cars/:id` | `car.html?id=…` | Specs, features, a live price for a chosen location and number of days (1–60), and similar cars. "Book" goes to `/booking?car=…&location=…&days=…`.                                                                                                                                                                    |
| Pricing     | `/pricing`  | `pricing.html`  | Compares the two packages, with a Kigali / outside toggle.                                                                                                                                                                                                                                                             |
| Booking     | `/booking`  | `booking.html`  | Two-part form (trip details, then driver details) with a live price summary. Pre-filled from the URL and from the logged-in user. Rules: pick-up date not in the past, return date after pick-up, at most 60 days, terms accepted. On success it saves the booking and shows a confirmation with the reference number. |
| Log in      | `/login`    | `login.html`    | Email + password + "remember me". Header and footer are hidden on auth pages.                                                                                                                                                                                                                                          |
| Sign up     | `/signup`   | `signup.html`   | Name, email, Rwandan phone, strong password with strength meter. Logs the new user in automatically.                                                                                                                                                                                                                   |
| My Account  | `/account`  | `account.html`  | Stats (active bookings, rental days, total value) and a booking list with a Cancel button.                                                                                                                                                                                                                             |
| Contact     | `/contact`  | `contact.html`  | Validated contact form. It only shows a thank-you toast and sends nothing.                                                                                                                                                                                                                                             |
| Not found   | `*`         | n/a             | 404 page (React only).                                                                                                                                                                                                                                                                                                 |

### Shared UI

- **Header:** navigation links with the active page highlighted, a mobile menu toggle, and either Log in / Sign up buttons or a user chip with a dropdown (account, new booking, log out).
- **Footer:** links, package prices, contact details and a newsletter form (validation only).
- **Toast:** a small message that appears for about 3 seconds (`toast("…")` / `useToast()`).
- **Scroll reveal:** elements with the `.reveal` class fade in as they scroll into view (IntersectionObserver).

---

## 7. How the React app starts

```
main.jsx
 └─ <BrowserRouter>
     └─ <ToastProvider>          toast available everywhere
         └─ <AuthProvider>       user/login/logout available everywhere
             └─ <App>
                 ├─ <Header/>
                 ├─ <main><Routes>…</Routes></main>   scrolls to top on each route change
                 └─ <Footer/>                          hidden on /login and /signup
```

In the static version, every HTML page loads `js/data.js` and then `js/app.js`. On `DOMContentLoaded`, `app.js` fills in `#site-header` and `#site-footer` and starts the password tools and scroll reveal. Each page then runs its own inline `<script>` for page-specific behaviour.

---

## 8. Common changes

| To…                 | Edit                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Change prices       | `PACKAGES` in `data.js` (both versions)                                                    |
| Add a car           | Add an object to `CARS` and put its photo in `image/` (static) or `public/images/` (React) |
| Add a destination   | Add `{ value, label, zone }` to `LOCATIONS`                                                |
| Change validation   | `Validators` in `js/app.js` or `src/utils/validators.js`                                   |
| Add a React page    | Create it in `src/pages/`, add a `<Route>` in `App.jsx`, and a nav link in `Header.jsx`    |
| Reset all demo data | Clear the site's `localStorage` in browser DevTools (Application tab)                      |

---

## 9. Known limitations

- **Not secure, and not meant to be.** Passwords are stored and compared in plain text in the browser. This is a demo, not a real login system.
- **Data stays in one browser.** Bookings and accounts don't sync across devices or users.
- **Contact and newsletter forms send nothing.**
- **Missing images.** Several cars point to photos that aren't in the repo. Only `kia-sorento`, `lc200`, `lc300` and `toyota-coaster` exist. These are missing:

  - Yaris, Sonata, BYD Song Plus, Hiace, C200, BYD Ti7, G-Class, LC200 Pickup and Safari Land Cruiser.
  - The logo: the code expects `logo.png`, but the static folder has `logo.jfif` and the React `public/images/` folder has no logo at all.

  These images will show as broken until the files are added.

- **Two copies of the same code.** The data, logic and CSS exist in both versions, so a change must be made in both places (or the static version retired).
