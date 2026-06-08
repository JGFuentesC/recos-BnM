---
name: Kinetic Cinema
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e6beb2'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ad897e'
  outline-variant: '#5c4037'
  surface-tint: '#ffb59e'
  primary: '#ffb59e'
  on-primary: '#5e1700'
  primary-container: '#ff571a'
  on-primary-container: '#521300'
  inverse-primary: '#ae3200'
  secondary: '#dcb8ff'
  on-secondary: '#480081'
  secondary-container: '#7701d0'
  on-secondary-container: '#dcb7ff'
  tertiary: '#a5c8ff'
  on-tertiary: '#00315e'
  tertiary-container: '#2492ff'
  on-tertiary-container: '#002a53'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#852400'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dcb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6700b5'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a5c8ff'
  on-tertiary-fixed: '#001c3a'
  on-tertiary-fixed-variant: '#004785'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
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
  xs: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-padding: 20px
  card-gap: 12px
---

## Brand & Style
The design system is engineered for high-velocity visual discovery, capturing the excitement of finding the next great story. The brand personality is **energetic, intuitive, and premium**, utilizing a "Cinematic Minimalist" aesthetic. 

The experience is centered around the "Moment of Discovery"—the instant a user matches with a book or film. To facilitate this, the UI recedes into the background, using deep blacks and heavy glassmorphism to let content imagery pop. Motion and depth are used to signify progress, while bold accents provide a "spark" of energy against the dark canvas. The target audience values speed, curation, and a high-end digital feel.

## Colors
The palette is rooted in a **Pure Black (#000000)** and **Deep Charcoal (#0A0A0A)** foundation to maximize OLED contrast and mimic a theater environment. 

- **Flame Orange (Primary):** A high-vibrancy accent used for the "Match" action and critical conversion points. It represents the heat of discovery.
- **Electric Violet (Secondary):** Used for "Watch/Read" calls to action and secondary functional highlights, providing a digital, neon-tinged contrast to the orange.
- **Glass Layers:** Instead of traditional grays, this design system uses varying opacities of white overlays on black to create a "Frosted Obsidian" effect.

## Typography
The system uses **Inter** for its exceptional readability at small sizes and its neutral, modern character that doesn't compete with movie posters or book covers. For technical metadata and labels, **Geist** is introduced to provide a sharp, monospaced-adjacent feel that emphasizes the "Discovery Engine" aspect of the app.

Headlines should use tight letter-spacing and heavy weights to create a "poster" feel. Body text maintains a generous line height (1.6) to ensure synopsis text remains legible during quick browsing sessions.

## Layout & Spacing
The layout follows a **Fluid Content Model** optimized for one-handed swiping.
- **The Discovery Stack:** A centralized card system with 20px side margins. Cards should occupy roughly 80% of the vertical viewport height.
- **Grid:** For library and search views, use a 2-column masonry or fixed-aspect-ratio grid with 12px spacing (card-gap).
- **Safe Areas:** Interactive elements (Swipe buttons) must reside within the bottom 30% of the screen for ergonomic ease.

## Elevation & Depth
This design system rejects traditional drop shadows in favor of **Tonal Stacking and Glassmorphism**.
- **Level 0 (Background):** Pure Black (#000000).
- **Level 1 (Cards):** Deep Charcoal with a 1px interior border (rgba 255, 255, 255, 0.08).
- **Level 2 (Overlays/Modals):** Backdrop Blur (20px) with a semi-transparent fill (rgba 0, 0, 0, 0.7).
- **Z-Index Strategy:** Swiped cards utilize a slight scale-down and opacity fade to indicate they are moving "behind" the active card in 3D space.

## Shapes
The shape language is **distinctly rounded** to evoke a friendly, tactile feel.
- **Content Cards:** Use `rounded-xl` (24px on mobile) to create a soft, "handheld" aesthetic.
- **Action Buttons:** Large actions (Like/Dislike) are fully circular (pill-shaped).
- **Input Fields/Chips:** Use `rounded-lg` (16px) to maintain consistency without becoming fully circular.

## Components
- **Discovery Cards:** The primary component. Must feature a high-resolution image background with a bottom-aligned gradient (Black to Transparent) to house typography. 
- **The "Match" Button:** A high-gloss, gradient-filled button using the Flame Orange palette. On hover or press, it should emit a subtle outer glow of the same color.
- **Glass Chips:** Categorical tags (e.g., "Sci-Fi", "Bestseller") use a blurred glass background with white high-contrast text.
- **Control Bar:** A floating bottom navigation bar using a 32px backdrop blur and a thin top stroke. 
- **Selection Indicators:** Checkboxes and radio buttons should use the Electric Violet secondary color to distinguish from the primary "Match" flow.
- **Dynamic Progress Bar:** A thin (2px) line at the top of the viewport indicating how many items remain in the daily discovery stack, using the primary orange gradient.