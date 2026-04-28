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
| **Home** | `index.html` | Landing page with a NewsAPI-powered carousel, "What Is Us" section, and an interactive FAQ accordion. |
| **Products** | `products.html` | Full product listing page dynamically grouped by database categories. |
| **Search** | `search.html` | Search page with 4 filter criteria (Name, Category, Brand, Price range). Results are fetched dynamically via SQL LIKE and >=/<= parameters. |
| **Detail** | `detail.html` | Product detail template. Reads product ID from the ?id= URL parameter to fetch specs, real-time stock, and images. |
| **Login** | `login.html` | Admin authentication page. Sets a 1-hour secure cookie upon successful validation. |
| **Cart** | `cart.html` | Shopping cart with quantity controls and a dynamic checkout button that validates stock against the database. |
| **Product Management** | `product-management.html` | Admin-only page. Lists all products in a grid with edit and delete buttons (features Bootstrap confirmation modals). |
| **Add Product** | `add-product.html` | Admin form to create a new product. Features dynamic specification rows and direct-to-Cloudinary image uploads. |
| **Edit Product** | `edit-product.html` | Admin form pre-filled with an existing product's data for modification. |
| **Team** | `team.html` | Team members page featuring profile cards |
| **Not Found** | `notfound.html` | 404 error page shown when a route does not exist. |

---

## 🔐 Admin Login Credentials

> Use the following credentials to access the product-management.html dashboard. (These map directly to the seeded database).

| Field | Value |
|-------|-------|
| Username | `admin0` (or admin1 through admin9) |
| Password | `admin0pass` (or admin1pass through admin9pass) |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-end server | Node.js + Express |
| Back-end web service | Node.js + Express + mysql2 |
| Dev tool | Nodemon (auto-restart on save) |
| Database | MySQL (Relational structure with Foreign Keys) |
| HTML | HTML5 with semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<aside>`) |
| Styling | Bootstrap 5.3 (CDN) + custom `public/style.css` |
| State Management | Vanilla JS, localStorage (Cart), document.cookie (Admin Auth) |
| Image Hosting | Cloudinary API (Direct front-end upload) |
| External API | NewsAPI (Proxied securely through the backend) |

---

*Last updated: April 2026 | ITCS223 Section 1 — Group 14*