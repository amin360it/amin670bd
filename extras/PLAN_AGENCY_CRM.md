# Single Man Agency â€” Full Platform Plan

> Framework: **Nuxt 3** (Vue 3 + Nitro)  
> Database: **Supabase** (Postgres + Auth + Storage + Realtime)  
> Deploy: **Vercel** / Netlify  
> UI: **Nuxt UI v4** + Tailwind CSS v4  
> Payments: **Stripe**  
> Email: **Resend** + Vue Email  

---

## Table of Contents

1. [Full Data Model](#1-full-data-model)
2. [Status Workflows](#2-status-workflows)
3. [Full Route Structure](#3-full-route-structure)
4. [UI / Component Plan](#4-ui--component-plan)
5. [Auth Architecture](#5-auth-architecture)
6. [File Organization](#6-file-organization)
7. [Integration Points](#7-integration-points)
8. [Implementation Phases](#8-implementation-phases)
9. [Key Architecture Decisions](#9-key-architecture-decisions)

---

## 1. Full Data Model

### clients

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | |
| email | TEXT UNIQUE | |
| phone | TEXT | |
| company | TEXT | |
| website | TEXT | |
| address | TEXT | |
| notes | TEXT | Internal notes |
| status | TEXT | `active`, `archived`, `lead` |
| auth_user_id | UUID â†’ auth.users | Nullable â€” for portal login |
| source | TEXT | `contact_form`, `store`, `referral`, `manual` |
| total_spent | NUMERIC | Computed |
| created_by | UUID â†’ auth.users | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### leads

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | |
| email | TEXT | |
| phone | TEXT | |
| company | TEXT | |
| source | TEXT | `website`, `referral`, `freelance_platform`, `cold` |
| status | TEXT | `new`, `contacted`, `qualified`, `proposal`, `converted`, `lost` |
| notes | TEXT | |
| next_follow_up | TIMESTAMPTZ | |
| converted_to_client_id | UUID â†’ clients | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### projects

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| client_id | UUID â†’ clients | |
| name | TEXT | |
| description | TEXT | |
| status | TEXT | `draft`, `active`, `paused`, `review`, `completed`, `cancelled` |
| type | TEXT | `fixed_price`, `hourly_retainer`, `ongoing` |
| budget | NUMERIC | |
| hourly_rate | NUMERIC | |
| start_date | DATE | |
| deadline | DATE | |
| completed_at | TIMESTAMPTZ | |
| contract_id | UUID â†’ contracts | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### project_milestones

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| project_id | UUID â†’ projects | |
| name | TEXT | |
| description | TEXT | |
| amount | NUMERIC | Milestone payment |
| due_date | DATE | |
| status | TEXT | `pending`, `in_progress`, `completed`, `paid` |
| completed_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

### tasks

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| project_id | UUID â†’ projects | |
| milestone_id | UUID â†’ milestones | Nullable |
| title | TEXT | |
| description | TEXT | |
| status | TEXT | `todo`, `in_progress`, `review`, `done` |
| priority | TEXT | `low`, `medium`, `high`, `urgent` |
| estimated_hours | NUMERIC | |
| logged_hours | NUMERIC | Computed |
| due_date | DATE | |
| completed_at | TIMESTAMPTZ | |
| sort_order | INTEGER | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### time_entries

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| task_id | UUID â†’ tasks | Nullable |
| project_id | UUID â†’ projects | |
| description | TEXT | |
| duration | INTEGER | Seconds |
| start_time | TIMESTAMPTZ | |
| end_time | TIMESTAMPTZ | |
| billable | BOOLEAN | Default true |
| invoiced | BOOLEAN | Default false |
| created_at | TIMESTAMPTZ | |

### products

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| title | TEXT | |
| description | TEXT | |
| category | TEXT | |
| icon | TEXT | Material icon name |
| price | NUMERIC | |
| cost | NUMERIC | |
| delivery_time | TEXT | e.g. "3-5 days" |
| is_active | BOOLEAN | |
| sort_order | INTEGER | |
| type | TEXT | `service`, `digital_product`, `physical_product`, `retainer` |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### orders

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| order_number | TEXT UNIQUE | Auto-generated |
| client_id | UUID â†’ clients | |
| status | TEXT | `pending`, `confirmed`, `in_progress`, `delivered`, `completed`, `cancelled` |
| subtotal | NUMERIC | |
| tax | NUMERIC | |
| total | NUMERIC | |
| notes | TEXT | Client-facing |
| internal_notes | TEXT | |
| payment_status | TEXT | `unpaid`, `partial`, `paid` |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### order_items

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| order_id | UUID â†’ orders | |
| product_id | UUID â†’ products | |
| quantity | NUMERIC | |
| unit_price | NUMERIC | |
| total | NUMERIC | |
| description | TEXT | Snapshot |

### invoices

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| invoice_number | TEXT UNIQUE | Auto-increment |
| client_id | UUID â†’ clients | |
| project_id | UUID â†’ projects | Nullable |
| status | TEXT | `draft`, `sent`, `paid`, `overdue`, `cancelled`, `refunded` |
| issue_date | DATE | |
| due_date | DATE | |
| paid_at | TIMESTAMPTZ | |
| subtotal | NUMERIC | |
| tax_rate | NUMERIC | |
| tax_amount | NUMERIC | |
| total | NUMERIC | |
| notes | TEXT | |
| terms | TEXT | Payment terms |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### invoice_items

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| invoice_id | UUID â†’ invoices | |
| description | TEXT | |
| quantity | NUMERIC | |
| unit_price | NUMERIC | |
| total | NUMERIC | |
| source_type | TEXT | `time_entry`, `expense`, `product`, `manual` |
| source_id | UUID | Polymorphic |

### payments

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| invoice_id | UUID â†’ invoices | |
| client_id | UUID â†’ clients | |
| amount | NUMERIC | |
| method | TEXT | `stripe`, `bank_transfer`, `cash`, `paypal`, `bkash` |
| stripe_payment_intent_id | TEXT | |
| status | TEXT | `pending`, `completed`, `failed`, `refunded` |
| payment_date | TIMESTAMPTZ | |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |

### expenses

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| project_id | UUID â†’ projects | Nullable |
| client_id | UUID â†’ clients | Nullable |
| category | TEXT | `software`, `travel`, `office`, `subcontractor`, `hosting`, `other` |
| amount | NUMERIC | |
| tax | NUMERIC | |
| receipt_url | TEXT | Supabase Storage |
| description | TEXT | |
| date | DATE | |
| billable | BOOLEAN | |
| reimbursed | BOOLEAN | |
| invoiced | BOOLEAN | |
| created_at | TIMESTAMPTZ | |

### contracts

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| client_id | UUID â†’ clients | |
| project_id | UUID â†’ projects | Nullable |
| title | TEXT | |
| content | TEXT | Markdown/HTML |
| status | TEXT | `draft`, `sent`, `signed`, `expired`, `cancelled` |
| file_url | TEXT | PDF in Storage |
| valid_from | DATE | |
| valid_until | DATE | |
| signed_by_client_at | TIMESTAMPTZ | |
| signed_by_me_at | TIMESTAMPTZ | |
| template_id | UUID â†’ contract_templates | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### contract_templates

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| title | TEXT | |
| content | TEXT | With `{{variable}}` placeholders |
| variables | TEXT[] | `["client_name", "project_name", "budget"]` |
| created_at | TIMESTAMPTZ | |

### messages

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| client_id | UUID â†’ clients | |
| project_id | UUID â†’ projects | Nullable |
| subject | TEXT | |
| body | TEXT | Markdown |
| direction | TEXT | `inbound`, `outbound` |
| sender_type | TEXT | `admin`, `client` |
| is_read | BOOLEAN | |
| read_at | TIMESTAMPTZ | |
| reply_to_id | UUID â†’ messages | Threading |
| created_at | TIMESTAMPTZ | |

### email_templates

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | |
| subject | TEXT | |
| body | TEXT | HTML with variables |
| category | TEXT | `invoice`, `proposal`, `welcome`, `reminder`, `newsletter` |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### subscribers

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| email | TEXT UNIQUE | |
| name | TEXT | |
| source | TEXT | `contact_form`, `store`, `manual` |
| status | TEXT | `active`, `unsubscribed`, `bounced` |
| subscribed_at | TIMESTAMPTZ | |
| unsubscribed_at | TIMESTAMPTZ | |

### campaigns

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | |
| subject | TEXT | |
| body | TEXT | HTML |
| status | TEXT | `draft`, `scheduled`, `sending`, `sent` |
| sent_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

### campaign_recipients

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| campaign_id | UUID â†’ campaigns | |
| subscriber_id | UUID â†’ subscribers | |
| sent_at | TIMESTAMPTZ | |
| opened_at | TIMESTAMPTZ | |
| clicked_at | TIMESTAMPTZ | |

### appointments

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| client_id | UUID â†’ clients | |
| project_id | UUID â†’ projects | Nullable |
| title | TEXT | |
| description | TEXT | |
| start_time | TIMESTAMPTZ | |
| end_time | TIMESTAMPTZ | |
| all_day | BOOLEAN | |
| status | TEXT | `scheduled`, `completed`, `cancelled`, `rescheduled` |
| location | TEXT | URL or address |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### files

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| storage_path | TEXT | Supabase Storage path |
| original_name | TEXT | |
| mime_type | TEXT | |
| size_bytes | BIGINT | |
| bucket | TEXT | Supabase bucket name |
| attachable_type | TEXT | `project`, `task`, `invoice`, `message`, `client` |
| attachable_id | UUID | Polymorphic |
| uploaded_by | UUID â†’ auth.users | |
| created_at | TIMESTAMPTZ | |

### activity_log

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| actor_type | TEXT | `admin`, `client`, `system` |
| action | TEXT | `created`, `updated`, `deleted`, `status_changed`, `paid` |
| entity_type | TEXT | |
| entity_id | UUID | |
| metadata | JSONB | Old/new values |
| created_at | TIMESTAMPTZ | |

### notifications

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| type | TEXT | `email`, `in_app` |
| recipient | TEXT | Admin email or client ID |
| title | TEXT | |
| body | TEXT | |
| link | TEXT | |
| is_read | BOOLEAN | |
| read_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

### settings

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| key | TEXT UNIQUE | |
| value | JSONB | |
| category | TEXT | `general`, `invoice`, `email`, `booking`, `payment` |
| updated_at | TIMESTAMPTZ | |

---

## 2. Status Workflows

```
Lead:
  new â†’ contacted â†’ qualified â†’ proposal â†’ converted â†’ client
                                          â†’ lost

Order:
  pending â†’ confirmed â†’ in_progress â†’ delivered â†’ completed â†’ archived
  (any) â†’ cancelled

Invoice:
  draft â†’ sent â†’ paid
         â†’ overdue â†’ paid
  draft â†’ cancelled
  paid â†’ refunded

Project:
  draft â†’ active â†’ paused â†’ review â†’ completed â†’ archived
  (any) â†’ cancelled

Task:
  todo â†’ in_progress â†’ review â†’ done

Contract:
  draft â†’ sent â†’ signed
                â†’ expired
  draft â†’ cancelled

Appointment:
  scheduled â†’ completed
             â†’ cancelled
             â†’ rescheduled (â†’ scheduled)
```

---

## 3. Full Route Structure

### Public Pages (SSR â€” SEO)

| Route | Page |
|-------|------|
| `/` | Home (portfolio hero, highlights, stats) |
| `/about` | About page |
| `/projects` | Project portfolio |
| `/project/:id` | Project detail |
| `/services` | Services page |
| `/multimedia-works` | Multimedia portfolio |
| `/store` | Storefront â€” product listings |
| `/store/cart` | Shopping cart |
| `/store/checkout` | Checkout flow |
| `/contact` | Contact form |
| `/blog` | Blog listing |
| `/blog/:slug` | Blog post |
| `/faq` | FAQ page |

### Client Portal (SSR â€” behind auth)

| Route | Page |
|-------|------|
| `/portal/login` | Client login |
| `/portal/register` | Client registration (or invitation) |
| `/portal/dashboard` | Client home â€” active projects, recent invoices |
| `/portal/projects` | Client's projects list |
| `/portal/projects/:id` | Project detail + milestones + files |
| `/portal/projects/:id/tasks` | Task board (view) |
| `/portal/invoices` | Client's invoices |
| `/portal/invoices/:id` | Invoice detail + pay button |
| `/portal/messages` | Messages with admin |
| `/portal/messages/:id` | Thread |
| `/portal/files` | Shared files |
| `/portal/profile` | Update profile |

### Dashboard Pages (Client-side SPA â€” `ssr: false`)

| Route | Page |
|-------|------|
| `/dashboard/login` | Admin login |
| `/dashboard` | Overview â€” stats, charts, recent activity |
| `/dashboard/leads` | Lead management |
| `/dashboard/leads/:id` | Lead detail + convert to client |
| `/dashboard/clients` | CRM â€” table, search, filter, export |
| `/dashboard/clients/:id` | Client detail â€” projects, invoices, messages, notes, files |
| `/dashboard/orders` | All orders |
| `/dashboard/orders/:id` | Order detail â€” items, status update, invoice creation |
| `/dashboard/projects` | Project list |
| `/dashboard/projects/:id` | Project detail â€” milestones, tasks, time, files, expenses |
| `/dashboard/projects/:id/tasks` | Task kanban/list view |
| `/dashboard/projects/:id/time` | Time tracking |
| `/dashboard/invoices` | Invoice list |
| `/dashboard/invoices/new` | New invoice |
| `/dashboard/invoices/:id` | Invoice detail â€” edit, send email, record payment |
| `/dashboard/invoices/recurring` | Recurring invoice templates |
| `/dashboard/payments` | Payment records |
| `/dashboard/products` | Product/service catalog CRUD |
| `/dashboard/expenses` | Expense tracking |
| `/dashboard/expenses/new` | New expense |
| `/dashboard/contracts` | Contracts list |
| `/dashboard/contracts/new` | New contract (from template) |
| `/dashboard/contracts/:id` | Edit, send for signature |
| `/dashboard/messages` | Inbox â€” all client messages |
| `/dashboard/messages/:id` | Thread â€” reply |
| `/dashboard/subscribers` | Newsletter subscribers list |
| `/dashboard/subscribers/new` | Manual add subscriber |
| `/dashboard/campaigns` | Email campaigns |
| `/dashboard/campaigns/new` | New campaign |
| `/dashboard/campaigns/:id` | Edit, send, stats |
| `/dashboard/appointments` | Calendar â€” upcoming/past appointments |
| `/dashboard/appointments/new` | New appointment |
| `/dashboard/appointments/:id` | Edit |
| `/dashboard/files` | File manager â€” all uploaded files |
| `/dashboard/settings` | Settings â€” profile, invoice defaults, payment, email |

### API Routes (Nitro Server)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/invite-client` | Create client user + send invite |
| POST | `/api/stripe/create-checkout` | Create checkout session |
| POST | `/api/stripe/create-portal` | Billing portal URL |
| POST | `/api/stripe/webhook` | Stripe webhook receiver |
| POST | `/api/email/send` | Send transactional email |
| POST | `/api/email/send-invoice` | Send invoice as attachment |
| POST | `/api/email/send-contract` | Send contract for signature |
| POST | `/api/upload` | Upload file to Supabase Storage |
| POST | `/api/upload/signed-url` | Get signed URL for private file |
| GET | `/api/public/products` | Storefront product list |
| POST | `/api/public/contact` | Submit contact form |
| POST | `/api/public/subscribe` | Newsletter subscribe |
| GET | `/api/public/blog` | Blog listing |

### Nitro Tasks (Automation)

| Task | Schedule | Purpose |
|------|----------|---------|
| `generate-recurring-invoices` | Daily 9 AM | Check templates, create invoices |
| `send-overdue-reminders` | Daily 10 AM | Email reminders for overdue invoices |
| `cleanup-expired-tokens` | Weekly | Remove expired session/temp data |
| `sync-stripe-data` | Hourly | Sync Stripe data to Supabase |

---

## 4. UI / Component Plan

### Dashboard UI Library

**Choice: Nuxt UI v4** (120+ components, Nuxt-native, Tailwind v4)

Key components to use:
- `UDashboardLayout`, `UDashboardPanel` â€” sidebar layout
- `USidebar`, `UNavigationMenu` â€” nav
- `UCard`, `UPage`, `UPageHeader` â€” page structure
- `UTable`, `UDropdownMenu` â€” data tables with actions
- `UForm`, `UInput`, `USelect`, `UTextarea`, `UCheckbox` â€” forms
- `UButton`, `UBadge`, `UTooltip` â€” actions
- `UModal`, `USlideover` â€” CRUD modals
- `UToast`, `UAlert`, `UNotification` â€” feedback
- `UChart` â€” built-in chart component
- `UDashboardNavbar` â€” top bar with search, notifications, avatar

### Reusable Dashboard Components

```
components/dashboard/
â”œâ”€â”€ AppLayout.vue              Wraps sidebar + navbar + main
â”œâ”€â”€ Sidebar.vue                Navigation links
â”œâ”€â”€ SidebarItem.vue            Single nav item with icon + badge
â”œâ”€â”€ Navbar.vue                 Top bar: search, notifications, profile
â”œâ”€â”€ DataTable.vue              Generic table: sort, paginate, select, actions
â”œâ”€â”€ DataTableFilters.vue       Search, date range, status pills
â”œâ”€â”€ FormModal.vue              CRUD modal: title, form fields, save/cancel
â”œâ”€â”€ ConfirmDialog.vue          Delete confirmation
â”œâ”€â”€ StatsCard.vue              Metric: icon, value, label, trend
â”œâ”€â”€ StatusBadge.vue            Color-coded badge
â”œâ”€â”€ ActivityTimeline.vue       Recent activity feed
â”œâ”€â”€ KanbanBoard.vue            Drag-and-drop task board
â”œâ”€â”€ KanbanColumn.vue           Single column
â”œâ”€â”€ KanbanCard.vue             Single task card
â”œâ”€â”€ FileDropzone.vue           Drag-and-drop file upload
â”œâ”€â”€ FileList.vue               List of files with download/delete
â”œâ”€â”€ InlineEditor.vue           Click-to-edit text
â”œâ”€â”€ EmptyState.vue             When no data: icon + message + CTA
â”œâ”€â”€ LoadingSkeleton.vue        Shimmer loading placeholder
â”œâ”€â”€ AvatarUpload.vue           Crop + upload
â”œâ”€â”€ ColorPicker.vue            For settings themes
â””â”€â”€ SearchCommand.vue          Cmd+K command palette
```

### Page-Specific Components

```
components/
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ HeroSection.vue
â”‚   â”œâ”€â”€ ProjectCard.vue
â”‚   â”œâ”€â”€ ServiceCard.vue
â”‚   â””â”€â”€ ContactForm.vue
â”œâ”€â”€ dashboard/overview/
â”‚   â”œâ”€â”€ StatsGrid.vue          Stat cards
â”‚   â”œâ”€â”€ RevenueChart.vue       Monthly revenue chart
â”‚   â”œâ”€â”€ RecentOrders.vue       Latest orders table
â”‚   â””â”€â”€ UpcomingTasks.vue      Today's task list
â”œâ”€â”€ dashboard/clients/
â”‚   â”œâ”€â”€ ClientTable.vue
â”‚   â”œâ”€â”€ ClientForm.vue
â”‚   â”œâ”€â”€ ClientDetail.vue
â”‚   â”œâ”€â”€ ClientProjects.vue
â”‚   â”œâ”€â”€ ClientInvoices.vue
â”‚   â”œâ”€â”€ ClientMessages.vue
â”‚   â”œâ”€â”€ ClientNotes.vue
â”‚   â””â”€â”€ ClientFiles.vue
â”œâ”€â”€ dashboard/projects/
â”‚   â”œâ”€â”€ ProjectTable.vue
â”‚   â”œâ”€â”€ ProjectForm.vue
â”‚   â”œâ”€â”€ ProjectHeader.vue
â”‚   â”œâ”€â”€ ProjectTimeline.vue
â”‚   â”œâ”€â”€ TaskBoard.vue
â”‚   â”œâ”€â”€ TaskList.vue
â”‚   â”œâ”€â”€ TaskForm.vue
â”‚   â”œâ”€â”€ TimeTracker.vue
â”‚   â”œâ”€â”€ TimeLog.vue
â”‚   â””â”€â”€ ProjectFiles.vue
â”œâ”€â”€ dashboard/invoices/
â”‚   â”œâ”€â”€ InvoiceTable.vue
â”‚   â”œâ”€â”€ InvoiceForm.vue
â”‚   â”œâ”€â”€ InvoicePreview.vue
â”‚   â”œâ”€â”€ InvoiceActions.vue
â”‚   â””â”€â”€ RecurringTemplateForm.vue
â”œâ”€â”€ dashboard/orders/
â”‚   â”œâ”€â”€ OrderTable.vue
â”‚   â”œâ”€â”€ OrderDetail.vue
â”‚   â””â”€â”€ OrderStatusDropdown.vue
â”œâ”€â”€ dashboard/messages/
â”‚   â”œâ”€â”€ InboxList.vue
â”‚   â”œâ”€â”€ MessageThread.vue
â”‚   â””â”€â”€ MessageComposer.vue
â”œâ”€â”€ dashboard/email/
â”‚   â”œâ”€â”€ CampaignTable.vue
â”‚   â”œâ”€â”€ CampaignWizard.vue
â”‚   â””â”€â”€ CampaignStats.vue
â”œâ”€â”€ dashboard/calendar/
â”‚   â”œâ”€â”€ CalendarView.vue
â”‚   â”œâ”€â”€ AppointmentForm.vue
â”‚   â””â”€â”€ AppointmentCard.vue
â”œâ”€â”€ dashboard/settings/
â”‚   â”œâ”€â”€ ProfileForm.vue
â”‚   â”œâ”€â”€ InvoiceSettings.vue
â”‚   â”œâ”€â”€ EmailSettings.vue
â”‚   â”œâ”€â”€ PaymentSettings.vue
â”‚   â””â”€â”€ NotificationSettings.vue
â””â”€â”€ portal/
    â”œâ”€â”€ PortalLayout.vue
    â”œâ”€â”€ ClientDashboard.vue
    â”œâ”€â”€ ClientProjects.vue
    â”œâ”€â”€ ClientInvoices.vue
    â”œâ”€â”€ ClientMessages.vue
    â””â”€â”€ ClientFiles.vue
```

---

## 5. Auth Architecture

### Two Authentication Flows

```
Supabase Auth
â”œâ”€â”€ Admin (single user â€” you)
â”‚   â”œâ”€â”€ Email/password or GitHub OAuth
â”‚   â””â”€â”€ role: 'admin' in user_metadata
â”‚
â”œâ”€â”€ Clients (many)
â”‚   â”œâ”€â”€ Email/password (invited by admin)
â”‚   â””â”€â”€ role: 'client' in user_metadata
â”‚
â””â”€â”€ Custom Access Token Hook adds app_role claim to JWT
```

### RLS Policy Pattern

```sql
-- Admin: full access to everything
CREATE POLICY "Admin full access" ON projects
FOR ALL USING (auth.jwt()->>'app_role' = 'admin');

-- Client: read-only, filtered to their records
CREATE POLICY "Client view own projects" ON projects
FOR SELECT USING (
  auth.jwt()->>'app_role' = 'client' AND
  client_id = (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);

-- Leads: admin-only
CREATE POLICY "Admin manage leads" ON leads
FOR ALL USING (auth.jwt()->>'app_role' = 'admin');
```

### Nuxt Middleware

```ts
// middleware/dashboard-auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const role = user.value?.user_metadata?.role;
  if (!user.value) return navigateTo('/dashboard/login');
  if (role !== 'admin') return navigateTo('/portal/dashboard');
});

// middleware/portal-auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  if (!user.value) return navigateTo('/portal/login');
});
```

---

## 6. File Organization

```
amin670bd/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ app.config.ts
â”‚   â”œâ”€â”€ app.vue
â”‚   â”œâ”€â”€ nuxt.config.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ layouts/
â”‚   â”‚   â”œâ”€â”€ default.vue         Public (header + footer)
â”‚   â”‚   â”œâ”€â”€ dashboard.vue       Admin sidebar + navbar
â”‚   â”‚   â””â”€â”€ portal.vue          Client sidebar + navbar
â”‚   â”‚
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ index.vue
â”‚   â”‚   â”œâ”€â”€ about.vue
â”‚   â”‚   â”œâ”€â”€ projects.vue
â”‚   â”‚   â”œâ”€â”€ services.vue
â”‚   â”‚   â”œâ”€â”€ multimedia-works.vue
â”‚   â”‚   â”œâ”€â”€ store/
â”‚   â”‚   â”‚   â”œâ”€â”€ index.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ cart.vue
â”‚   â”‚   â”‚   â””â”€â”€ checkout.vue
â”‚   â”‚   â”œâ”€â”€ contact.vue
â”‚   â”‚   â”œâ”€â”€ blog/
â”‚   â”‚   â”‚   â”œâ”€â”€ index.vue
â”‚   â”‚   â”‚   â””â”€â”€ [slug].vue
â”‚   â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”‚   â”œâ”€â”€ login.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ index.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ leads.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ leads/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ clients.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ clients/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ orders.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ orders/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ projects.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ projects/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ projects/[id]/tasks.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ projects/[id]/time.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ invoices.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ invoices/new.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ invoices/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ invoices/recurring.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ payments.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ products.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ expenses.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ contracts.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ contracts/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ messages.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ messages/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ subscribers.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ campaigns.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ campaigns/[id].vue
â”‚   â”‚   â”‚   â”œâ”€â”€ appointments.vue
â”‚   â”‚   â”‚   â”œâ”€â”€ files.vue
â”‚   â”‚   â”‚   â””â”€â”€ settings.vue
â”‚   â”‚   â””â”€â”€ portal/
â”‚   â”‚       â”œâ”€â”€ login.vue
â”‚   â”‚       â”œâ”€â”€ dashboard.vue
â”‚   â”‚       â”œâ”€â”€ projects.vue
â”‚   â”‚       â”œâ”€â”€ projects/[id].vue
â”‚   â”‚       â”œâ”€â”€ invoices.vue
â”‚   â”‚       â”œâ”€â”€ invoices/[id].vue
â”‚   â”‚       â”œâ”€â”€ messages.vue
â”‚   â”‚       â”œâ”€â”€ messages/[id].vue
â”‚   â”‚       â”œâ”€â”€ files.vue
â”‚   â”‚       â””â”€â”€ profile.vue
â”‚   â”‚
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â””â”€â”€ portal/
â”‚   â”‚
â”‚   â”œâ”€â”€ composables/
â”‚   â”‚   â”œâ”€â”€ useSupabase.ts
â”‚   â”‚   â”œâ”€â”€ useAuth.ts
â”‚   â”‚   â”œâ”€â”€ useClients.ts
â”‚   â”‚   â”œâ”€â”€ useProjects.ts
â”‚   â”‚   â”œâ”€â”€ useOrders.ts
â”‚   â”‚   â”œâ”€â”€ useInvoices.ts
â”‚   â”‚   â”œâ”€â”€ useTasks.ts
â”‚   â”‚   â”œâ”€â”€ useTimeTracking.ts
â”‚   â”‚   â”œâ”€â”€ useMessages.ts
â”‚   â”‚   â”œâ”€â”€ useFiles.ts
â”‚   â”‚   â”œâ”€â”€ useNotifications.ts
â”‚   â”‚   â”œâ”€â”€ useExport.ts
â”‚   â”‚   â””â”€â”€ useFormat.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ stores/
â”‚   â”‚   â”œâ”€â”€ auth.store.ts
â”‚   â”‚   â”œâ”€â”€ cart.store.ts
â”‚   â”‚   â”œâ”€â”€ ui.store.ts
â”‚   â”‚   â””â”€â”€ filter.store.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ format.ts
â”‚   â”‚   â”œâ”€â”€ validators.ts
â”‚   â”‚   â””â”€â”€ constants.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ types/
â”‚   â”‚   â”œâ”€â”€ client.ts
â”‚   â”‚   â”œâ”€â”€ project.ts
â”‚   â”‚   â”œâ”€â”€ invoice.ts
â”‚   â”‚   â”œâ”€â”€ order.ts
â”‚   â”‚   â”œâ”€â”€ task.ts
â”‚   â”‚   â”œâ”€â”€ product.ts
â”‚   â”‚   â””â”€â”€ index.ts
â”‚   â”‚
â”‚   â””â”€â”€ middleware/
â”‚       â”œâ”€â”€ dashboard-auth.ts
â”‚       â””â”€â”€ portal-auth.ts
â”‚
â”œâ”€â”€ server/
â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”œâ”€â”€ supabase.ts
â”‚   â”‚   â”œâ”€â”€ stripe.ts
â”‚   â”‚   â”œâ”€â”€ email.ts
â”‚   â”‚   â””â”€â”€ helpers.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ auth/
â”‚   â”‚   â”‚   â””â”€â”€ invite-client.post.ts
â”‚   â”‚   â”œâ”€â”€ stripe/
â”‚   â”‚   â”‚   â”œâ”€â”€ create-checkout.post.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ create-portal.post.ts
â”‚   â”‚   â”‚   â””â”€â”€ webhook.post.ts
â”‚   â”‚   â”œâ”€â”€ email/
â”‚   â”‚   â”‚   â”œâ”€â”€ send.post.ts
â”‚   â”‚   â”‚   â”œâ”€â”€ send-invoice.post.ts
â”‚   â”‚   â”‚   â””â”€â”€ send-contract.post.ts
â”‚   â”‚   â”œâ”€â”€ upload.post.ts
â”‚   â”‚   â””â”€â”€ public/
â”‚   â”‚       â”œâ”€â”€ products.get.ts
â”‚   â”‚       â”œâ”€â”€ contact.post.ts
â”‚   â”‚       â””â”€â”€ subscribe.post.ts
â”‚   â”‚
â”‚   â”œâ”€â”€ tasks/
â”‚   â”‚   â”œâ”€â”€ generate-recurring-invoices.ts
â”‚   â”‚   â”œâ”€â”€ send-overdue-reminders.ts
â”‚   â”‚   â””â”€â”€ sync-stripe.ts
â”‚   â”‚
â”‚   â””â”€â”€ middleware/
â”‚       â”œâ”€â”€ auth.ts
â”‚       â””â”€â”€ rate-limit.ts
â”‚
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ css/
â”‚   â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ images/
â”‚   â””â”€â”€ fonts/
â”‚
â”œâ”€â”€ emails/
â”‚   â”œâ”€â”€ InvoiceEmail.vue
â”‚   â”œâ”€â”€ ContractEmail.vue
â”‚   â”œâ”€â”€ WelcomeClient.vue
â”‚   â”œâ”€â”€ PasswordReset.vue
â”‚   â””â”€â”€ NewsletterTemplate.vue
â”‚
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ favicon.svg
â”‚   â””â”€â”€ robots.txt
â”‚
â”œâ”€â”€ supabase/
â”‚   â”œâ”€â”€ migrations/
â”‚   â”œâ”€â”€ seed.sql
â”‚   â””â”€â”€ schema.sql
â”‚
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ unit/
â”‚   â”œâ”€â”€ integration/
â”‚   â””â”€â”€ e2e/
â”‚
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ ARCHITECTURE.md
â”‚   â”œâ”€â”€ API.md
â”‚   â””â”€â”€ DEPLOYMENT.md
â”‚
â”œâ”€â”€ nuxt.config.ts
â”œâ”€â”€ tailwind.config.ts
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ package.json
â”œâ”€â”€ .env.example
â””â”€â”€ README.md
```

---

## 7. Integration Points

| Service | What It Does | Nuxt Integration |
|---------|-------------|------------------|
| **Supabase** | Database, Auth, Storage, Realtime | `@nuxtjs/supabase` module |
| **Stripe** | Payments, subscriptions, invoices | `server/api/stripe/*`, webhooks |
| **Resend** | Transactional emails | `server/api/email/*` + Vue Email |
| **Supabase Realtime** | Live message notifications | `supabase.channel()` in composables |
| **Supabase Storage** | File uploads (deliverables, receipts) | Client upload via SDK + RLS |

---

## 8. Implementation Phases

### Phase 0: Setup (1 day)

- `npx nuxi init` with Supabase + Nuxt UI modules
- Configure TypeScript, Tailwind, routeRules
- Set up Supabase project + initial migrations
- Set up Stripe account + webhook endpoint
- Set up Resend + custom domain

### Phase 1: Migrate Portfolio (1 day)

- Copy existing pages as Nuxt pages
- Convert `DATA` references to `useState` / `useFetch`
- Route rules: public pages = SSR
- Verify all existing portfolio pages work

### Phase 2: Auth + Layout (2 days)

- Supabase Auth + admin login page
- Dashboard layout (sidebar + navbar)
- Client portal layout
- Auth middleware + route guards

### Phase 3: Core Admin Modules (4 days)

Each module includes: CRUD table + create/edit form + detail view.

| Module | Pages | Time |
|--------|-------|------|
| Products/Services CRUD | Table + form + toggle active | 0.5 day |
| Clients CRM | Table, detail with tabs (projects, invoices, messages, notes, files) | 1 day |
| Orders | Table + detail + status transitions + invoice creation | 0.5 day |
| Projects + Milestones | Table + detail + timeline | 0.5 day |
| Tasks + Kanban | Board + list + form + drag-and-drop | 0.5 day |
| Time Tracking | Timer + manual entry + log table | 0.5 day |
| Invoices + Payments | Editor with line items + preview + send + record payment | 0.5 day |
| Expenses | Table + form + receipt upload | 0.25 day |

### Phase 4: Client Portal (2 days)

| Task | Time |
|------|------|
| Client login/invitation flow | 0.5 day |
| Dashboard view â€” active projects + recent invoices | 0.25 day |
| View projects + tasks (read-only) | 0.25 day |
| View + pay invoices (Stripe portal) | 0.5 day |
| Message admin + file download | 0.5 day |

### Phase 5: Storefront + Cart (2 days)

| Task | Time |
|------|------|
| Public product listing page | 0.5 day |
| Cart with Pinia (persisted) | 0.5 day |
| Stripe checkout integration | 0.5 day |
| Order confirmation page | 0.5 day |

### Phase 6: Communication (2 days)

| Task | Time |
|------|------|
| Message inbox â€” contact form â†’ message thread | 0.5 day |
| Threaded replies + admin reply UI | 0.5 day |
| Email sending (Resend + Vue Email templates) | 0.5 day |
| Newsletter subscriber management | 0.25 day |
| Campaign builder + send | 0.25 day |

### Phase 7: Automation + Polish (3 days)

| Task | Time |
|------|------|
| Recurring invoice generation task | 0.5 day |
| Overdue reminder task | 0.25 day |
| Stripe sync task | 0.25 day |
| Export CSV for clients/invoices | 0.25 day |
| Dashboard overview with charts | 0.5 day |
| Calendar/appointments CRUD | 0.5 day |
| Settings page (profile, invoice defaults, payment) | 0.5 day |
| File manager page | 0.25 day |

### Phase 8: Testing + Deploy (2 days)

| Task | Time |
|------|------|
| Unit tests (composables, utils) | 0.5 day |
| Integration tests (API routes) | 0.5 day |
| Deploy to Vercel with environment variables | 0.5 day |
| Custom domain + SSL | 0.25 day |
| Backup strategy (Supabase daily backup + Storage) | 0.25 day |

### Total: ~19 days

---

## 9. Key Architecture Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Nuxt 3 (latest) | Keeps Vue 3, hybrid SSR/SPA, Nitro backend |
| Dashboard rendering | Client-side only (`ssr: false`) | No SEO needed, faster SPA navigation |
| Public pages rendering | SSR / Prerender | SEO for portfolio, store, blog |
| Database | Supabase (Postgres) | Managed, realtime, RLS, no server |
| Auth | Supabase Auth + RBAC via JWT claims | One provider for admin + client auth |
| UI library | Nuxt UI v4 | 120+ components, matches Nuxt ecosystem |
| Payments | Stripe | Checkout, webhooks, subscription support |
| Email | Resend + Vue Email | Component-based email, Nuxt-native |
| Files | Supabase Storage | S3-compatible, RLS integrated |
| State | Pinia | Official Nuxt recommendation |
| Selling storefront | Built-in dashboard products â†’ public store | No third-party platform needed |
| Client portal | Nuxt pages under `/portal` | Shared codebase with dashboard |
| Deployment | Vercel | Zero config for Nuxt, serverless, auto HTTPS |
| CI/CD | GitHub Actions â†’ Vercel | Auto-deploy on push to main |

---

---

## 10. Security â€” Bulletproof Architecture

> **Full security content moved to [`extras/security_plan.md`](./security_plan.md)**  
> This section now contains only the summary and threat matrix.

---

---

### Threat Matrix (see security_plan.md for full details)

| Threat | Severity | Defense |
|--------|----------|---------|
| SQL Injection | 🔴 Critical | ORM + parameterized queries + WAF |
| XSS | 🔴 Critical | CSP + DOMPurify + output encoding |
| Auth bypass | 🔴 Critical | MFA + session rotation + rate limiting |
| Broken access | 🔴 Critical | RLS + policies + middleware |
| Data breach | 🔴 Critical | Encryption + audit trail + backups |
| Brute force | 🟡 High | Rate limiting + lockout + MFA |
| CSRF | 🟡 High | CSRF tokens + SameSite cookies |
| File malware | 🟡 High | ClamAV + magic bytes + validation |
| DDoS | 🟡 High | Cloudflare + rate limiting |
| SSRF | 🟡 High | Outbound allowlist + URL validation |

---

*Generated: 2026-06-09*