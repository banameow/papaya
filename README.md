# Papaya – IT E-Commerce Web Application
**ITCS223 Introduction to Web Development – Project Phase II**

---

## 👥 Team Members

| Name | Student ID |
|------|-----------|
| Nunnapat Ketruam | 6788040 |
| Nawaphon Kittisongkhram | 6788048 |
| Chattriyaporn Muenchanasongkram | 6788065 |
| Waiyawat Orangaphichat | 6788075 |
| Virada Klinthongchai | 6788193 |

---

## 📋 Project Overview

**Papaya** is a premium IT e-commerce platform offering laptops, smartphones, and accessories. This repository contains the **front-end implementation** (Task 1 — Phase II).

---

## 📁 File Structure

```
.
├── app.js                        # Express web server entry point
├── html/
│   ├── add-product.html          # Admin – add new product form
│   ├── cart.html                 # Shopping cart page
│   ├── detail.html               # Product detail template page
│   ├── edit-product.html         # Admin – edit existing product form
│   ├── index.html                # Home page
│   ├── login.html                # Admin login page
│   ├── product-management.html   # Admin – product list with edit/delete
│   ├── products.html             # Public product listing page
│   ├── search.html               # Product search page (results on demand)
│   ├── sign-up.html              # User registration page
│   └── team.html                 # Team members page
├── public/
│   └── style.css                 # Global custom stylesheet
├── package.json                  # Project metadata and dependencies
├── package-lock.json             # Locked dependency versions
└── README.md                     # This file
```

---

## 🚀 How to Run

### Prerequisites

Make sure **Node.js** and **npm** are installed on your machine.
Download from: https://nodejs.org/

### 1. Install dependencies

```bash
npm install
```

This installs all required packages listed in `package.json` (including Express and Nodemon).

### 2. Start the server

**For production / normal run:**

** Do not forget to add the script ("start": "nodemon app.js") for monitoring
```bash
npm start
```

**For development (with Nodemon — auto-restarts on file changes):**

```bash
npm run dev
```

> Nodemon watches for any file changes and automatically restarts the server, so you don't need to manually stop and re-run after every edit. Recommended for all team members during active development.

### 3. Open in browser

```
http://localhost:3000
```

---

## 📄 Pages Description

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Landing page with an ADS/Promotion banner, a "What Is Us" section, exclusive product highlights, and a FAQ accordion |
| **Products** | `products.html` | Full product listing page — shows all sections: Promotions for You, New Coming, and Suggestion — matching the Figma design |
| **Search** | `search.html` | Search page with 4 filter criteria (Name, Category, Brand, Price range). **Results are hidden until the user clicks Search**, then scroll into view automatically |
| **Detail** | `detail.html` | Product detail template — shows image gallery, full specifications table, quantity selector, and Add to Cart button. Reads product ID from the `?id=` URL parameter |
| **Login** | `login.html` | Admin authentication page — split layout with brand panel on the left and login form on the right |
| **Sign Up** | `sign-up.html` | New user registration form with fields for username, email, phone, address, and password |
| **Cart** | `cart.html` | Shopping cart showing item list, quantity controls, coupon code input, and order summary with subtotal / discount / total |
| **Product Management** | `product-management.html` | Admin-only page — lists all products in a grid with **edit** and **delete** buttons per card, and an **+ ADD** button to go to the add form |
| **Add Product** | `add-product.html` | Admin form to create a new product — fields for name, brand, category, price, stock, description, and image upload |
| **Edit Product** | `edit-product.html` | Admin form pre-filled with an existing product's data for modification. Product ID is read from the `?id=` URL parameter |
| **Team** | `team.html` | Team members page — 5 profile cards arranged in two rows (3 + 2), each with avatar, name, student ID, and social links |

---

## 🔐 Demo Login (Phase I Placeholder)

> These credentials are for front-end testing only. Phase II will connect to the real authentication web service.

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Server | Node.js + Express |
| Dev tool | Nodemon (auto-restart on save) |
| HTML | HTML5 with semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<aside>`) |
| Styling | Bootstrap 5.3 (CDN) + custom `public/style.css` |
| Icons | Bootstrap Icons 1.11 (CDN) |
| Fonts | Google Fonts — Outfit + DM Sans |
| JavaScript | Vanilla JS — shared UI logic, cart, search filtering |

---

## 📝 Development Notes

- All planned web service connections are marked with `/* Phase II: ... */` comments in the JS code for easy hookup later.
- `detail.html` and `edit-product.html` are **templates** — they read `?id=` from the URL and will call the product web service in Phase II.
- Cart state is temporarily stored in `sessionStorage`; Phase II will replace this with a backend cart API.
- Demo coupon codes for testing: `PAPAYA10` (฿500 off), `TECH2026` (฿1,000 off)

---

*Last updated: March 2026 | ITCS223 Section X — Papaya Group*