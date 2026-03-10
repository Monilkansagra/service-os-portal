# 🛠️ Service OS Portal
### **Enterprise-Grade Service Management System**



[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)

---

## 📖 Overview
**Service OS Portal** is a high-performance, full-stack solution tailored for complex organizational environments. By moving away from traditional monolithic structures, this project implements an **API-first architecture**, ensuring that the frontend remains decoupled from the data layer for maximum scalability and security.

It serves as a centralized hub for managing department-wise service requests, personnel allocation, and administrative master data.

---

## 🚀 Key Features & Technical Logic

### 🔐 **Secure Authentication & RBAC**
* **Mechanism:** Utilizes **Stateless JWT Tokens** stored in HTTP-only cookies to prevent XSS attacks.
* **Protection:** Global `middleware.ts` intercepts every request to validate session state before rendering protected routes.
* **Role-Based Access:** Distinct dashboards and permissions for `Admin`, `HOD`, `Technician`, and `End-User`.

### 🏢 **Relational Master Management**
* **Department Master:** Allows multi-campus department tracking with automatic timestamping and metadata management.
* **Personnel Mapping:** A sophisticated Junction-Table logic that maps `Users` → `Roles` → `Departments`, ensuring strict data integrity and zero redundancy.

### 🔌 **API-First CRUD Architecture**
* Standardized JSON responses for all endpoints.
* Dynamic routing using Next.js `[id]` patterns for resource-specific operations (PATCH/DELETE).
* **Defensive Coding:** Logic implemented to handle "orphan" records where relational data might be missing, ensuring the UI never crashes.

---

## 🏗️ System Architecture



### **Data Flow Detail**
1.  **Request Layer:** Users interact with highly responsive **React Client Components**.
2.  **Action Layer:** Form submissions trigger **Next.js Server Actions**, which perform server-side validation.
3.  **API Layer:** The server communicates internally with **REST Endpoints** located in `/app/api/`. This allows the backend to be used by mobile apps or external services in the future.
4.  **Persistence Layer:** **Prisma ORM** executes type-safe queries against a **MySQL** database, ensuring compile-time safety for all DB operations.

---

## 🛠️ Technical Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15 (App Router)** | Optimized Hybrid rendering (SSR/CSR) for speed. |
| **Styling** | **Tailwind CSS** | Custom high-contrast UI with a professional "Dark/Light" aesthetic. |
| **ORM** | **Prisma** | Schema-first database modeling and type-safe migrations. |
| **Database** | **MySQL** | Reliable, ACID-compliant relational data storage. |
| **Security** | **Jose / BCrypt** | Modern JWT signing and industrial-strength password hashing. |
| **Icons** | **Lucide React** | Consistent, lightweight vector iconography for better UX. |

---

## 📁 Project Structure

```bash
├── app/
│   ├── (admin)/          # 👑 Admin protected routes (Master screens)
│   ├── (portal)/         # 🛰️ User-facing service portal & technician view
│   ├── api/              # 📡 REST Endpoints: The central logic hub
│   │   ├── departments/  # /api/departments -> CRUD operations
│   │   ├── users/        # /api/users -> Personnel management
│   │   └── auth/         # /api/auth -> Login/Logout sessions
│   └── login/            # 🔑 Auth portal UI
├── components/           # 🧩 Reusable UI Components (Modals, Buttons, Layouts)
├── lib/                  # 📚 Shared singletons (db.ts, jwt.ts, utils.ts)
├── prisma/               # 💎 Database blueprints (schema.prisma)
└── middleware.ts         # 🛡️ The 'Gatekeeper' protecting administrative routes
