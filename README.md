# 🏗️ SurplusX — AI-Powered Construction Surplus Exchange Platform

> **Software Engineering Design Capstone Project (Course: SE331)**  
> **Department of Software Engineering, Daffodil International University (DIU)**  
> **Semester:** Fall 2026 | **Batch:** 41 | **Section:** A  
> **Supervised by:** Md. Shohel Arman, Assistant Professor, Department of SWE

---

## 📖 Overview

**SurplusX** is a B2B web-based marketplace designed to give leftover construction materials a second life. Construction projects frequently purchase excess tiles, bricks, cement, steel, pipes, paint, doors/windows, electrical, and sanitary items that remain unused after project completion.

Our platform connects sellers holding surplus materials with buyers who need them—helping sellers recover financial investment, enabling buyers to procure materials below retail cost, and significantly reducing construction waste across Bangladesh.

---

## ✨ Key Features & Modules

### ✅ Completed & Active Modules
* **Dual-Role User & Organization Management:** Register as an Individual (NID verification) or an Organization (*Company, Contractor, Supplier, Other Business* with Trade License verification). A single account can act as both buyer and seller.
* **Surplus Material Listing:** Sellers can upload leftover material photos and details (category, brand, quantity, unit, condition, price, location, availability date).
* **Search, Filter & Direct Inquiry:** Buyers can browse and filter materials by category, price, condition, and location, and connect directly with sellers via masked WhatsApp integration.
* **Buyer Requirements & AI Match Score:** Buyers post material requirements, and the AI matching engine computes a weighted **Match Score (0–100%)** based on material type, quantity, brand, condition, budget, location, and required date.
* **Order & Online Advance Payment:** Buyers confirm orders by paying an advance amount online (supporting *bKash, Nagad, Rocket, and Card*). Quantities are reserved upon payment confirmation.
* **Automated Digital Receipt (PDF):** Generates a downloadable PDF receipt for both buyer and seller containing transaction metadata and each party's verified contact/company details to coordinate pickup or delivery.
* **Bilingual Support (English & Bangla):** Full multi-language UI switching (`EN` / `বাংলা`) powered by `react-i18next`.

### ⏳ In Progress / Pending Modules
* **Admin Panel & Moderation Suite *(Pending)*:**
  * User account approval, suspension, and management.
  * AI Fraud & Suspicious Listing Detection review queue (duplicate image perceptual hashing, abnormally low price alerts, duplicate listing checks, and Fraud Risk Score `0–100` thresholds).
  * Platform analytics, transaction reports, and dynamic fraud rule configuration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Redux Toolkit, React Router, Tailwind CSS, `react-i18next`, Lucide Icons |
| **Backend** | Node.js, Express.js, Mongoose ODM, JWT Authentication |
| **Database** | MongoDB (Community Edition / MongoDB Atlas) |
| **AI & Fraud Engine** | Weighted Multi-Factor Scoring Model, Perceptual Image Hashing (`imagehash`), Rule-Based Outlier Detection |
| **UI/UX Design** | Figma |
| **Version Control** | Git & GitHub (Collaborative Workflow) |

---

## 🗄️ Database Architecture

The MongoDB database is structured with schema validation via Mongoose ODM across core collections:
* `users` — Individual and embedded Organization profiles, roles, and verification status.
* `projects` — Project tracking linked to user/organization accounts.
* `listings` — Surplus material inventory, pricing, availability, AI predictions, and fraud risk scores.
* `requirements` — Buyer material requests and budget constraints.
* `matches` — Computed AI Match Scores and factor breakdowns.
* `orders` & `payments` — Order lifecycle tracking (`Pending Advance`, `Confirmed`, `Cancelled`) and advance payment records.
* `receipts` — Immutable snapshots of buyer/seller company info and transaction metadata.
* `fraudFlags` & `auditLogs` — Flagged listings/accounts queue and system decision audit trails.

---

## 👥 Team Contributions

This project is collaboratively developed and maintained by a 2-member team under **Course SE331 (Software Engineering Design Capstone Project)** at **Daffodil International University (Fall 2026)**:

### 1. MD Minhazul Islam Bhuiyan (`ID: 232-35-522`)
**Role:** Frontend Developer & Database Architect
* **Frontend Architecture & UI Implementation:** Developed responsive web interfaces using **React.js**, **Tailwind CSS**, **Redux Toolkit**, and **React Hook Form** across core user flows (Landing Page, Authentication, Dashboard, Search & Filters, Listing Management, Requirements Matching, Advance Payment, and Printable PDF Receipts).
* **Bilingual Localization (i18n):** Integrated full English and Bengali (`en` / `bn`) language switching across navigation bars, forms, dashboards, and receipts.
* **Database Design & Schema Modeling:** Designed the MongoDB collections, relationships, indexing strategy, and Mongoose ODM schema architecture (`users`, `projects`, `listings`, `requirements`, `matches`, `orders`, `payments`, `receipts`, `fraudFlags`, `auditLogs`).
* **Client-Side State & API Integration:** Implemented centralized API handlers, Redux state management, notification polling, and client-side matching/filtering logic.

### 2. Sathi Begum (`ID: 232-35-503`)
**Role:** UI/UX Designer (Figma) & Backend Developer
* **UI/UX Design & Prototyping (Figma):** Designed complete wireframes, user flows, color systems, and high-fidelity responsive prototypes in **Figma** for Buyer, Seller, and Admin interfaces.
* **Backend & RESTful API Development:** Built server-side architecture and RESTful API endpoints using **Node.js** and **Express.js** with **Mongoose ODM** for user authentication, surplus listings, requirements, orders, and notifications.
* **Database Connectivity & Business Logic:** Implemented backend data validation, role-based access control, order confirmation workflows, and server-side storage integration.
* **System Documentation & SRS Alignment:** Co-authored the Software Requirements Specification (SRS), Use Case diagrams, and Activity workflows aligning backend endpoints with system requirements.

> **Current Development Status:** Core Buyer & Seller workflows (Frontend + Backend) are functional. **Admin Panel** moderation, user verification, and fraud flag review modules are currently **Pending / In Progress**.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (Local Community Server or MongoDB Atlas URI)
* **Git**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Setup & Run the Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with PORT=5000, MONGO_URI, and JWT_SECRET
   npm run dev
   ```

3. **Setup & Run the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🤝 Git Collaboration Guidelines

To keep the repository clean while both teammates actively contribute:
1. Pull the latest changes before starting work:
   ```bash
   git pull origin main
   ```
2. Create a feature branch for new tasks (e.g., `feature/admin-panel` or `fix/payment-receipt`):
   ```bash
   git checkout -b feature/admin-panel
   ```
3. Commit with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "feat: add admin pending user approval table"
   ```
4. Push your branch and open a Pull Request (PR) to merge into `main`.

---

## 📄 License

This project is developed as part of the **SE331 Software Engineering Design Capstone Project** at **Daffodil International University (Fall 2026)**.