# Database Plan — Amin670BD Agency CRM

> **Platform:** PostgreSQL 15+ (via Supabase)  
> **Extensions:** pgcrypto, uuid-ossp, pg_stat_statements, timescaledb (optional)  
> **JSON Support:** JSONB columns, JSONB path queries, GIN indexes  
> **Format:** Full SQL schema with relations, keys, views, analytics, RLS

---

## Table of Contents

1. [Database Setup & Extensions](#1-database-setup--extensions)
2. [Auth Tables (Supabase Managed)](#2-auth-tables-supabase-managed)
3. [Portfolio & Public Data](#3-portfolio--public-data)
4. [CRM Tables](#4-crm-tables)
5. [E-Commerce Tables](#5-e-commerce-tables)
6. [Financial Tables](#6-financial-tables)
7. [Communication Tables](#7-communication-tables)
8. [File & Media Tables](#8-file--media-tables)
9. [System Tables](#9-system-tables)
10. [Views & Materialized Views](#10-views--materialized-views)
11. [Analytics Functions](#11-analytics-functions)
12. [RLS Policies](#12-rls-policies)
13. [Triggers & Automation](#13-triggers--automation)
14. [Indexes & Performance](#14-indexes--performance)
15. [Seed Data (Portfolio Migration)](#15-seed-data-portfolio-migration)

---

## 1. Database Setup & Extensions

```sql
-- ============================================================
-- DATABASE SETUP
-- ============================================================

-- Create database (run via Supabase dashboard — already exists)
-- CREATE DATABASE amin670bd_agency;

-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";        -- encrypt/sign functions
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- query performance
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- fuzzy text search (trigram)

-- Optional: for time-series analytics
-- CREATE EXTENSION IF NOT EXISTS "timescaledb";

-- Optional: for full-text search on portfolio
CREATE EXTENSION IF NOT EXISTS "unaccent";        -- accent-insensitive search

-- ============================================================
-- SCHEMA ORGANIZATION
-- ============================================================

-- Public schema is default. We use it for everything.
-- In larger deployments, consider:
--   auth      → Supabase managed (already exists)
--   api       → exposed via PostgREST
--   internal  → functions only
--   audit     → audit logs
```

---

## 2. Auth Tables (Supabase Managed)

Supabase manages these tables automatically in the `auth` schema:

```sql
-- Supabase auth schema (managed — do not modify directly)
--   auth.users           → All registered users (admin + clients)
--   auth.identities      → OAuth provider links
--   auth.sessions        → Active sessions
--   auth.mfa_factors     → MFA devices
--   auth.mfa_challenges  → MFA challenges

-- Key columns on auth.users we reference:
--   id              UUID PRIMARY KEY
--   email           TEXT UNIQUE
--   phone           TEXT
--   raw_user_meta_data   JSONB  → { role: 'admin'|'client', name: '...' }
--   raw_app_meta_data    JSONB  → { provider: 'email', ... }
--   created_at      TIMESTAMPTZ

-- Custom user_metadata structure:
--   admin:  { "role": "admin", "name": "Md. Asaduzzaman" }
--   client: { "role": "client", "name": "Client Name", "client_id": "uuid" }
```

---

## 3. Portfolio & Public Data

These tables store the existing static website data, making it dynamic and manageable via the dashboard.

### 3.1 personal_info — CV / Profile

```sql
CREATE TABLE personal_info (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       TEXT NOT NULL,
    nickname        TEXT,
    title           TEXT NOT NULL,           -- "IT & Digital Operations Specialist"
    phone           TEXT[] DEFAULT '{}',     -- ["+880 1979 670601", "+880 1719 670601"]
    email           TEXT[] DEFAULT '{}',     -- ["amin670bd@gmail.com", "amin670job@gmail.com"]
    location        TEXT,
    linkedin        TEXT,
    website         TEXT,
    photo_url       TEXT,
    dob             DATE,
    blood_group     TEXT,
    religion        TEXT,
    current_salary  TEXT,
    expected_salary TEXT,
    availability    TEXT DEFAULT 'Immediately',
    objective       TEXT,
    summary         TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Only one active profile row
CREATE UNIQUE INDEX idx_personal_info_active ON personal_info(is_active) WHERE is_active = true;
```

### 3.2 site_stats — Hero Statistics

```sql
CREATE TABLE site_stats (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value       TEXT NOT NULL,           -- "15+", "60%", "100+"
    label       TEXT NOT NULL,           -- "Sites Built", "Efficiency Boost", "Users Managed"
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 3.3 skill_categories — Skills with Sub-Items

```sql
CREATE TABLE skill_categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,           -- "Office & Productivity"
    icon        TEXT,                    -- Material icon name: "description"
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE skill_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,       -- "MS Office (Word, Excel, PowerPoint, Outlook)"
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_skill_items_category ON skill_items(category_id);
```

### 3.4 work_experience — Employment History

```sql
CREATE TABLE work_experience (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,           -- "Sr. Officer (In-Charge, Barcode)"
    company         TEXT NOT NULL,           -- "Dhaka Thai ALCOMAXX PLC"
    location        TEXT,
    period_start    DATE,
    period_end      DATE,                   -- NULL = current
    is_current      BOOLEAN DEFAULT false,
    highlights      JSONB DEFAULT '[]',     -- ["Lead barcode operations...", ...]
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_work_experience_dates ON work_experience(period_start DESC);
```

### 3.5 education — Academic Background

```sql
CREATE TABLE education (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree          TEXT NOT NULL,           -- "Diploma in Computer Engineering"
    school          TEXT NOT NULL,           -- "Bogura Polytechnic Institute"
    location        TEXT,
    year            TEXT,                    -- "2018"
    grade           TEXT,                    -- "CGPA: 2.92 / 4.00"
    grade_value     NUMERIC(4,2),           -- 2.92
    grade_max       NUMERIC(4,2),           -- 4.00
    icon            TEXT,
    skills          TEXT[] DEFAULT '{}',     -- ["C Programming", "Python", ...]
    achievements    JSONB DEFAULT '[]',     -- [{text: "...", award: true/false}]
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 3.6 certifications — Training & Certifications

```sql
CREATE TABLE certifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,           -- "Web Design & Development"
    institution     TEXT NOT NULL,           -- "Bangladesh IT Institute, Dhaka"
    topics          TEXT[] DEFAULT '{}',     -- ["WordPress", "PHP", ...]
    year            TEXT,
    duration        TEXT,                    -- "3 months"
    icon            TEXT,
    sort_order      INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 3.7 achievement_categories — Achievements

```sql
CREATE TABLE achievement_categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,           -- "Technical Impact"
    icon        TEXT,                    -- "rocket_launch"
    color       TEXT,                    -- CSS color var
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE achievement_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES achievement_categories(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    description     TEXT,
    is_award        BOOLEAN DEFAULT false,
    date            DATE,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_achievement_items_category ON achievement_items(category_id);
```

### 3.8 languages — Spoken Languages

```sql
CREATE TABLE languages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,           -- "Bangla", "English"
    level       TEXT NOT NULL,           -- "Native", "Fluent", "Intermediate"
    proficiency INTEGER DEFAULT 50,     -- 0-100 percentage
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 3.9 references — Professional References

```sql
CREATE TABLE references_list (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    title       TEXT,
    company     TEXT,
    phone       TEXT,
    email       TEXT,
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 3.10 portfolio_projects — Project Portfolio (from projects.json)

```sql
CREATE TABLE portfolio_categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,           -- "Software Development", "Web & E-Commerce"
    key         TEXT UNIQUE NOT NULL,    -- "software", "web"
    icon        TEXT,                    -- "laptop_mac", "language"
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE portfolio_projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES portfolio_categories(id),
    title           TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL, -- URL-friendly: "weight-checker"
    tech            TEXT,                 -- "C#.NET, Serial Port, ERP Automation"
    description     TEXT,
    url             TEXT,                 -- Live URL if applicable
    date            DATE,
    images          TEXT[] DEFAULT '{}',  -- ["assets/images/projects/..."]
    is_featured     BOOLEAN DEFAULT false,
    is_active       BOOLEAN DEFAULT true,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Detailed project content (for Weight Checker etc.)
CREATE TABLE portfolio_project_details (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID UNIQUE NOT NULL REFERENCES portfolio_projects(id) ON DELETE CASCADE,
    subtitle        TEXT,
    company         TEXT,
    developer       TEXT,
    tech_stack      TEXT[] DEFAULT '{}',
    metrics         JSONB DEFAULT '[]',  -- [{value: "70%", label: "Reduced..."}]
    abstract        TEXT,
    flow_steps      JSONB DEFAULT '[]',  -- [{icon, title, text}]
    details         TEXT[] DEFAULT '{}',
    date            DATE,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_portfolio_projects_category ON portfolio_projects(category_id);
CREATE INDEX idx_portfolio_projects_featured ON portfolio_projects(is_featured) WHERE is_featured = true;
CREATE INDEX idx_portfolio_projects_slug ON portfolio_projects(slug);
```

### 3.11 multimedia — Multimedia Works (from multimedia.json)

```sql
CREATE TABLE multimedia_categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,           -- "Creative Services", "Graphics & Design"
    key         TEXT UNIQUE NOT NULL,    -- "creative", "design"
    icon        TEXT,                    -- "auto_awesome", "palette"
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE multimedia_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES multimedia_categories(id),
    title           TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT,
    date            DATE,
    media_type      TEXT,                 -- "video", "image", "audio", "document"
    media_url       TEXT,                 -- YouTube URL, image URL, etc.
    thumbnail_url   TEXT,
    tags            TEXT[] DEFAULT '{}',
    is_active       BOOLEAN DEFAULT true,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_multimedia_items_category ON multimedia_items(category_id);
CREATE INDEX idx_multimedia_items_date ON multimedia_items(date DESC);
CREATE INDEX idx_multimedia_items_tags ON multimedia_items USING GIN(tags);

-- YouTube / Channel config (single row)
CREATE TABLE media_channels (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_url     TEXT NOT NULL,
    channel_handle  TEXT,
    channel_name    TEXT,
    channel_avatar  TEXT,
    description     TEXT,
    playlist_id     TEXT,
    playlist_title  TEXT,
    featured_video_id TEXT,
    links           JSONB DEFAULT '[]',  -- [{title: "YouTube Channel", url: "...", icon: "..."}]
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
```

### 3.12 menu_items — Navigation

```sql
CREATE TABLE menu_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path        TEXT NOT NULL,           -- "/", "/about", "/projects"
    label       TEXT NOT NULL,           -- "Home", "About", "Projects"
    icon        TEXT,                    -- "home", "person"
    parent_id   UUID REFERENCES menu_items(id),
    sort_order  INTEGER DEFAULT 0,
    is_visible  BOOLEAN DEFAULT true,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 3.13 blog_posts — Future Blog

```sql
CREATE TABLE blog_posts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    excerpt         TEXT,
    content         TEXT,                  -- Markdown or HTML
    featured_image  TEXT,
    tags            TEXT[] DEFAULT '{}',
    status          TEXT DEFAULT 'draft',  -- 'draft', 'published', 'archived'
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Full-text search support
ALTER TABLE blog_posts ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))) STORED;

CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);
```

### 3.14 contact_messages — Contact Form

```sql
CREATE TABLE contact_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    subject     TEXT,
    message     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT false,
    read_at     TIMESTAMPTZ,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contact_messages_read ON contact_messages(is_read, created_at DESC);
```

---

## 4. CRM Tables

### 4.1 clients — Core Client Records

```sql
CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    phone           TEXT,
    company         TEXT,
    website         TEXT,
    address         TEXT,
    notes           TEXT,                    -- Internal notes (encrypted via pgcrypto)
    status          TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'active', 'archived')),
    auth_user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    source          TEXT DEFAULT 'manual' CHECK (source IN ('contact_form', 'store', 'referral', 'manual')),
    total_spent     NUMERIC(12,2) DEFAULT 0,
    metadata        JSONB DEFAULT '{}',     -- Custom fields, preferences
    created_by      UUID REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_auth ON clients(auth_user_id);
CREATE INDEX idx_clients_metadata ON clients USING GIN(metadata);
```

### 4.2 leads — Lead Management

```sql
CREATE TABLE leads (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    TEXT NOT NULL,
    email                   TEXT,
    phone                   TEXT,
    company                 TEXT,
    source                  TEXT DEFAULT 'website' CHECK (source IN ('website', 'referral', 'freelance_platform', 'cold', 'contact_form')),
    status                  TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')),
    notes                   TEXT,
    next_follow_up          TIMESTAMPTZ,
    converted_to_client_id  UUID REFERENCES clients(id) ON DELETE SET NULL,
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_followup ON leads(next_follow_up) WHERE next_follow_up IS NOT NULL;
```

### 4.3 projects — Client Projects (CRM, not portfolio)

```sql
CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'review', 'completed', 'cancelled')),
    type            TEXT DEFAULT 'fixed_price' CHECK (type IN ('fixed_price', 'hourly_retainer', 'ongoing')),
    budget          NUMERIC(12,2),
    hourly_rate     NUMERIC(10,2),
    start_date      DATE,
    deadline        DATE,
    completed_at    TIMESTAMPTZ,
    contract_id     UUID REFERENCES contracts(id) ON DELETE SET NULL,
    tags            TEXT[] DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
```

### 4.4 project_milestones — Milestones / Phases

```sql
CREATE TABLE project_milestones (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    amount          NUMERIC(12,2),
    due_date        DATE,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'paid')),
    completed_at    TIMESTAMPTZ,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_milestones_project ON project_milestones(project_id);
```

### 4.5 tasks — Task Management

```sql
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id    UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    assignee_id     UUID REFERENCES auth.users(id),
    title           TEXT NOT NULL,
    description     TEXT,
    status          TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority        TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    estimated_hours NUMERIC(8,2),
    logged_hours    NUMERIC(8,2) DEFAULT 0,
    due_date        DATE,
    completed_at    TIMESTAMPTZ,
    sort_order      INTEGER DEFAULT 0,
    tags            TEXT[] DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_due ON tasks(due_date) WHERE status != 'done';
```

### 4.6 time_entries — Time Tracking

```sql
CREATE TABLE time_entries (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id     UUID REFERENCES tasks(id) ON DELETE SET NULL,
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT,
    duration    INTEGER,                 -- Duration in seconds
    start_time  TIMESTAMPTZ,
    end_time    TIMESTAMPTZ,
    billable    BOOLEAN DEFAULT true,
    invoiced    BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_task ON time_entries(task_id);
CREATE INDEX idx_time_entries_date ON time_entries(start_time DESC);
```

### 4.7 contracts — Legal Agreements

```sql
CREATE TABLE contract_templates (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,           -- Template with {{variable}} placeholders
    variables   TEXT[] DEFAULT '{}',     -- ["client_name", "project_name", "budget"]
    category    TEXT,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contracts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id          UUID REFERENCES projects(id) ON DELETE SET NULL,
    template_id         UUID REFERENCES contract_templates(id) ON DELETE SET NULL,
    title               TEXT NOT NULL,
    content             TEXT NOT NULL,       -- Rendered HTML/Markdown
    status              TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'expired', 'cancelled')),
    file_url            TEXT,                -- PDF in Supabase Storage
    valid_from          DATE,
    valid_until         DATE,
    signed_by_client_at TIMESTAMPTZ,
    signed_by_me_at     TIMESTAMPTZ,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contracts_client ON contracts(client_id);
CREATE INDEX idx_contracts_status ON contracts(status);
```

### 4.8 tags — Universal Tagging

```sql
CREATE TABLE tags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT UNIQUE NOT NULL,
    color       TEXT,                    -- Hex color
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Polymorphic tagging (used by projects, tasks, clients, etc.)
CREATE TABLE taggables (
    tag_id      UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    taggable_id UUID NOT NULL,
    taggable_type TEXT NOT NULL,          -- 'project', 'task', 'client', 'invoice'
    PRIMARY KEY (tag_id, taggable_id, taggable_type)
);

CREATE INDEX idx_taggables ON taggables(taggable_id, taggable_type);
```

---

## 5. E-Commerce Tables

### 5.1 products — Services & Products for Storefront

```sql
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT,
    category        TEXT,                 -- General category
    icon            TEXT,                 -- Material icon name
    price           NUMERIC(10,2) NOT NULL,
    cost            NUMERIC(10,2),        -- Cost price (profit calc)
    delivery_time   TEXT,                 -- "3-5 days"
    type            TEXT DEFAULT 'service' CHECK (type IN ('service', 'digital_product', 'physical_product', 'retainer')),
    is_active       BOOLEAN DEFAULT true,
    sort_order      INTEGER DEFAULT 0,
    features        JSONB DEFAULT '[]',  -- ["Feature 1", "Feature 2"]
    images          TEXT[] DEFAULT '{}',
    metadata        JSONB DEFAULT '{}',  -- Custom fields per product type
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_active ON products(is_active, sort_order);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);
```

### 5.2 orders — Client Orders

```sql
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number    TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6)),
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled')),
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax             NUMERIC(12,2) DEFAULT 0,
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    notes           TEXT,                 -- Client-facing
    internal_notes  TEXT,
    payment_status  TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
    stripe_session_id TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Order items (snapshot of product at purchase time)
CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity        NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price      NUMERIC(10,2) NOT NULL,
    total           NUMERIC(12,2) NOT NULL,
    description     TEXT,                 -- Snapshot of product title/desc
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

---

## 6. Financial Tables

### 6.1 invoices — Billing

```sql
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number  TEXT UNIQUE NOT NULL DEFAULT 'INV-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6)),
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,
    status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded')),
    issue_date      DATE DEFAULT CURRENT_DATE,
    due_date        DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    paid_at         TIMESTAMPTZ,
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_rate        NUMERIC(5,2) DEFAULT 0,
    tax_amount      NUMERIC(12,2) DEFAULT 0,
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    notes           TEXT,
    terms           TEXT DEFAULT 'Net 30',
    is_recurring    BOOLEAN DEFAULT false,
    recurrence_rule JSONB,               -- {frequency: 'monthly', interval: 1, next_date: ...}
    stripe_invoice_id TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due ON invoices(due_date) WHERE status IN ('sent', 'overdue');
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

CREATE TABLE invoice_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description     TEXT NOT NULL,
    quantity        NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price      NUMERIC(10,2) NOT NULL,
    total           NUMERIC(12,2) NOT NULL,
    source_type     TEXT CHECK (source_type IN ('time_entry', 'expense', 'product', 'manual')),
    source_id       UUID,                -- Polymorphic reference
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
```

### 6.2 payments — Payment Records

```sql
CREATE TABLE payments (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id              UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    client_id               UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    amount                  NUMERIC(12,2) NOT NULL,
    method                  TEXT DEFAULT 'stripe' CHECK (method IN ('stripe', 'bank_transfer', 'cash', 'paypal', 'bkash', 'other')),
    stripe_payment_intent_id TEXT,
    stripe_charge_id        TEXT,
    status                  TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date            TIMESTAMPTZ DEFAULT now(),
    notes                   TEXT,
    metadata                JSONB DEFAULT '{}',
    created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_date ON payments(payment_date DESC);
CREATE INDEX idx_payments_stripe ON payments(stripe_payment_intent_id);
```

### 6.3 expenses — Business Expenses

```sql
CREATE TABLE expenses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    client_id       UUID REFERENCES clients(id) ON DELETE SET NULL,
    category        TEXT NOT NULL CHECK (category IN ('software', 'travel', 'office', 'subcontractor', 'hosting', 'other')),
    amount          NUMERIC(10,2) NOT NULL,
    tax             NUMERIC(10,2) DEFAULT 0,
    receipt_url     TEXT,                -- Supabase Storage URL
    description     TEXT,
    date            DATE DEFAULT CURRENT_DATE,
    billable        BOOLEAN DEFAULT false,
    reimbursed      BOOLEAN DEFAULT false,
    invoiced        BOOLEAN DEFAULT false,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date DESC);
```

---

## 7. Communication Tables

### 7.1 messages — Client Communication

```sql
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,
    subject         TEXT NOT NULL,
    body            TEXT NOT NULL,           -- Markdown content
    direction       TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    sender_type     TEXT NOT NULL CHECK (sender_type IN ('admin', 'client')),
    is_read         BOOLEAN DEFAULT false,
    read_at         TIMESTAMPTZ,
    reply_to_id     UUID REFERENCES messages(id) ON DELETE SET NULL,
    attachments     JSONB DEFAULT '[]',     -- [{name, url, size}]
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_client ON messages(client_id, created_at DESC);
CREATE INDEX idx_messages_thread ON messages(reply_to_id);
CREATE INDEX idx_messages_unread ON messages(client_id, is_read) WHERE is_read = false;
```

### 7.2 email_templates — Email Templates

```sql
CREATE TABLE email_templates (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    subject     TEXT NOT NULL,
    body        TEXT NOT NULL,              -- HTML with {{variables}}
    category    TEXT CHECK (category IN ('invoice', 'proposal', 'welcome', 'reminder', 'newsletter', 'contract')),
    variables   TEXT[] DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### 7.3 subscribers — Newsletter Subscribers

```sql
CREATE TABLE subscribers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT UNIQUE NOT NULL,
    name            TEXT,
    source          TEXT DEFAULT 'website' CHECK (source IN ('contact_form', 'store', 'manual', 'website')),
    status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'spam')),
    metadata        JSONB DEFAULT '{}',    -- Tags, preferences, custom fields
    subscribed_at   TIMESTAMPTZ DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscribers_status ON subscribers(status);

-- Campaigns / Newsletters
CREATE TABLE campaigns (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    subject         TEXT NOT NULL,
    body            TEXT NOT NULL,          -- HTML content
    status          TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
    scheduled_at    TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    metadata        JSONB DEFAULT '{}',    -- Segment filters, stats
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE campaign_recipients (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    subscriber_id   UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    sent_at         TIMESTAMPTZ,
    opened_at       TIMESTAMPTZ,
    clicked_at      TIMESTAMPTZ,
    metadata        JSONB DEFAULT '{}',    -- User agent, IP, link clicked
    UNIQUE(campaign_id, subscriber_id)
);

CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
```

---

## 8. File & Media Tables

### 8.1 appointments — Calendar

```sql
CREATE TABLE appointments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id  UUID REFERENCES projects(id) ON DELETE SET NULL,
    title       TEXT NOT NULL,
    description TEXT,
    start_time  TIMESTAMPTZ NOT NULL,
    end_time    TIMESTAMPTZ NOT NULL,
    all_day     BOOLEAN DEFAULT false,
    status      TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    location    TEXT,                   -- URL (Google Meet, Zoom) or physical address
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_range ON appointments(start_time, end_time);
CREATE INDEX idx_appointments_status ON appointments(status);
```

### 8.2 files — Universal File Manager

```sql
CREATE TABLE files (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path    TEXT NOT NULL,           -- Supabase Storage path
    original_name   TEXT NOT NULL,
    mime_type       TEXT NOT NULL,
    size_bytes      BIGINT NOT NULL,
    bucket          TEXT NOT NULL,           -- 'client-files', 'invoices', 'projects', 'public'
    attachable_type TEXT NOT NULL,           -- 'project', 'task', 'invoice', 'message', 'client'
    attachable_id   UUID NOT NULL,
    uploaded_by     UUID REFERENCES auth.users(id),
    is_public       BOOLEAN DEFAULT false,
    metadata        JSONB DEFAULT '{}',     -- Image dimensions, duration, etc.
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_files_attachable ON files(attachable_type, attachable_id);
CREATE INDEX idx_files_bucket ON files(bucket);
CREATE INDEX idx_files_uploader ON files(uploaded_by);
```

---

## 9. System Tables

### 9.1 activity_log — Immutable Audit Trail

```sql
CREATE TABLE activity_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id    UUID REFERENCES auth.users(id),
    actor_type  TEXT NOT NULL CHECK (actor_type IN ('admin', 'client', 'system')),
    action      TEXT NOT NULL,           -- 'created', 'updated', 'deleted', 'status_changed', 'paid', 'login', 'logout'
    entity_type TEXT NOT NULL,           -- 'client', 'project', 'invoice', 'order', 'payment', 'message', 'settings'
    entity_id   UUID,
    metadata    JSONB NOT NULL DEFAULT '{}', -- {old_values, new_values, ip, user_agent}
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
) WITH (fillfactor = 70);

-- INSERT-only policy (no UPDATE, no DELETE allowed)
-- Partition by month for large datasets (optional)
-- CREATE TABLE activity_log_2026_01 PARTITION OF activity_log FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_actor ON activity_log(actor_id);
CREATE INDEX idx_activity_log_action ON activity_log(action);
CREATE INDEX idx_activity_log_created ON activity_log(created_at DESC);
-- GIN index on metadata for JSONB queries
CREATE INDEX idx_activity_log_metadata ON activity_log USING GIN(metadata jsonb_path_ops);
```

### 9.2 notifications — In-App Notifications

```sql
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type        TEXT NOT NULL CHECK (type IN ('email', 'in_app', 'sms')),
    recipient   TEXT NOT NULL,           -- Admin email or client_id
    title       TEXT NOT NULL,
    body        TEXT,
    link        TEXT,                    -- Deep link to relevant page
    is_read     BOOLEAN DEFAULT false,
    read_at     TIMESTAMPTZ,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient, is_read, created_at DESC);
```

### 9.3 settings — Application Settings

```sql
CREATE TABLE settings (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key         TEXT UNIQUE NOT NULL,
    value       JSONB NOT NULL,
    category    TEXT DEFAULT 'general' CHECK (category IN ('general', 'invoice', 'email', 'booking', 'payment', 'seo', 'social')),
    description TEXT,
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Seed default settings
INSERT INTO settings (key, value, category, description) VALUES
    ('site_name', '"Amin670BD"', 'general', 'Site title'),
    ('site_description', '"IT & Digital Operations Specialist"', 'general', 'Meta description'),
    ('invoice_prefix', '"INV-"', 'invoice', 'Invoice number prefix'),
    ('invoice_default_terms', '"Net 30"', 'invoice', 'Default payment terms'),
    ('invoice_tax_rate', '0', 'invoice', 'Default tax rate percentage'),
    ('currency', '"BDT"', 'payment', 'Default currency'),
    ('email_from_name', '"Md. Asaduzzaman"', 'email', 'Sender name for emails'),
    ('email_from_address', '"noreply@amin670bd.com"', 'email', 'Sender email address'),
    ('booking_enabled', 'false', 'booking', 'Enable appointment booking'),
    ('social_linkedin', '"https://linkedin.com/in/aminur670bd"', 'social', 'LinkedIn profile URL'),
    ('social_youtube', '"https://youtube.com/@aminur670"', 'social', 'YouTube channel URL'),
    ('social_github', '"https://github.com/amin670bd"', 'social', 'GitHub profile URL');
```

### 9.4 api_logs — API Request Logging

```sql
CREATE TABLE api_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    method      TEXT NOT NULL,
    path        TEXT NOT NULL,
    status_code INTEGER,
    ip_address  TEXT,
    user_id     UUID REFERENCES auth.users(id),
    duration_ms INTEGER,
    user_agent  TEXT,
    request_body JSONB,                 -- Only for POST/PUT (sanitized, no secrets)
    response_body JSONB,                -- Truncated if large
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_api_logs_path ON api_logs(path);
CREATE INDEX idx_api_logs_status ON api_logs(status_code);
CREATE INDEX idx_api_logs_created ON api_logs(created_at DESC);
-- Auto-cleanup after 90 days (via cron or pg_cron)
```

---

## 10. Views & Materialized Views

### 10.1 dashboard_financial_summary — Revenue Overview

```sql
CREATE VIEW dashboard_financial_summary AS
SELECT
    COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS total_revenue,
    COALESCE(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) AS pending_revenue,
    COALESCE(SUM(CASE WHEN i.status IN ('sent', 'overdue') THEN i.total ELSE 0 END), 0) AS outstanding_invoices,
    COALESCE(SUM(CASE WHEN i.status = 'overdue' THEN i.total ELSE 0 END), 0) AS overdue_amount,
    COUNT(DISTINCT CASE WHEN i.status IN ('sent', 'overdue') THEN i.id END) AS unpaid_invoice_count,
    COUNT(DISTINCT CASE WHEN i.status = 'overdue' THEN i.id END) AS overdue_invoice_count
FROM payments p
FULL JOIN invoices i ON i.id = p.invoice_id;
```

### 10.2 view_monthly_revenue — Monthly Revenue Trend

```sql
CREATE VIEW view_monthly_revenue AS
SELECT
    DATE_TRUNC('month', p.payment_date)::DATE AS month,
    COUNT(DISTINCT p.id) AS payment_count,
    COUNT(DISTINCT p.client_id) AS paying_clients,
    SUM(p.amount) AS revenue,
    SUM(SUM(p.amount)) OVER (ORDER BY DATE_TRUNC('month', p.payment_date)) AS cumulative_revenue
FROM payments p
WHERE p.status = 'completed'
GROUP BY DATE_TRUNC('month', p.payment_date)
ORDER BY month DESC;
```

### 10.3 view_client_summary — Client Overview

```sql
CREATE VIEW view_client_summary AS
SELECT
    c.id,
    c.name,
    c.email,
    c.company,
    c.status,
    c.total_spent,
    c.source,
    c.created_at,
    COUNT(DISTINCT p.id) AS project_count,
    COUNT(DISTINCT CASE WHEN p.status IN ('active', 'review') THEN p.id END) AS active_projects,
    COUNT(DISTINCT i.id) AS invoice_count,
    COUNT(DISTINCT CASE WHEN i.status IN ('sent', 'overdue') THEN i.id END) AS unpaid_invoices,
    COALESCE(SUM(CASE WHEN i.status IN ('sent', 'overdue') THEN i.total ELSE 0 END), 0) AS outstanding_amount,
    COUNT(DISTINCT m.id) AS message_count,
    COUNT(DISTINCT CASE WHEN m.direction = 'inbound' AND NOT m.is_read THEN m.id END) AS unread_messages,
    COUNT(DISTINCT f.id) AS file_count,
    MAX(pj.created_at) AS last_project_date,
    MAX(m.created_at) AS last_message_date
FROM clients c
LEFT JOIN projects p ON p.client_id = c.id
LEFT JOIN invoices i ON i.client_id = c.id
LEFT JOIN messages m ON m.client_id = c.id
LEFT JOIN files f ON f.attachable_id = c.id AND f.attachable_type = 'client'
LEFT JOIN payments pj ON pj.client_id = c.id
GROUP BY c.id, c.name, c.email, c.company, c.status, c.total_spent, c.source, c.created_at;
```

### 10.4 view_project_status — Project Pipeline

```sql
CREATE VIEW view_project_status AS
SELECT
    p.status,
    COUNT(*) AS project_count,
    COALESCE(SUM(p.budget), 0) AS total_budget,
    COUNT(DISTINCT p.client_id) AS client_count,
    COUNT(t.id) AS total_tasks,
    COUNT(CASE WHEN t.status = 'done' THEN 1 END) AS completed_tasks,
    CASE WHEN COUNT(t.id) > 0
        THEN ROUND(100.0 * COUNT(CASE WHEN t.status = 'done' THEN 1 END) / COUNT(t.id), 1)
        ELSE 0
    END AS completion_pct
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
GROUP BY p.status
ORDER BY p.status;
```

### 10.5 view_portfolio_summary — Website Portfolio Stats

```sql
CREATE VIEW view_portfolio_summary AS
SELECT
    (SELECT COUNT(*) FROM portfolio_projects WHERE is_active = true) AS total_projects,
    (SELECT COUNT(*) FROM portfolio_categories WHERE is_active = true) AS project_categories,
    (SELECT COUNT(*) FROM multimedia_items WHERE is_active = true) AS multimedia_items,
    (SELECT COUNT(*) FROM multimedia_categories WHERE is_active = true) AS multimedia_categories,
    (SELECT COUNT(*) FROM work_experience WHERE is_active = true) AS work_experiences,
    (SELECT COUNT(*) FROM skill_items) AS total_skills,
    (SELECT COUNT(*) FROM skill_categories) AS skill_categories,
    (SELECT COUNT(*) FROM certifications) AS certifications,
    (SELECT COUNT(*) FROM contact_messages) AS contact_messages,
    (SELECT COUNT(*) FROM blog_posts WHERE status = 'published') AS blog_posts;
```

### 10.6 view_multimedia_by_year_month — Multimedia Filtered View

```sql
CREATE VIEW view_multimedia_by_year_month AS
SELECT
    mc.name AS category_name,
    mc.key AS category_key,
    mc.icon AS category_icon,
    mi.id,
    mi.title,
    mi.slug,
    mi.description,
    mi.date,
    mi.media_type,
    mi.media_url,
    mi.thumbnail_url,
    mi.tags,
    EXTRACT(YEAR FROM mi.date)::INTEGER AS year,
    EXTRACT(MONTH FROM mi.date)::INTEGER AS month,
    TO_CHAR(mi.date, 'Month') AS month_name
FROM multimedia_items mi
JOIN multimedia_categories mc ON mc.id = mi.category_id
WHERE mi.is_active = true
ORDER BY mi.date DESC;
```

### 10.7 view_upcoming_appointments — Calendar View

```sql
CREATE VIEW view_upcoming_appointments AS
SELECT
    a.id,
    a.title,
    a.description,
    a.start_time,
    a.end_time,
    a.all_day,
    a.status,
    a.location,
    c.id AS client_id,
    c.name AS client_name,
    c.email AS client_email,
    p.id AS project_id,
    p.name AS project_name
FROM appointments a
LEFT JOIN clients c ON c.id = a.client_id
LEFT JOIN projects p ON p.id = a.project_id
WHERE a.start_time >= now()
ORDER BY a.start_time;
```

### 10.8 Materialized: mv_monthly_financials — (refreshed daily)

```sql
CREATE MATERIALIZED VIEW mv_monthly_financials AS
SELECT
    DATE_TRUNC('month', p.payment_date)::DATE AS month,
    COUNT(DISTINCT p.id) AS transactions,
    COUNT(DISTINCT p.client_id) AS clients_billed,
    SUM(p.amount) AS revenue,
    COALESCE(SUM(e.amount), 0) AS expenses,
    SUM(p.amount) - COALESCE(SUM(e.amount), 0) AS profit,
    ROUND(
        CASE WHEN SUM(p.amount) > 0
        THEN (SUM(p.amount) - COALESCE(SUM(e.amount), 0)) / SUM(p.amount) * 100
        ELSE 0 END, 1
    ) AS profit_margin_pct
FROM payments p
LEFT JOIN expenses e ON DATE_TRUNC('month', e.date) = DATE_TRUNC('month', p.payment_date)
WHERE p.status = 'completed'
GROUP BY DATE_TRUNC('month', p.payment_date)
ORDER BY month DESC
WITH DATA;

-- Refresh daily via pg_cron or Supabase Edge Function
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_financials;

CREATE UNIQUE INDEX idx_mv_monthly_financials ON mv_monthly_financials(month);
```

---

## 11. Analytics Functions

### 11.1 fn_client_acquisition — Client Acquisition Stats

```sql
CREATE OR REPLACE FUNCTION fn_client_acquisition(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '1 year',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    period TEXT,
    new_leads BIGINT,
    converted_clients BIGINT,
    lost_leads BIGINT,
    total_clients BIGINT,
    conversion_rate NUMERIC(5,1)
) LANGUAGE SQL STABLE AS $$
    SELECT
        TO_CHAR(date_trunc('month', created_at), 'YYYY-MM') AS period,
        COUNT(*) FILTER (WHERE source IS NOT NULL) AS new_leads,
        COUNT(*) FILTER (WHERE converted_to_client_id IS NOT NULL) AS converted_clients,
        COUNT(*) FILTER (WHERE status = 'lost') AS lost_leads,
        (SELECT COUNT(*) FROM clients WHERE created_at BETWEEN start_date AND end_date) AS total_clients,
        ROUND(
            100.0 * COUNT(*) FILTER (WHERE converted_to_client_id IS NOT NULL)
            / NULLIF(COUNT(*), 0), 1
        ) AS conversion_rate
    FROM leads
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at);
$$;
```

### 11.2 fn_portfolio_search — Full-Text Portfolio Search

```sql
CREATE OR REPLACE FUNCTION fn_portfolio_search(search_query TEXT)
RETURNS TABLE(
    result_type TEXT,
    id UUID,
    title TEXT,
    slug TEXT,
    description TEXT,
    relevance NUMERIC
) LANGUAGE SQL STABLE AS $$
    -- Search projects
    SELECT 'project' AS result_type, pp.id, pp.title, pp.slug, pp.description,
           ts_rank(to_tsvector('english', pp.title || ' ' || COALESCE(pp.description, '')), plainto_tsquery('english', search_query)) AS relevance
    FROM portfolio_projects pp
    WHERE to_tsvector('english', pp.title || ' ' || COALESCE(pp.description, '')) @@ plainto_tsquery('english', search_query)
    UNION ALL
    -- Search multimedia
    SELECT 'multimedia', mi.id, mi.title, mi.slug, mi.description,
           ts_rank(to_tsvector('english', mi.title || ' ' || COALESCE(mi.description, '')), plainto_tsquery('english', search_query))
    FROM multimedia_items mi
    WHERE to_tsvector('english', mi.title || ' ' || COALESCE(mi.description, '')) @@ plainto_tsquery('english', search_query)
    UNION ALL
    -- Search blog
    SELECT 'blog', bp.id, bp.title, bp.slug, bp.excerpt,
           ts_rank(bp.search_vector, plainto_tsquery('english', search_query))
    FROM blog_posts bp
    WHERE bp.search_vector @@ plainto_tsquery('english', search_query)
    ORDER BY relevance DESC
    LIMIT 20;
$$;
```

### 11.3 fn_invoice_overdue_stats — Overdue Invoice Summary

```sql
CREATE OR REPLACE FUNCTION fn_invoice_overdue_stats()
RETURNS TABLE(
    total_overdue BIGINT,
    total_overdue_amount NUMERIC(12,2),
    days_range TEXT,
    count BIGINT,
    amount NUMERIC(12,2)
) LANGUAGE SQL STABLE AS $$
    SELECT
        (SELECT COUNT(*) FROM invoices WHERE status = 'overdue') AS total_overdue,
        (SELECT COALESCE(SUM(total), 0) FROM invoices WHERE status = 'overdue') AS total_overdue_amount,
        CASE
            WHEN (CURRENT_DATE - due_date) <= 7 THEN '1-7 days'
            WHEN (CURRENT_DATE - due_date) <= 30 THEN '8-30 days'
            WHEN (CURRENT_DATE - due_date) <= 60 THEN '31-60 days'
            ELSE '60+ days'
        END AS days_range,
        COUNT(*) AS count,
        COALESCE(SUM(total), 0) AS amount
    FROM invoices
    WHERE status = 'overdue'
    GROUP BY
        CASE
            WHEN (CURRENT_DATE - due_date) <= 7 THEN '1-7 days'
            WHEN (CURRENT_DATE - due_date) <= 30 THEN '8-30 days'
            WHEN (CURRENT_DATE - due_date) <= 60 THEN '31-60 days'
            ELSE '60+ days'
        END
    ORDER BY MIN(due_date);
$$;
```

### 11.4 fn_time_tracking_summary — Time Logged per Project

```sql
CREATE OR REPLACE FUNCTION fn_time_tracking_summary(
    project_id UUID DEFAULT NULL
)
RETURNS TABLE(
    project_name TEXT,
    client_name TEXT,
    total_hours NUMERIC(10,2),
    billable_hours NUMERIC(10,2),
    unbilled_hours NUMERIC(10,2),
    estimated_hours NUMERIC(10,2),
    completion_pct NUMERIC(5,1)
) LANGUAGE SQL STABLE AS $$
    SELECT
        p.name AS project_name,
        c.name AS client_name,
        ROUND(COALESCE(SUM(te.duration), 0) / 3600.0, 2) AS total_hours,
        ROUND(COALESCE(SUM(te.duration) FILTER (WHERE te.billable), 0) / 3600.0, 2) AS billable_hours,
        ROUND(COALESCE(SUM(te.duration) FILTER (WHERE te.billable AND NOT te.invoiced), 0) / 3600.0, 2) AS unbilled_hours,
        COALESCE(SUM(t.estimated_hours), 0) AS estimated_hours,
        CASE WHEN SUM(t.estimated_hours) > 0
            THEN ROUND(100.0 * ROUND(COALESCE(SUM(te.duration), 0) / 3600.0, 2) / SUM(t.estimated_hours), 1)
            ELSE 0
        END AS completion_pct
    FROM projects p
    JOIN clients c ON c.id = p.client_id
    LEFT JOIN time_entries te ON te.project_id = p.id
    LEFT JOIN tasks t ON t.project_id = p.id
    WHERE (project_id IS NULL OR p.id = project_id)
    GROUP BY p.id, p.name, c.name
    ORDER BY total_hours DESC;
$$;
```

---

## 12. RLS Policies

### 12.1 Enable RLS on All Tables

```sql
-- Enable RLS on all user-facing tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;

-- Public portfolio tables: public read, admin write
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_project_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE multimedia_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE multimedia_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
```

### 12.2 Admin Policies (Full Access)

```sql
-- Admin sees and edits everything
CREATE POLICY admin_all_access ON clients
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_access ON projects
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_access ON invoices
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Apply to CRM tables...
-- (Repeat pattern for leads, tasks, time_entries, orders, payments,
--  expenses, contracts, messages, appointments, files, notifications,
--  settings, subscribers, campaigns, campaign_recipients, activity_log)

-- Admin full access to public portfolio tables
CREATE POLICY admin_all_portfolio ON portfolio_projects
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_multimedia ON multimedia_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_blog ON blog_posts
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_all_contacts ON contact_messages
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### 12.3 Public Policies (Read-Only)

```sql
-- Public can read portfolio data
CREATE POLICY public_read_portfolio ON portfolio_projects
    FOR SELECT USING (is_active = true);

CREATE POLICY public_read_portfolio_details ON portfolio_project_details
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM portfolio_projects pp WHERE pp.id = project_id AND pp.is_active = true)
    );

CREATE POLICY public_read_multimedia ON multimedia_items
    FOR SELECT USING (is_active = true);

CREATE POLICY public_read_blog ON blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY public_read_personal_info ON personal_info
    FOR SELECT USING (is_active = true);

CREATE POLICY public_read_skills ON skill_categories
    FOR SELECT USING (true);

CREATE POLICY public_read_experience ON work_experience
    FOR SELECT USING (is_active = true);

-- Public can insert into contact_messages (no auth required)
CREATE POLICY public_insert_contact ON contact_messages
    FOR INSERT WITH CHECK (true);
```

### 12.4 Client Policies (Self-Service)

```sql
-- Clients see only their own data
CREATE POLICY client_own_clients ON clients
    FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY client_own_projects ON projects
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    );

CREATE POLICY client_own_milestones ON project_milestones
    FOR SELECT USING (
        project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()))
    );

CREATE POLICY client_own_tasks ON tasks
    FOR SELECT USING (
        project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()))
    );

CREATE POLICY client_own_invoices ON invoices
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    );

CREATE POLICY client_own_messages ON messages
    FOR ALL USING (
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    );

CREATE POLICY client_own_files ON files
    FOR SELECT USING (
        attachable_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    );

CREATE POLICY client_own_appointments ON appointments
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
    );
```

---

## 13. Triggers & Automation

### 13.1 Automatic Timestamps

```sql
-- Apply to all tables with updated_at
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- (Apply to all tables with updated_at column)
```

### 13.2 Invoice Status Automation

```sql
-- Auto-set invoice to 'overdue' when due_date passes and status is 'sent'
CREATE OR REPLACE FUNCTION fn_auto_overdue_invoices()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE invoices
    SET status = 'overdue'
    WHERE status = 'sent'
      AND due_date < CURRENT_DATE
      AND id = NEW.id;
    RETURN NEW;
END;
$$;

-- Cron job (via pg_cron or Supabase Edge Function):
-- Run daily at 9 AM:
-- SELECT cron.schedule('mark-overdue', '0 9 * * *',
--   'UPDATE invoices SET status = ''overdue'' WHERE status = ''sent'' AND due_date < CURRENT_DATE');
```

### 13.3 Client Total Spent Calculation

```sql
-- Recalculate total_spent when a payment is completed
CREATE OR REPLACE FUNCTION fn_update_client_total_spent()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE clients
        SET total_spent = (
            SELECT COALESCE(SUM(p.amount), 0)
            FROM payments p
            WHERE p.client_id = NEW.client_id AND p.status = 'completed'
        )
        WHERE id = NEW.client_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_payment_update_spent AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION fn_update_client_total_spent();
```

### 13.4 Task Logged Hours Calculation

```sql
CREATE OR REPLACE FUNCTION fn_update_task_logged_hours()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE tasks
    SET logged_hours = (
        SELECT COALESCE(SUM(duration), 0) / 3600.0
        FROM time_entries
        WHERE task_id = NEW.task_id
    )
    WHERE id = NEW.task_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_timeentry_update_task AFTER INSERT OR UPDATE OR DELETE ON time_entries
    FOR EACH ROW EXECUTE FUNCTION fn_update_task_logged_hours();
```

### 13.5 Activity Log Trigger (Generic)

```sql
CREATE OR REPLACE FUNCTION fn_audit_log()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_action TEXT;
    v_metadata JSONB := '{}'::JSONB;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_action := 'created';
        v_metadata := jsonb_build_object('new', row_to_json(NEW)::jsonb);
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'updated';
        v_metadata := jsonb_build_object(
            'old', row_to_json(OLD)::jsonb,
            'new', row_to_json(NEW)::jsonb,
            'changed_fields', (
                SELECT jsonb_agg(key) FROM jsonb_each(row_to_json(NEW)::jsonb) j
                WHERE row_to_json(OLD)::jsonb ->> j.key IS DISTINCT FROM j.value
            )
        );
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'deleted';
        v_metadata := jsonb_build_object('old', row_to_json(OLD)::jsonb);
    END IF;

    INSERT INTO activity_log (actor_id, actor_type, action, entity_type, entity_id, metadata)
    VALUES (
        auth.uid(),
        COALESCE(auth.jwt() ->> 'role', 'system'),
        v_action,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        v_metadata
    );

    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply to key tables:
-- CREATE TRIGGER trg_clients_audit AFTER INSERT OR UPDATE OR DELETE ON clients
--     FOR EACH ROW EXECUTE FUNCTION fn_audit_log();
-- CREATE TRIGGER trg_invoices_audit AFTER INSERT OR UPDATE OR DELETE ON invoices
--     FOR EACH ROW EXECUTE FUNCTION fn_audit_log();
```

### 13.6 Auto-Generate Order Number

```sql
CREATE OR REPLACE FUNCTION fn_generate_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.order_number := 'ORD-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(random()::text) FROM 1 FOR 6));
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_number BEFORE INSERT ON orders
    FOR EACH ROW WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION fn_generate_order_number();
```

---

## 14. Indexes & Performance

### 14.1 JSONB Indexes

```sql
-- GIN indexes for JSONB columns used in WHERE/Filter queries
CREATE INDEX idx_clients_metadata ON clients USING GIN(metadata jsonb_path_ops);
CREATE INDEX idx_projects_metadata ON projects USING GIN(metadata jsonb_path_ops);
CREATE INDEX idx_orders_metadata ON orders USING GIN(metadata jsonb_path_ops);
CREATE INDEX idx_invoices_metadata ON invoices USING GIN(metadata jsonb_path_ops);
CREATE INDEX idx_payments_metadata ON payments USING GIN(metadata jsonb_path_ops);
CREATE INDEX idx_messages_metadata ON messages USING GIN(metadata jsonb_path_ops);
CREATE INDEX idx_products_metadata ON products USING GIN(metadata jsonb_path_ops);
CREATE INDEX idx_activity_log_metadata ON activity_log USING GIN(metadata jsonb_path_ops);

-- Settings: JSONB value lookup
CREATE INDEX idx_settings_value ON settings USING GIN(value jsonb_path_ops);
```

### 14.2 Array Indexes

```sql
-- GIN indexes for array columns
CREATE INDEX idx_portfolio_projects_images ON portfolio_projects USING GIN(images);
CREATE INDEX idx_products_images ON products USING GIN(images);
CREATE INDEX idx_multimedia_items_tags ON multimedia_items USING GIN(tags);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);
```

### 14.3 Full-Text Search Indexes

```sql
-- Portfolio search
CREATE INDEX idx_portfolio_projects_search ON portfolio_projects
    USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Multimedia search
CREATE INDEX idx_multimedia_search ON multimedia_items
    USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Client search
CREATE INDEX idx_clients_search ON clients
    USING GIN(to_tsvector('english', name || ' ' || COALESCE(company, '') || ' ' || COALESCE(email, '')));

-- Contact messages search
CREATE INDEX idx_contact_messages_search ON contact_messages
    USING GIN(to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(message, '') || ' ' || COALESCE(subject, '')));
```

### 14.4 Composite Indexes for Common Queries

```sql
-- Dashboard queries
CREATE INDEX idx_invoices_client_status ON invoices(client_id, status);
CREATE INDEX idx_projects_client_status ON projects(client_id, status);
CREATE INDEX idx_payments_client_date ON payments(client_id, payment_date DESC);
CREATE INDEX idx_messages_client_created ON messages(client_id, created_at DESC);

-- Portfolio filtering
CREATE INDEX idx_portfolio_projects_category_sort ON portfolio_projects(category_id, sort_order);
CREATE INDEX idx_multimedia_category_date ON multimedia_items(category_id, date DESC);

-- Overdue invoice monitoring
CREATE INDEX idx_invoices_overdue ON invoices(status, due_date)
    WHERE status IN ('sent', 'overdue');

-- Calendar queries
CREATE INDEX idx_appointments_range ON appointments(start_time, end_time);
CREATE INDEX idx_time_entries_range ON time_entries(start_time, end_time);
```

### 14.5 Partial Indexes for Active Data

```sql
-- Only index active/current records
CREATE INDEX idx_clients_active ON clients(id) WHERE status IN ('active', 'lead');
CREATE INDEX idx_projects_active ON projects(id) WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_orders_active ON orders(id) WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_invoices_unpaid ON invoices(id) WHERE status IN ('sent', 'overdue');
CREATE INDEX idx_tasks_pending ON tasks(id) WHERE status != 'done';
CREATE INDEX idx_subscribers_active ON subscribers(id) WHERE status = 'active';
CREATE INDEX idx_contact_unread ON contact_messages(id) WHERE is_read = false;
```

---

## 15. Seed Data (Portfolio Migration)

### 15.1 Personal Info

```sql
INSERT INTO personal_info (full_name, nickname, title, phone, email, location, linkedin, website,
    dob, blood_group, religion, objective, summary, current_salary, expected_salary)
VALUES (
    'Md. Asaduzzaman', 'Aminur', 'IT & Digital Operations Specialist',
    ARRAY['+880 1979 670601', '+880 1719 670601'],
    ARRAY['amin670bd@gmail.com', 'amin670job@gmail.com'],
    'Ashuliya, Savar, Dhaka, Bangladesh',
    'linkedin.com/in/aminur670bd', 'https://amin670bd.github.io',
    '1997-01-22', 'O+', 'Islam',
    'I offer a unique blend of creative, technical, and support-based services that span across IT support, ERP operations, digital systems, and administrative workflows.',
    'IT professional since 2018 with 6.5+ years of hands-on employment across IT support, ERP systems, web development, and system integration.',
    '21,800 BDT', 'Negotiable'
);
```

### 15.2 Site Stats

```sql
INSERT INTO site_stats (value, label, sort_order) VALUES
    ('15+', 'Sites Built', 1),
    ('60%', 'Efficiency Boost', 2),
    ('100+', 'Users Managed', 3);
```

### 15.3 Portfolio Categories & Projects

```sql
-- Categories
INSERT INTO portfolio_categories (id, name, key, icon, sort_order) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Software Development', 'software', 'laptop_mac', 1),
    ('a0000000-0000-0000-0000-000000000002', 'Web & E-Commerce', 'web', 'language', 2),
    ('a0000000-0000-0000-0000-000000000003', 'IT Support & Maintenance', 'it', 'build', 3),
    ('a0000000-0000-0000-0000-000000000004', 'Graphics & Design', 'design', 'palette', 4);

-- Sample project
INSERT INTO portfolio_projects (category_id, title, slug, tech, description, date, is_featured)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Aluminum Bundle Weight Checker V3/V4',
    'weight-checker',
    'C#.NET, Serial Port, ERP Automation',
    'Desktop application for automated bundle weight checking with serial port scale integration and ERP label printing.',
    '2026-04-01', true
);
```

### 15.4 Multimedia Categories & Items

```sql
INSERT INTO multimedia_categories (id, name, key, icon, sort_order) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Creative Services', 'creative', 'auto_awesome', 1),
    ('b0000000-0000-0000-0000-000000000002', 'Graphics & Design', 'design', 'palette', 2),
    ('b0000000-0000-0000-0000-000000000003', 'Video & Multimedia', 'video', 'videocam', 3),
    ('b0000000-0000-0000-0000-000000000004', 'Photography', 'photo', 'camera_alt', 4);

INSERT INTO multimedia_items (category_id, title, slug, description, date, media_type) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Custom Poetry Composition', 'custom-poetry-01',
     'Personalized poetry for events, presentations, and media projects.', '2026-05-01', 'document');
```

### 15.5 Menu Items

```sql
INSERT INTO menu_items (path, label, icon, sort_order) VALUES
    ('/', 'Home', 'home', 1),
    ('/about', 'About', 'person', 2),
    ('/skills', 'Skills', 'settings', 3),
    ('/experience', 'Experience', 'work', 4),
    ('/education', 'Education', 'school', 5),
    ('/projects', 'Projects', 'folder_open', 6),
    ('/multimedia-works', 'Multimedia Works', 'smart_display', 7),
    ('/achievements', 'Achievements', 'emoji_events', 8),
    ('/services', 'Services', 'handyman', 9),
    ('/contact', 'Contact', 'email', 10);
```

### 15.6 Media Channel

```sql
INSERT INTO media_channels (channel_url, channel_handle, channel_name, channel_avatar,
    description, playlist_id, playlist_title, featured_video_id, links)
VALUES (
    'https://www.youtube.com/@aminur670',
    '@aminur670',
    'Aminur670',
    'https://yt3.ggpht.com/cNVM5rkUOhCpTkvrrF956fjyQB6eqlmLLP1Yt1kAiKKa64RGL9s6TUx-RjwgQOJ-jw7Bj25qHw=s88-c-k-c0x00ffffff-no-rj',
    'Creative content, tech projects, and more.',
    'UU9ndhDLZxczY17jgLdDlx4g',
    'Channel Uploads',
    'W3YmvF_gh8Q',
    '[{"title": "YouTube Channel", "url": "https://www.youtube.com/@aminur670", "icon": "smart_display"}, {"title": "Google Drive Portfolio", "url": "#", "icon": "cloud"}]'
);
```

---

## Entity Relationship Summary

```
auth.users
  ├── clients (auth_user_id)
  ├── activity_log (actor_id)
  ├── notifications (recipient via client_id)
  └── files (uploaded_by)

clients
  ├── leads (converted_to_client_id)
  ├── projects (client_id)
  ├── orders (client_id)
  ├── invoices (client_id)
  ├── payments (client_id)
  ├── contracts (client_id)
  ├── messages (client_id)
  ├── appointments (client_id)
  └── expenses (client_id)

projects
  ├── project_milestones (project_id)
  ├── tasks (project_id)
  ├── time_entries (project_id)
  ├── contracts (project_id)
  └── expenses (project_id)

tasks
  └── time_entries (task_id)

invoices
  ├── invoice_items (invoice_id)
  └── payments (invoice_id)

orders
  └── order_items (order_id)

campaigns
  └── campaign_recipients (campaign_id)
      └── subscribers (subscriber_id)

portfolio_categories
  └── portfolio_projects (category_id)
      └── portfolio_project_details (project_id)

multimedia_categories
  └── multimedia_items (category_id)

skill_categories
  └── skill_items (category_id)

achievement_categories
  └── achievement_items (category_id)

files (polymorphic: attachable_type + attachable_id)
tags (polymorphic via taggables)
```

---

> **Generated:** 2026-06-09  
> **Database:** PostgreSQL 15+ / Supabase  
> **Total Tables:** ~45  
> **Total Views:** 8  
> **Total Functions:** 6  
> **RLS Policies:** 25+
