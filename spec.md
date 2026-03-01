# RePlate — Leftovers → Lifesavers

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full-stack Food Recycling & Redistribution Platform
- Four user roles: Event Host, NGO/Orphanage, Volunteer, Admin
- Landing page with impact counter animation, how-it-works section, about, blog teasers
- Auth flow: Register/Login with role selection (host, ngo, volunteer)
- Event Host dashboard: Post leftover food (name, quantity, unit, veg/non-veg, cooked time, expiry, pickup location text, notes), view own listings, track status
- NGO dashboard: Post food requirement (type, quantity, urgency, number of people), browse available food listings, accept offers, confirm received
- Volunteer dashboard: View open pickup tasks, accept task, update status (Picked Up / On the Way / Delivered)
- Admin panel: KPI cards (total food saved kg, NGOs served, volunteers active, deliveries completed), user management table, food listing moderation, delivery activity log
- Contact page with mobile 9322653593 and email aaryanhule1@gmail.com
- About page, How It Works page, Privacy Policy, Terms & Conditions pages
- Blog section (Food Waste Awareness) with static articles
- Dark/Light mode toggle
- Fully responsive, Gen-Z modern UI with soft gradients, rounded cards, micro animations

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Select authorization and blob-storage Caffeine components
2. Generate Motoko backend with actors for: users/profiles, food listings, food requests, deliveries, notifications; with role-based data access
3. Generate branding hero image
4. Build frontend:
   - App shell with navigation, dark/light toggle, role-based routing
   - Landing page: hero, impact counters, how-it-works, testimonials, CTA
   - Auth pages: register (with role picker), login
   - Host dashboard: post food form, my listings list with status badges
   - NGO dashboard: post requirement form, browse listings, my requests
   - Volunteer dashboard: open tasks list, task detail with status update buttons
   - Admin panel: KPI cards, charts (bar/line via recharts), user table, food moderation, delivery log
   - About, How It Works, Blog, Contact, Privacy Policy, Terms pages
5. Wire backend calls throughout the frontend
6. Deploy
