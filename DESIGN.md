# BusBooking.vn Design System

## 1. Atmosphere & Identity

BusBooking.vn should feel like a calm, capable local travel desk: warm, direct, and easy to trust. The visual signature is the **route ribbon**, a deep jade line that connects departure and destination and reappears in search, results, and tickets. The interface stays quiet around the travel content so a user can answer three questions quickly: where, when, and which bus.

The system adapts the photography-first hierarchy and clear booking controls of modern travel marketplaces to intercity coach travel in Vietnam. It does not copy brand assets or copy. Deep jade is the single product action color; red appears only for errors and destructive actions.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|---|---|---|---|---|
| Surface/primary | `--background` | `oklch(0.985 0.006 78)` | `oklch(0.16 0.012 48)` | Page canvas |
| Surface/secondary | `--muted` | `oklch(0.958 0.012 78)` | `oklch(0.22 0.012 48)` | Quiet sections and controls |
| Surface/elevated | `--surface` | `oklch(0.995 0.003 78)` | `oklch(0.205 0.012 48)` | Search, cards, menus |
| Text/primary | `--foreground` | `oklch(0.20 0.018 45)` | `oklch(0.965 0.006 78)` | Headlines and body |
| Text/secondary | `--muted-foreground` | `oklch(0.46 0.018 50)` | `oklch(0.72 0.012 70)` | Supporting copy |
| Text/tertiary | `--text-subtle` | `oklch(0.51 0.014 55)` | `oklch(0.68 0.012 70)` | Hints and metadata |
| Border/default | `--border` | `oklch(0.88 0.012 72)` | `oklch(0.34 0.012 48)` | Dividers and inputs |
| Border/strong | `--border-strong` | `oklch(0.67 0.018 68)` | `oklch(0.57 0.014 55)` | Inputs, hover and selected outlines |
| Action/primary | `--primary` | `oklch(0.51 0.14 158)` | `oklch(0.72 0.13 158)` | Search, select, book, links |
| Action/hover | `--primary-dark` | `oklch(0.43 0.13 158)` | `oklch(0.80 0.11 158)` | Hover and pressed action |
| Action/soft | `--primary-light` | `oklch(0.91 0.055 158)` | `oklch(0.30 0.065 158)` | Selected backgrounds |
| Trust/success | `--status-success` | `oklch(0.49 0.12 164)` | `oklch(0.70 0.13 164)` | Security, confirmed states |
| Status/warning | `--status-warning` | `oklch(0.62 0.15 65)` | `oklch(0.76 0.14 70)` | Low seats, cautions |
| Status/error | `--destructive` | `oklch(0.56 0.21 27)` | `oklch(0.68 0.20 27)` | Validation and destructive actions |

### Rules

- Deep jade is reserved for actions, selected route states, trust cues, and the route ribbon.
- Red is reserved for errors and destructive actions, never brand decoration.
- Hero text uses warm white; avoid pure black and blue-gray neutrals.
- Operator colors are external data and may appear only inside operator identity marks.

## 3. Typography

### Scale

| Level | Size | Weight | Line height | Tracking | Usage |
|---|---|---|---|---|---|
| Display | `clamp(2.75rem, 7vw, 5.5rem)` | 750 | 0.98 | `-0.045em` | Home hero only |
| H1 | `clamp(2rem, 4vw, 3.5rem)` | 700 | 1.05 | `-0.035em` | Page titles |
| H2 | `clamp(1.625rem, 3vw, 2.25rem)` | 700 | 1.15 | `-0.025em` | Main sections |
| H3 | `1.25rem` | 650 | 1.25 | `-0.015em` | Cards and subsections |
| Body/lg | `1.125rem` | 450 | 1.55 | `-0.005em` | Lead copy |
| Body | `1rem` | 450 | 1.55 | `0` | Default copy |
| Body/sm | `0.875rem` | 450 | 1.45 | `0` | Secondary information |
| Caption | `0.75rem` | 600 | 1.35 | `0.02em` | Compact labels and metadata |

### Font Stack

- Primary: `var(--font-manrope), ui-sans-serif, system-ui, sans-serif`
- Mono/numerals: `var(--font-geist-mono), ui-monospace, monospace`

### Rules

- Headlines use balanced wrapping; body copy uses pretty wrapping.
- Price and time values use tabular figures.
- Body text is never below 14px; 12px is reserved for metadata.
- Sentence case is the default. Avoid shouting labels in all caps.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a 4px base.

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight icon/label gap |
| `--space-2` | 8px | Compact groups |
| `--space-3` | 12px | Field internals |
| `--space-4` | 16px | Mobile gutters and card internals |
| `--space-5` | 20px | Comfortable content groups |
| `--space-6` | 24px | Default card padding |
| `--space-8` | 32px | Section inner separation |
| `--space-10` | 40px | Page groups |
| `--space-12` | 48px | Mobile section rhythm |
| `--space-16` | 64px | Desktop section rhythm |
| `--space-20` | 80px | Major desktop break |

### Grid

- Primary content width: 1200px; reading and form width: 960px.
- Desktop: 12 columns, 24px gutters. Mobile: one column, 16px edge padding.
- Breakpoints follow Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
- The booking task remains visible in the first viewport at 375px and 1280px.

## 5. Components

### Primary Button

- **Structure**: icon optional, concise label, 48px default height.
- **Variants**: primary jade, neutral outline, quiet ghost, destructive.
- **States**: hover darkens; active translates 1px and scales to 0.98; focus has a visible 3px ring; disabled stays legible.
- **Accessibility**: 44px minimum target; icon-only buttons have accessible names.
- **Motion**: 150ms transform/color transition.

### Surface Card

- **Structure**: semantic content container with optional header/body/footer.
- **Variants**: flat content card, outlined control card, elevated booking card.
- **Spacing**: 16px mobile, 24px desktop.
- **States**: only interactive cards lift or strengthen their outline.
- **Accessibility**: a clickable card exposes a single clear link/button target.

### Search Composer

- **Structure**: trip type, departure, destination, date(s), primary search action.
- **Variants**: one-way and return.
- **States**: default, focused segment, invalid same-city, loading, disabled action.
- **Accessibility**: visible labels, native date controls, keyboard-operable city menus.
- **Motion**: focus and mode changes only; no decorative entrance loop.

### Route Card

- **Structure**: contextual destination field (photography when available, editorial route code otherwise), route ribbon, duration/direct metadata, starting price, clear affordance.
- **States**: hover reveals directional emphasis, active presses, focus outlines the whole action.
- **Accessibility**: rendered as a button or link; destination pair is the accessible name.

### Navigation

- **Structure**: brand, primary routes, theme control, account action, mobile sheet.
- **States**: current route has a jade indicator and stronger text.
- **Accessibility**: skip link, named navigation landmarks, 44px touch targets.

### Empty/Error State

- **Structure**: meaningful icon, direct heading, recovery copy, one primary action.
- **Accessibility**: errors use `role="alert"`; copy never relies on color alone.

### Auth Shell

- **Structure**: scenic travel context on desktop, focused account form surface, concise account benefits.
- **Variants**: sign in and create account.
- **States**: loading submit, inline error, valid native form controls.
- **Accessibility**: form remains first and complete on mobile; decorative context never blocks completion.

### Operator Workspace

- **Structure**: compact workspace navigation, operational headline, date context, and one task surface at a time.
- **Variants**: overview, trip dispatch, booking/check-in desk, fleet/commercial management, network records, people/access, finance/communications, and schema registry.
- **States**: current section, filtered and paginated list, selected trip, editor sheet, destructive confirmation, seat-layout preview, mutation pending/success/error, successful check-in, and empty search result.
- **Responsive**: navigation becomes a horizontally scrollable task rail below 768px; data rows become stacked cards rather than squeezed tables.
- **Accessibility**: section controls expose `aria-pressed`; every status includes text; dense rows preserve 44px actions and logical keyboard order.
- **Dark surfaces**: operator panels always use `card`, `muted`, and `surface` tokens. Large `foreground/background` inversions are prohibited because they create white islands in dark mode.

### Operator Management Form

- **Structure**: shadcn Sheet or Dialog, visible Label, shadcn Input/Select/Textarea controls, inline Alert, and explicit cancel/save footer.
- **Behavior**: mock mutations preserve stable IDs, append an audit record, expose pending state, and return typed business conflicts.
- **Responsive**: editors use the full mobile width and a constrained scrollable sheet on larger screens; management rows stack before 768px.
- **Safety**: deletes and refunds require a shadcn confirmation surface; destructive actions remain red and textual.

### Operational Metric

- **Structure**: descriptive label, tabular value, contextual delta, and a restrained icon tile.
- **Variants**: neutral, positive, warning, and critical context without changing the metric anatomy.
- **Accessibility**: color is supportive only; the label and delta explain the state in plain language.

### Operational Row

- **Structure**: primary identity, secondary metadata, status badge, progress where relevant, and one clear next action.
- **States**: default, selected, filtered-out, and completed action.
- **Responsive**: preserves information priority on mobile; secondary metadata may wrap but is never clipped.

### Data Registry

- **Structure**: shadcn tabs separate network, access, and activity data; every record uses the shared shadcn Card and Badge primitives.
- **States**: current registry tab, active/inactive records, payment and notification status, and empty collections.
- **Responsive**: tabs scroll horizontally on mobile; record grids collapse to one column without turning into compressed tables.
- **Accessibility**: native tab semantics come from the shadcn/Radix primitive; statuses always include text and records preserve reading order.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---|---|---|
| Micro | 120-160ms | `ease-out` | Press and focus feedback |
| Standard | 220-280ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Menus, sheets, card emphasis |
| Emphasis | 420ms | `cubic-bezier(0.16, 1, 0.3, 1)` | One-time hero/search reveal |

- Animate only `transform`, `opacity`, and color/shadow changes.
- No looping decorative map, pulse, or dashed-line animations.
- Respect `prefers-reduced-motion` and reduced transparency.
- Motion must signal an action, state, or hierarchy change.

## 7. Depth & Surface

Strategy: **mixed, restrained**.

| Level | Value | Usage |
|---|---|---|
| Flat | no shadow | Route cards and content lists |
| Subtle | `0 1px 2px rgb(68 44 30 / 0.06)` | Resting controls |
| Default | `0 12px 30px rgb(68 44 30 / 0.10)` | Search composer and menus |
| Prominent | `0 24px 70px rgb(30 20 14 / 0.18)` | Hero-overlap surface |

- Shadows share a warm-brown light model.
- Cards do not combine a strong border with a strong shadow.
- Photography supplies depth on discovery surfaces.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text and controls.
- Every interactive element has a visible keyboard focus state and at least a 44px touch target.
- Include a skip-to-content link and semantic landmarks.
- Preserve native date input semantics and full keyboard navigation.
- Respect reduced motion, reduced transparency, and color-scheme preferences.
- Vietnamese names must wrap naturally without clipping or losing diacritics.

### Inclusive Personas

- A traveler on a bright, low-end mobile device with one hand and a weak connection.
- A keyboard or screen-reader user completing the same booking flow.
- A tourist unfamiliar with Vietnamese geography who needs route context and clear recovery.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
|---|---|---|---|
| Legal content routes are not yet implemented | Footer | Product content is outside this UI pass; links must not pretend to navigate | Add real routes before public launch |
| Operator identity colors come from fixture data | Results and tickets | They are domain content rather than design-system colors | Validate contrast when operators become API data |
| Operator workspace uses a typed in-memory repository seeded by fixtures | `/operator` | Backend endpoints are not available; query/mutation commands mirror schema domains and reset on refresh | Replace the provider commands with parsed API responses when endpoints ship |
| Operator access is client-gated by a mock role | `/operator` | The demo operator session is stored on-device and is forgeable | Add a verified HttpOnly session plus server-side `role_id` and `operator_id` authorization before real data is connected |

### Backend Integration Contract

- `getOperatorDashboard` remains the serializable seed seam for the operator page; replace its fixture return with a parsed API response without changing component props.
- `OperatorProvider` owns client-scoped mock commands for CRUD, scheduling, refunds, reconciliation, notification retry, and audit creation. Replace command bodies with authenticated API calls while keeping their typed results.
- `checkInOperatorBooking` remains the passenger check-in seam and returns a typed success/failure union so loading, failure, and completed UI states remain stable when HTTP replaces the fixture.
- `bookings.booking_code` maps to customer `Booking.bookingRef` and operator `OperatorBooking.bookingCode`; both mock flows use the `BB-` prefix.
- Operator data must be scoped on the server by the authenticated user's `role_id` and `operator_id`. Hiding the route or using `noindex` is not authorization.
- All names, phone numbers, vehicle plates, and booking codes in `operator-dashboard.ts` are synthetic demo values.

### Schema Coverage

| Schema table | UI surface |
|---|---|
| `roles` | Data registry → Access → Roles |
| `users` | Data registry → Access → Operator users |
| `operators` | Header identity and Data registry → Network → Operator profile |
| `administrative_areas` | Data registry → Network → Administrative areas |
| `locations` | Data registry → Network → Locations |
| `routes` | Data registry → Network → Routes |
| `route_stops` | Ordered stop sequence inside each route card |
| `vehicles` | Fleet & offers → Vehicles |
| `trips` | Trip operations and overview departures |
| `seat_inventories` | Data registry → Activity → Seat inventory |
| `bookings` | Bookings & check-in |
| `payments` | Booking payment badge and Data registry → Activity → Payments |
| `passenger_checkins` | Persistent checked-in state behind `checkInOperatorBooking` |
| `promotions` | Fleet & offers → Promotions |
| `booking_promotions` | Data registry → Activity → Promotion applications |
| `notifications` | Action banner and Data registry → Activity → Notifications |
| `reviews` | Fleet rating and Data registry → Activity → Recent reviews |
| `audit_logs` | Data registry → Activity → Audit log |
