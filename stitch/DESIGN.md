---
name: Technical Precision
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2b2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c8c5ca'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#919095'
  outline-variant: '#47464a'
  surface-tint: '#c8c6c8'
  primary: '#c8c6c8'
  on-primary: '#313032'
  primary-container: '#09090b'
  on-primary-container: '#7a787b'
  inverse-primary: '#5f5e60'
  secondary: '#c8c5ca'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#cec4c4'
  on-tertiary: '#352f2f'
  tertiary-container: '#0c0808'
  on-tertiary-container: '#7f7777'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e1e4'
  primary-fixed-dim: '#c8c6c8'
  on-primary-fixed: '#1c1b1d'
  on-primary-fixed-variant: '#474649'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#ebe0df'
  tertiary-fixed-dim: '#cec4c4'
  on-tertiary-fixed: '#1f1a1a'
  on-tertiary-fixed-variant: '#4c4545'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style
The design system is engineered for developers who require high-density information without cognitive overload. It adopts a **Minimalist / Developer-Centric** aesthetic, drawing heavily from contemporary "Shadcn-like" UI patterns. The visual language emphasizes clarity, precision, and utility, using a deep-dark canvas to reduce eye strain during prolonged debugging sessions. 

The atmosphere is professional and tool-like, avoiding unnecessary flourishes. Emotional resonance is achieved through crisp borders, functional color coding for HTTP actions, and a rigorous adherence to a monospaced information hierarchy for technical data.

## Colors
The palette is built on a "Deep Dark" foundation to prioritize content contrast. 

- **Canvas**: The primary background (`#09090b`) provides a bottomless depth.
- **Surfaces**: Secondary cards and containers (`#18181b`) sit subtly above the canvas.
- **Borders**: All UI segmentation relies on a crisp, low-contrast border (`#27272a`) rather than heavy shadows.
- **Status/Methods**: HTTP methods use standard Tailwind-inspired semantic colors to provide instant visual recognition of request types.

## Typography
This design system utilizes a dual-font approach. **Inter** handles the UI shell, navigation, and primary descriptive text, ensuring a modern and accessible interface. **JetBrains Mono** is reserved for all technical data, including URLs, JSON payloads, headers, and log timestamps, providing the necessary character alignment for debugging.

Secondary text (zinc-400) should be used for body-sm and code-sm to maintain hierarchy against the slate-50 headings.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a sidebar-main content structure. 

- **Sidebar**: Fixed width (280px) for history and navigation.
- **Main Content**: Fluid area for request details and payload inspection.
- **Rhythm**: Uses a 4px base unit. Component internal padding is typically 8px or 12px.
- **Mobile**: On smaller screens, the sidebar collapses into a sheet/drawer, and the main content switches to a single-column vertical stack.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Crisp Outlines** rather than traditional elevation.

- **Level 0 (Canvas)**: `#09090b` - The root background.
- **Level 1 (Surface)**: `#18181b` - Used for cards, sidebars, and header areas.
- **Interactive**: Elements like buttons or inputs use a `#27272a` border. 
- **Overlays**: Modals and dropdowns use a slightly more pronounced border and a 10% opacity black shadow to separate from the background.

## Shapes
The design system uses a consistent **8px (0.5rem)** corner radius for all primary components. This creates a balance between the "sharp" technical nature of a developer tool and the "soft" modern aesthetic of current web applications. 

- Small elements (tags/badges): 6px.
- Containers (cards/modals): 8px.
- Inputs/Buttons: 8px.

## Components

### Buttons
Primary buttons use a solid `#fafafa` background with `#09090b` text for high impact. Secondary buttons use a transparent background with a `#27272a` border. Ghost buttons are used for low-priority actions in toolbars.

### Input Fields
Inputs are styled with a `#18181b` background and a `#27272a` border. On focus, the border color transitions to a subtle zinc-500. For code editors or JSON inputs, use the monospaced font at 13px.

### Cards & Panels
Cards are defined by their `#18181b` background and `#27272a` border. Headers within cards should have a thin bottom border to separate the title from the body content.

### Method Badges
Small, high-contrast badges used to denote HTTP methods. They use a low-opacity background of the semantic color (e.g., Green at 10%) with a solid 1px border and bold text in the same hue.

### Lists (History)
Items in the history list should use a hover state of `#18181b`. Active items use a subtle left-accent border of 2px using the primary accent color.