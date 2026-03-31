

# Add Navigation Buttons to Header

## Approach
Update the shared `Header` component to accept optional navigation props and render a Home button and/or Back button alongside the YAMM logo.

## Navigation Logic by Page

| Page | Home Button | Back Button |
|------|------------|-------------|
| `/` (Index) | No | No |
| `/checklist` | Yes (→ `/`) | No |
| `/results` | Yes (→ `/`) | Yes (→ `/checklist`) |
| `/email-capture` | Yes (→ `/`) | Yes (→ `/results`) |
| `/workshop-signup` | Yes (→ `/`) | Yes (→ `/results`) |
| `/privacy` | Yes (→ `/`) | No |
| `NotFound` | Yes (→ `/`) | No |

## Changes

### 1. `src/components/Header.tsx`
- Add optional `showHome` and `backTo` props
- Render a Home icon-button (links to `/`) on the right side when `showHome` is true
- Render a Back arrow button with label when `backTo` is provided
- Use `react-router-dom`'s `useNavigate` for navigation
- Use `Home` and `ArrowLeft` icons from lucide-react

### 2. Update each page's `<Header />` usage
- `Index.tsx`: `<Header />` (no nav buttons)
- `Checklist.tsx`: `<Header showHome />`
- `Results.tsx`: `<Header showHome backTo="/checklist" />`
- `EmailCapture.tsx`: `<Header showHome backTo="/results" />`
- `WorkshopSignup.tsx`: `<Header showHome backTo="/results" />`
- `Privacy.tsx`: `<Header showHome />`
- `NotFound.tsx`: `<Header showHome />`

