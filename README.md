<div align="center">

```
███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗ ██████╗ ███████╗
██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝██╔═══██╗██╔════╝
███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  ██║   ██║███████╗
╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  ██║   ██║╚════██║
███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗╚██████╔╝███████║
╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝ ╚═════╝ ╚══════╝
```

# 🚀 ServiceOS — AdminOS Portal

### *Enterprise-Grade · Full-Stack · Production-Ready Service Management*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/Monilkansagra/service-os-portal?style=social)](https://github.com/Monilkansagra/service-os-portal)
[![GitHub Forks](https://img.shields.io/github/forks/Monilkansagra/service-os-portal?style=social)](https://github.com/Monilkansagra/service-os-portal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<br/>

> **ServiceOS** is a production-ready, full-stack service ticketing and management platform built for complex organizational environments. Featuring role-based access control, auto-assignment workflows, real-time chat threads, and a stunning dark UI with glassmorphism — it's everything a modern enterprise needs, out of the box.

<br/>

[🔥 Live Demo](#) · [📖 Documentation](#-table-of-contents) · [🐛 Report Bug](https://github.com/Monilkansagra/service-os-portal/issues) · [✨ Request Feature](https://github.com/Monilkansagra/service-os-portal/issues)

</div>

---

## 📋 Table of Contents

- [✨ Why ServiceOS?](#-why-serviceos)
- [🎯 Features at a Glance](#-features-at-a-glance)
- [🏗️ System Architecture](#%EF%B8%8F-system-architecture)
- [🗃️ Database Schema](#%EF%B8%8F-database-schema)
- [👥 Role-Based Access Control](#-role-based-access-control)
- [🔄 Core Business Flow](#-core-business-flow)
- [📡 API Reference](#-api-reference)
- [📁 Project Structure](#-project-structure)
- [🎨 UI & Design System](#-ui--design-system)
- [🔐 Security Architecture](#-security-architecture)
- [⚡ Getting Started](#-getting-started)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [📊 Pages & Functionality](#-pages--functionality)
- [🤝 Contributing](#-contributing)

---

## ✨ Why ServiceOS?

Most service desk tools are either too simple for enterprise needs or too bloated with unnecessary features. **ServiceOS bridges that gap** by providing a lean, powerful, and beautifully designed platform that handles the entire service request lifecycle — from ticket creation to resolution — without the complexity overhead.

```
❌ Without ServiceOS                 ✅ With ServiceOS
─────────────────────────────────    ───────────────────────────────────
📧 Emails lost in inboxes            🎯 Centralized ticket tracking
🗂️ Excel sheets for tracking         📊 Real-time dashboards & charts
❓ No auto-assignment logic           🤖 Intelligent auto-assignment
🔒 No role-based access              👥 3-tier RBAC (Admin/HOD/Employee)
📉 No performance visibility         📈 Activity heatmaps & reports
💬 No communication thread           🗨️ Built-in chat reply threads
```

---

## 🎯 Features at a Glance

<table>
<tr>
<td width="50%">

### 🔐 Auth & Security
- ✅ JWT HTTP-only cookie auth (24h expiry)
- ✅ bcrypt password hashing
- ✅ Global middleware protection
- ✅ Role-Based Access Control (RBAC)
- ✅ Auto-redirect on invalid sessions
- ✅ Per-request user header injection

</td>
<td width="50%">

### 📊 Admin Analytics
- ✅ KPI cards (users, depts, requests)
- ✅ 7-day Line Chart (request trends)
- ✅ Department-wise Pie Chart
- ✅ Response Time Bar Chart
- ✅ 12-week Activity Heatmap
- ✅ CSV/Excel export reports

</td>
</tr>
<tr>
<td width="50%">

### 🎫 Ticket Management
- ✅ Auto-assign technicians on submit
- ✅ HOD approval/rejection workflow
- ✅ Chat-style reply threads
- ✅ File attachment support
- ✅ Live status tracking
- ✅ Manual technician reassignment

</td>
<td width="50%">

### 🎨 UI/UX Excellence
- ✅ Dark mode (glassmorphism design)
- ✅ 3D parallax login card
- ✅ Collapsible animated sidebar
- ✅ Framer Motion page transitions
- ✅ Drag & drop (dnd-kit)
- ✅ Mobile-responsive hamburger menu

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│                                                                     │
│   👤 Admin Portal    👤 HOD Dashboard    👤 Employee / Technician   │
│   /admin-dashboard   /hod-dashboard      /portal-dashboard          │
│                                                                     │
│   ┌─────────────┐   ┌─────────────┐    ┌────────────────────────┐  │
│   │ React 19    │   │ React 19    │    │ React 19 Components    │  │
│   │ Components  │   │ Components  │    │ + Chat Thread UI       │  │
│   └──────┬──────┘   └──────┬──────┘    └──────────┬─────────────┘  │
└──────────┼────────────────┼────────────────────────┼───────────────┘
           │                │                        │
           ▼                ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER  🛡️                           │
│                                                                     │
│          middleware.ts → JWT Verification + RBAC Guard              │
│          ✓ Validates token   ✓ Checks role   ✓ Injects headers      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       API LAYER  📡                                 │
│                                                                     │
│  /api/auth      /api/users     /api/departments   /api/requests     │
│  /api/status    /api/replies   /api/type-mapping  /api/stats        │
│  /api/roles     /api/service-type                 /api/request-types│
│                                                                     │
│  ─── Next.js Route Handlers (App Router) ──── REST/JSON ───────    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER  💾                            │
│                                                                     │
│          Prisma ORM 5.22  ──── Type-safe queries ────               │
│                                                                     │
│     ┌─────────────────────────────────────────────────────┐        │
│     │                   MySQL Database                    │        │
│     │                                                     │        │
│     │  roles  users  departments  service_requests        │        │
│     │  service_type  request_types  replies  attachments  │        │
│     │  approvals  status_master  type_mapping  dept_person│        │
│     └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔁 Request Data Flow

```
[1] User Action           [2] Server Validation      [3] API Processing
React Client    ──────►  Next.js Server Actions  ──► REST Endpoints
Component                 (form validation)           /app/api/

[4] DB Query              [5] Response               [6] UI Update
Prisma ORM     ◄──────   JSON Response        ──────► React State
(type-safe)               { data, status }            re-render
```

---

## 🗃️ Database Schema

**12 tables** with well-defined relationships and zero redundancy:

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────────────┐
│    roles     │────►│      users       │────►│ service_department_    │
│              │     │                  │     │       person           │
│ id           │     │ id               │     │                        │
│ name         │     │ name             │     │ user_id (FK)           │
└──────────────┘     │ email            │     │ dept_id (FK)           │
                     │ password (bcrypt)│     │ is_hod (bool)          │
                     │ role_id (FK)     │     └────────────────────────┘
                     └──────────────────┘               │
                              │                         ▼
                              │              ┌────────────────────────┐
                              │              │  service_department    │
                              │              │                        │
                              │              │ id, name, created_at   │
                              │              └────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       service_request  🎫                           │
│                                                                     │
│  id · title · description · status_id · type_id                    │
│  created_by · assigned_to · created_at · updated_at                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
           ┌─────────────────────┼──────────────────────┐
           ▼                     ▼                      ▼
┌─────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ service_request │  │ service_request_     │  │ service_request_     │
│     _reply      │  │      approval        │  │     attachment       │
│                 │  │                      │  │                      │
│ id, message     │  │ id, hod_id           │  │ id, file_url         │
│ user_id (FK)    │  │ status, comments     │  │ file_name            │
│ request_id (FK) │  │ request_id (FK)      │  │ request_id (FK)      │
│ created_at      │  │ created_at           │  │ uploaded_at          │
└─────────────────┘  └──────────────────────┘  └──────────────────────┘

┌──────────────────┐     ┌──────────────────────────┐
│  service_type    │────►│    service_request_type  │
│                  │     │                          │
│ id, name, dept   │     │ id, name                 │
└──────────────────┘     │ service_type_id (FK)     │
                         │ dept_id (FK)             │
                         └──────────────────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ service_request_type_person  │
                     │                              │
                     │ user_id (FK) → Technician    │
                     │ request_type_id (FK)         │
                     └──────────────────────────────┘
```

---

## 👥 Role-Based Access Control

```
┌───────────────────────────────────────────────────────────────────┐
│                     🔐 RBAC Architecture                         │
└───────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  👑  ADMIN                                                  │
  │  Dashboard: /admin-dashboard                                │
  │                                                             │
  │  ► Full system control & all CRUD operations                │
  │  ► Master data management (departments, users, services)    │
  │  ► Analytics: charts, heatmaps, response time reports       │
  │  ► User role assignment & technician mapping                │
  │  ► Export reports to CSV / Excel                            │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  🏢  HOD  (Head of Department)                              │
  │  Dashboard: /hod-dashboard                                  │
  │                                                             │
  │  ► View all requests within their department                │
  │  ► Approve or reject service requests                       │
  │  ► Assign/reassign technicians manually                     │
  │  ► Monitor technician performance metrics                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  👤  EMPLOYEE / TECHNICIAN                                  │
  │  Dashboard: /portal-dashboard & /technician                 │
  │                                                             │
  │  Employees:                                                 │
  │  ► Submit new service requests                              │
  │  ► Track their own ticket status in real-time               │
  │  ► Participate in chat reply threads                        │
  │  ► View and download attachments                            │
  │                                                             │
  │  Technicians:                                               │
  │  ► View assigned work queue                                 │
  │  ► Update request status at any stage                       │
  │  ► Reply to ticket threads                                  │
  └─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Core Business Flow

```
                         🚀 SERVICE REQUEST LIFECYCLE

  ┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
  │  STEP 1 │    │   STEP 2    │    │   STEP 3    │    │   STEP 4    │
  │         │    │             │    │             │    │             │
  │  Login  │───►│   Role      │───►│  Employee   │───►│   System    │
  │  🔑     │    │  Detection  │    │  Submits    │    │   AUTO      │
  │         │    │  🔍         │    │  Request 📝 │    │  ASSIGNS 🤖 │
  └─────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                               │
                                                               ▼
  ┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
  │  STEP 8 │    │   STEP 7    │    │   STEP 6    │    │   STEP 5    │
  │         │    │             │    │             │    │             │
  │Employee │    │ Technician  │    │   HOD Can   │    │   HOD       │
  │ Tracks  │◄───│  Updates +  │◄───│  Reassign   │◄───│ Approves /  │
  │ Status  │    │  Replies 💬 │    │  Tech 🔄    │    │ Rejects ✅  │
  │ 📈      │    │             │    │             │    │             │
  └─────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                               │
                                                               ▼
                                                    ┌─────────────────┐
                                                    │     STEP 9      │
                                                    │                 │
                                                    │  Admin Monitors │
                                                    │  Charts &       │
                                                    │  Reports 📊     │
                                                    └─────────────────┘
```

**Auto-Assignment Logic:**
> When a request is submitted, the system queries the `service_request_type_person` table to find a technician mapped to that specific request type, and auto-assigns — zero manual overhead.

---

## 📡 API Reference

### Auth

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/auth/login` | Login with email + password, returns JWT cookie | ❌ |
| `POST` | `/api/auth/logout` | Clears HTTP-only JWT cookie | ✅ |

### Users

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/[id]` | Get single user |
| `PUT` | `/api/users/[id]` | Update user |
| `DELETE` | `/api/users/[id]` | Delete user |

### Departments

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/departments` | List all departments |
| `POST` | `/api/departments` | Create department |
| `GET/POST` | `/api/dept-person` | Manage dept-person mappings |

### Service Requests *(Core)*

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/requests` | List all requests |
| `POST` | `/api/requests` | Create request + **auto-assign technician** |
| `DELETE` | `/api/requests` | Delete request |
| `GET` | `/api/requests/[id]` | Get full request detail |
| `PUT` | `/api/requests/[id]` | Update request |
| `DELETE` | `/api/requests/[id]` | Delete specific request |
| `GET/POST` | `/api/request-reply` | Get/add replies on a request |

### Master Data

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET/POST/PUT/DELETE` | `/api/service-type` | Service categories CRUD |
| `GET/POST` | `/api/request-types` | Request types CRUD |
| `GET/POST/DELETE` | `/api/type-mapping` | Technician ↔ Type mapping |
| `GET/POST/PUT/DELETE` | `/api/status` | Status options CRUD |
| `GET/POST/PUT/DELETE` | `/api/status-master` | Status master CRUD |

### Utilities

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/stats` | Dashboard KPI statistics |
| `GET` | `/api/roles` | List all roles |
| `GET` | `/api/debug` | Dev/JWT debug endpoint |

> **All endpoints** return standardized JSON: `{ data, message, status }` — ready for future mobile/external integrations.

---

## 📁 Project Structure

```
service-management-system/
│
├── 📂 app/
│   ├── 👑 (admin)/                   # Admin-protected pages + layout
│   │   ├── admin-dashboard/          # KPIs, charts, heatmap
│   │   ├── dept-master/              # Department CRUD
│   │   ├── dept-person/              # Dept-User mapping
│   │   ├── request-type/             # Request type management
│   │   ├── service-type/             # Service category management
│   │   ├── status-master/            # Status options management
│   │   ├── type-mapping/             # Technician-type mapping
│   │   ├── department-person-master/ # View all dept-person records
│   │   └── reports/                  # Filterable reports + export
│   │
│   ├── 🏢 (hod)/                     # HOD-protected pages + layout
│   │   └── hod-dashboard/            # Dept requests, assign, approve
│   │
│   ├── 🛰️ (portal)/                  # Employee + Technician pages
│   │   ├── portal-dashboard/         # Submit request, view tickets
│   │   ├── request-details/[id]/     # Full ticket + reply thread
│   │   └── technician/               # Work queue, status update
│   │
│   ├── 📡 api/                       # All REST route handlers
│   │   ├── auth/login/               # POST: Login
│   │   ├── auth/logout/              # POST: Logout
│   │   ├── users/                    # GET, POST
│   │   ├── users/[id]/               # GET, PUT, DELETE
│   │   ├── departments/              # GET, POST
│   │   ├── dept-person/              # GET, POST
│   │   ├── service-type/             # Full CRUD
│   │   ├── request-types/            # GET, POST
│   │   ├── type-mapping/             # GET, POST, DELETE
│   │   ├── requests/                 # GET, POST, DELETE
│   │   ├── requests/[id]/            # GET, PUT, DELETE
│   │   ├── request-reply/            # GET, POST
│   │   ├── status/                   # Full CRUD
│   │   ├── status-master/            # Full CRUD
│   │   ├── stats/                    # GET: Dashboard stats
│   │   ├── roles/                    # GET: All roles
│   │   └── debug/                    # GET: Dev debug
│   │
│   ├── 🔑 login/                     # Auth portal UI
│   └── globals.css                   # Global styles + CSS variables
│
├── 🧩 components/
│   ├── adminSidebar.tsx              # Collapsible admin sidebar
│   ├── hodSidebar.tsx                # HOD sidebar
│   ├── portalSidebar.tsx             # Employee sidebar
│   ├── dashboard/                    # Shared chart components
│   │   ├── LineChart.tsx
│   │   ├── PieChart.tsx
│   │   ├── BarChart.tsx
│   │   └── ActivityHeatmap.tsx
│   └── ui/                           # Reusable UI primitives
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       └── Badge.tsx
│
├── 📚 lib/
│   ├── db.ts                         # Prisma client singleton
│   ├── jwt.ts                        # JWT sign/verify utilities
│   └── utils.ts                      # Shared helper functions
│
├── 💎 prisma/
│   └── schema.prisma                 # Full DB schema (MySQL)
│
├── 🛡️ middleware.ts                   # JWT auth + RBAC gatekeeper
├── .env                              # DATABASE_URL, JWT_SECRET
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # TailwindCSS theme config
└── tsconfig.json                     # TypeScript configuration
```

---

## 🎨 UI & Design System

```
Color Palette:
┌─────────────────────────────────────────────────────────┐
│  Background  #0F0F1A  ████  Deep space dark             │
│  Admin       Indigo/Violet gradient  ████░░  Power      │
│  Portal      Blue/Teal gradient      ████░░  Trust      │
│  HOD         Purple gradient         ████░░  Authority  │
│  Accent      White / Light Gray      ████░░  Clarity    │
└─────────────────────────────────────────────────────────┘
```

| Feature | Detail |
|:---|:---|
| 🎭 **Theme** | Dark mode with glassmorphism cards (blur + semi-transparent) |
| 🖱️ **Login** | 3D parallax tilt effect tracking mouse movement |
| 📐 **Sidebar** | Animated collapse — `260px ↔ 72px` smooth transition |
| 📊 **Charts** | Line, Pie, Bar, Activity Heatmap via Recharts 3 |
| 📱 **Responsive** | Mobile hamburger menu, adaptive grid layouts |
| 🔔 **Notifications** | Bell icon with animated dropdown panel |
| ✨ **Animations** | Page transitions + micro-interactions via Framer Motion 12 |
| 🃏 **Cards** | Glassmorphism: `backdrop-blur` + `bg-opacity` layering |
| 🔀 **Drag & Drop** | @dnd-kit for sortable list interactions |

---

## 🔐 Security Architecture

```
           🌐 Incoming Request
                   │
                   ▼
    ┌──────────────────────────────┐
    │        middleware.ts 🛡️       │
    │                              │
    │  1. Extract "token" cookie   │
    │  2. Verify JWT signature     │
    │  3. Check expiry (24h)       │
    │  4. Decode role              │
    │  5. Match route to role      │
    └──────────────┬───────────────┘
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
    ✅ Authorized      ❌ Unauthorized
    Inject headers:    ──► Redirect to /login
    x-user-id          + Clear invalid cookie
    x-user-role
    x-user-name
          │
          ▼
    🔓 Route renders

```

- **Password Security:** bcrypt hashing — salted, one-way, industry-standard
- **XSS Prevention:** JWT stored as HTTP-only cookie — inaccessible to JavaScript
- **CSRF Protection:** Token-bound to session, role-validated per request
- **Orphan Handling:** Defensive API coding ensures UI never crashes on missing relational data

---

## ⚡ Getting Started

### Prerequisites

- Node.js `≥ 18.0`
- MySQL `≥ 8.0`
- npm / yarn / pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/Monilkansagra/service-os-portal.git
cd service-os-portal
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/serviceos"

# JWT Secret (use a long, random string in production)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-chars"
```

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to MySQL
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

### 6. Build for Production

```bash
npm run build
npm start
```

### Default Login Credentials *(after seeding)*

| Role | Email | Password |
|:---|:---|:---|
| 👑 Admin | `admin@serviceos.com` | `admin123` |
| 🏢 HOD | `hod@serviceos.com` | `hod123` |
| 👤 Employee | `employee@serviceos.com` | `emp123` |

> ⚠️ **Change all passwords immediately after first login in any production environment.**

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|:---|:---|:---:|:---|
| **Framework** | Next.js (App Router) | 16.1.1 | Hybrid SSR/CSR, routing, API |
| **Language** | TypeScript | 5.0 | Type safety across full stack |
| **UI Library** | React | 19 | Component-based UI |
| **Styling** | TailwindCSS | 4.0 | Utility-first responsive CSS |
| **Database** | MySQL | 8.0+ | ACID-compliant relational storage |
| **ORM** | Prisma | 5.22 | Type-safe DB queries + migrations |
| **Auth** | jose (JWT) | latest | Stateless HTTP-only cookie auth |
| **Password** | bcryptjs | latest | Salted, one-way hashing |
| **Animations** | Framer Motion | 12 | Page transitions + micro-interactions |
| **Charts** | Recharts | 3 | Line, Bar, Pie, Heatmap |
| **Icons** | Lucide React | latest | Consistent vector iconography |
| **Drag & Drop** | @dnd-kit | latest | Sortable list interactions |
| **Theme** | next-themes | latest | Dark mode support |

---

## 📊 Pages & Functionality

### 👑 Admin Panel — 9 Pages

| Page | URL | Key Features |
|:---|:---|:---|
| Admin Dashboard | `/admin-dashboard` | KPI cards, 7-day line chart, pie/bar charts, 12-week activity heatmap, recent requests table |
| Department Master | `/dept-master` | Create / Edit / Delete departments |
| Department Person | `/dept-person` | Assign users to departments, mark HOD |
| Request Type | `/request-type` | CRUD for request types per dept + service |
| Service Type | `/service-type` | CRUD for service categories |
| Status Master | `/status-master` | Manage statuses (name, CSS class, sequence, flags) |
| Type Mapping | `/type-mapping` | Map technicians to specific request types |
| Person Master | `/department-person-master` | View all department-person records |
| Reports | `/reports` | Filterable full request report with CSV/Excel export |

### 🏢 HOD Panel — 1 Page

| Page | URL | Key Features |
|:---|:---|:---|
| HOD Dashboard | `/hod-dashboard` | View dept requests, assign technicians, approve/reject, monitor performance |

### 👤 Employee/Technician Portal — 3 Pages

| Page | URL | Key Features |
|:---|:---|:---|
| Portal Dashboard | `/portal-dashboard` | Submit new request, view own tickets, chat reply thread |
| Request Details | `/request-details/[id]` | Full ticket detail, reply thread, attachments |
| Technician View | `/technician` | Assigned work queue, status updates, replies |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'feat: Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

Please follow conventional commit messages:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `style:` — Formatting
- `refactor:` — Code restructuring

---

<div align="center">

## 📈 Project Stats

| Metric | Count |
|:---|:---:|
| 🗃️ Database Tables | 12 |
| 👥 User Roles | 3 |
| 📄 Admin Pages | 9 |
| 📄 HOD Pages | 1 |
| 📄 Portal Pages | 3 |
| 📡 API Route Groups | 14 |
| 🔐 Auth Method | JWT HTTP-only Cookie |
| ⏱️ Token Expiry | 24 Hours |

---

### Built with ❤️ by [Monil Kansagra](https://github.com/Monilkansagra)

⭐ **Star this repo** if ServiceOS helped or inspired you!

[![GitHub](https://img.shields.io/badge/GitHub-Monilkansagra-181717?style=for-the-badge&logo=github)](https://github.com/Monilkansagra)

---

*ServiceOS — Because every service request deserves a system worthy of it.*

</div>
