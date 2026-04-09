# Design System: Vue App (Claude-inspired)

## 1. Visual Theme & Atmosphere

A warm, editorial reading experience inspired by Claude (Anthropic). The design evokes the feeling of high-quality paper — warm parchment tones, serif headlines for gravitas, and earth-toned accents. The opposite of cold tech aesthetics: approachable, literary, and thoughtfully composed.

---

## 2. Color Palette & Roles

### Brand & Primary
| Token | Hex | Use |
|-------|-----|-----|
| Terracotta Brand | `#c96442` | Primary CTAs, brand accents |
| Coral Accent | `#d97757` | Secondary accents, links on dark |
| Near Black | `#141413` | Primary text, dark surfaces |

### Surface & Background
| Token | Hex | Use |
|-------|-----|-----|
| Parchment | `#f5f4ed` | Primary page background |
| Ivory | `#faf9f5` | Card surfaces, elevated containers |
| Pure White | `#ffffff` | Button surfaces, max contrast |
| Warm Sand | `#e8e6dc` | Secondary button backgrounds |
| Dark Surface | `#30302e` | Dark-theme containers |
| Deep Dark | `#141413` | Dark page background |

### Neutrals & Text
| Token | Hex | Use |
|-------|-----|-----|
| Charcoal Warm | `#4d4c48` | Button text on light |
| Olive Gray | `#5e5d59` | Secondary body text |
| Stone Gray | `#87867f` | Tertiary text, footnotes |
| Dark Warm | `#3d3d3a` | Links, emphasized text |
| Warm Silver | `#b0aea5` | Text on dark surfaces |

### Borders & Rings
| Token | Hex | Use |
|-------|-----|-----|
| Border Cream | `#f0eee6` | Standard light borders |
| Border Warm | `#e8e6dc` | Section dividers |
| Border Dark | `#30302e` | Dark surface borders |
| Ring Warm | `#d1cfc5` | Button hover/focus rings |

---

## 3. Typography

### Font Families
- **Headlines**: Georgia (fallback for Anthropic Serif)
- **Body/UI**: Arial, system-ui, sans-serif (Anthropic Sans fallback)
- **Code**: SFMono-Regular, Menlo, monospace

### Scale
| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display | 64px | 500 | 1.10 |
| Section Heading | 36-52px | 500 | 1.10-1.20 |
| Sub-heading | 25-32px | 500 | 1.10-1.20 |
| Body Large | 20px | 400 | 1.60 |
| Body Standard | 16-17px | 400-500 | 1.25-1.60 |
| Caption | 14px | 400 | 1.43 |
| Label | 12px | 400-500 | 1.25-1.60 |
| Code | 15px | 400 | 1.60 |

---

## 4. Component Stylings

### Buttons
- **Warm Sand**: `#e8e6dc` bg, `#4d4c48` text, 8px radius, ring shadow
- **White Surface**: `#ffffff` bg, `#141413` text, 12px radius
- **Brand CTA (Terracotta)**: `#c96442` bg, `#faf9f5` text, 12px radius
- **Dark Charcoal**: `#30302e` bg, `#faf9f5` text, 8px radius

### Cards
- Ivory (`#faf9f5`) or White surfaces
- 1px solid Border Cream border
- 8-12px border-radius
- Whisper shadow: `rgba(0,0,0,0.05) 0px 4px 24px`
- Ring shadow: `0px 0px 0px 1px` ring patterns

### Navigation
- Sticky top nav with parchment bg + backdrop blur
- Logo in Near Black, links in Olive Gray
- Terracotta CTA button

---

## 5. Spacing & Layout

- Base unit: 8px
- Scale: 4px, 6px, 8px, 12px, 16px, 20px, 24px, 30px, 40px, 60px, 80px
- Max container: ~1200px, centered
- Section spacing: generous (60-100px between sections)

### Border Radius
| Context | Radius |
|---------|--------|
| Small inline | 4-6px |
| Buttons, cards | 8-12px |
| Featured containers | 16px |
| Hero / large cards | 24-32px |

---

## 6. Do's and Don'ts

### Do
- Parchment (`#f5f4ed`) as primary background
- Georgia serif for all headlines (weight 500)
- Terracotta only for primary CTAs
- All neutrals warm-toned — no cool blue-grays
- Ring shadows for interactive elements
- Relaxed body line-height (1.60)
- Generous border-radius (8px minimum)

### Don't
- Cool blue-grays anywhere
- Bold weights on serif headings
- Sharp corners (< 6px radius)
- Heavy drop shadows
- Pure white page background
- Monospace for non-code content
