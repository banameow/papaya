# Papaya – IT E-Commerce Web Application
**ITCS223 Introduction to Web Development – Project Phase II**

---

## 👥 Team Members

| Name | Student ID |
|------|-----------|
| Nunnapat Ketruam | 6788040 |
| Nawaphon Kittisongkhram | 6788048 |
| Chattriyaporn Muenchanasongkram | 6788065 |
| Virada Klinthongchai | 6788193 |

---

## 📋 Project Overview

**Papaya** is a premium IT e-commerce platform offering laptops, smartphones, and accessories. This repository contains both the **front-end** and **back-end (web service)** implementations for Phase II.

---

## 📁 File Structure

```
.
├── sec1_gr14_database.sql              # Database schema and seed data
├── README.md                           # This file
├── sec1_gr14_fe_src/                   # Front-end server
│   ├── app.js                          # Express web server entry point
│   ├── html/
│   │   ├── add-product.html            # Admin – add new product form
│   │   ├── cart.html                   # Shopping cart page
│   │   ├── detail.html                 # Product detail template page
│   │   ├── edit-product.html           # Admin – edit existing product form
│   │   ├── index.html                  # Home page
│   │   ├── login.html                  # Admin login page
│   │   ├── notfound.html               # 404 not found page
│   │   ├── product-management.html     # Admin – product list with edit/delete
│   │   ├── products.html               # Public product listing page
│   │   ├── search.html                 # Product search page (results on demand)
│   │   ├── sign-up.html                # User registration page
│   │   └── team.html                   # Team members page
│   ├── public/
│   │   ├── script.js                   # Frontend script for interactive features
│   │   └── style.css                   # Global custom stylesheet
│   ├── package.json                    # FE dependencies
│   └── package-lock.json
└── sec1_gr14_ws_src/                   # Back-end web service server
    ├── app.js                          # Express API server entry point
    ├── package.json                    # BE dependencies
    └── package-lock.json
```

---

## 🚀 How to Run

The project requires **three things running together**: the database, the back-end web service, and the front-end server. Follow the steps in order.

### Prerequisites

Make sure the following are installed on your machine before starting:

- **Node.js & npm** — https://nodejs.org/
- **MySQL Workbench** — https://www.mysql.com/products/workbench/

---

### Step 1 — Set up the Database

1. Open **MySQL Workbench** and connect to your local MySQL server
2. Go to **File → Open SQL Script** and select `sec1_gr14_database.sql` from the project root
3. Click the **⚡ Execute** button (or press `Ctrl+Shift+Enter`) to run the script

> The script will automatically create the database, tables, default user, and seed data — no manual setup needed.

---

### Step 2 — Start the Back-end Web Service

Open a terminal and run:

```bash
cd sec1_gr14_ws_src
npm install
npm start
```

> The web service will start on **http://localhost:5001** (or whichever port is configured in `sec1_gr14_ws_src/app.js`).

---

### Step 3 — Start the Front-end Server

Open a **second terminal** and run:

```bash
cd sec1_gr14_fe_src
npm install
npm start
```

> Do not forget to add `"start": "nodemon app.js"` in the `scripts` section of `package.json` before running.


---

### Step 4 — Open in browser

Once both servers are running, open:

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
| **Team** | `team.html` | Team members page — 4 profile cards arranged in two rows (3 + 1), each with avatar, name, student ID, and social links |
| **Not Found** | `notfound.html` | 404 error page shown when a route does not exist |

---

## 🔐 Demo Login

> These credentials are for front-end testing only. Phase II will connect to the real authentication web service.

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-end server | Node.js + Express |
| Back-end web service | Node.js + Express |
| Dev tool | Nodemon (auto-restart on save) |
| Database | MySQL (schema in `papaya.sql`) |
| HTML | HTML5 with semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<aside>`) |
| Styling | Bootstrap 5.3 (CDN) + custom `public/style.css` |
| Icons | Bootstrap Icons 1.11 (CDN) |
| Fonts | Google Fonts — Outfit + DM Sans |
| JavaScript | Vanilla JS (`public/script.js`) — shared UI logic, cart, search filtering |

---

## 📝 Development Notes

- All planned web service connections are marked with `/* Phase II: ... */` comments in the JS code for easy hookup later.
- `detail.html` and `edit-product.html` are **templates** — they read `?id=` from the URL and call the product web service.
- Cart state is temporarily stored in `sessionStorage`; Phase II will replace this with a backend cart API.
- Demo coupon codes for testing: `PAPAYA10` (฿500 off), `TECH2026` (฿1,000 off)

---

*Last updated: March 2026 | ITCS223 Section 1 — Group 14*