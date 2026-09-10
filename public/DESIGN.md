---
name: Heritage Editorial
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d8d2'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2eb'
  surface-container: '#f5ece5'
  surface-container-high: '#f0e7df'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#444748'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe8'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdb'
  on-secondary-container: '#63635f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#410004'
  on-tertiary-container: '#d95b56'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e4e2dd'
  secondary-fixed-dim: '#c8c6c2'
  on-secondary-fixed: '#1b1c19'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#871f20'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '400'
    lineHeight: 92px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 72px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  title-lg:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 32px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-md:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  caption:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is anchored in the intersection of traditional Indian textile artistry and contemporary high-fashion editorial. It avoids the cluttered, hyper-ornamental tropes of the wedding industry, instead opting for a **Modern Indian Heritage** aesthetic. The goal is to evoke a sense of quiet luxury, archival permanence, and curated elegance.

The design style is **Minimalist / Editorial**. It prioritizes extreme whitespace, intentional asymmetry, and high-quality imagery over decorative UI elements. The interface should feel like a premium coffee-table book: tactile, spacious, and sophisticated. Every interaction should feel deliberate and calm, moving away from high-pressure e-commerce tactics toward a gallery-like experience.

## Colors

The palette is rooted in the natural tones of raw silk and unbleached cotton, contrasted against deep inks and heritage accents.

- **Primary (Near-Black):** Used for typography and structural lines. It provides the grounding force for the editorial look.
- **Secondary (Warm Ivory):** The primary canvas color. It is softer than pure white, providing a tactile, "paper-like" quality that feels premium and warm.
- **Tertiary (Deep Maroon):** Used sparingly as a signal of heritage and luxury. It appears in high-value actions or subtle brand markers.
- **Neutral (Warm Brown):** Used for secondary text, metadata, and borders to maintain a soft, low-contrast visual hierarchy that doesn't compete with the imagery.
- **Accent (Antique Gold - Optional):** Reserved for microscopic details like icons or special edition labels, strictly used in a non-metallic, flat matte representation (#C5A059).

## Typography

Typography is the primary vehicle for the "editorial" feel. It relies on the dramatic contrast between the high-stroke-variance of the serif and the clean, rhythmic spacing of the sans-serif.

- **Headlines:** Use Playfair Display. For large display sizes, use tight letter spacing to emphasize the elegant ligatures. 
- **Body Text:** Use Montserrat with a light weight (300) for long-form descriptions to maintain a sense of airiness. 
- **Navigation & Labels:** Always use Montserrat in uppercase with generous letter spacing (0.05em to 0.1em) to denote "luxury navigation."
- **Scale:** Maintain a strict hierarchy. If a display heading is used, the surrounding elements must recede significantly in size to preserve the "hero" status of the text.

## Layout & Spacing

This design system employs a **Fixed Grid** on desktop and a **Fluid Grid** on mobile. The philosophy is "breathable composition."

- **Desktop:** A 12-column grid with a wide margin (80px) to simulate the borders of a high-end magazine page.
- **Section Gaps:** Use large vertical spacing (120px+) between sections to allow the user to focus on one "story" at a time.
- **Asymmetry:** Encourage "broken" grid layouts where images are offset from text blocks. For example, a portrait image might span 5 columns, while the accompanying description starts on column 7 and spans only 3.
- **Mobile:** Reflow to a single column with 20px side margins. Typography scales down aggressively to ensure the serif fonts do not wrap awkwardly.

## Elevation & Depth

To maintain the flat, editorial aesthetic, this design system avoids traditional shadows and neomorphism. Depth is achieved through **Tonal Layering** and **Structural Lines**.

- **Surface Levels:** 
  - Base: Warm Ivory (#F9F7F2).
  - Floating Layers (Modals/Menus): Near-Black (#1A1A1A) with Ivory text.
- **Structural Lines:** Use 1px solid borders in a very light neutral (#E5E2DA) to define sections without breaking the flow.
- **Interactive Depth:** When a card or image is hovered, use a subtle "scale-up" effect (1.02x) rather than a shadow. This keeps the design feeling modern and digital rather than trying to mimic physical paper shadows.

## Shapes

The shape language is **Strictly Geometric and Sharp**. 

- **Corners:** Use 0px radius for all primary UI elements (buttons, inputs, cards). Sharp corners evoke a sense of architectural precision and high-fashion formality.
- **Imagery:** Product images should always be rectangular or square. Avoid circular avatars or rounded frames. 
- **Dividers:** Use thin (1px) horizontal and vertical lines to separate navigation items or content blocks, reinforcing the grid-based magazine structure.

## Components

### Buttons
- **Primary:** Sharp-edged, solid Near-Black background with Ivory text. Uppercase Montserrat with 0.1em letter spacing.
- **Secondary:** Transparent background with a 1px Near-Black border. 
- **Interaction:** On hover, the primary button shifts to Deep Maroon; the secondary button fills with Near-Black and flips text to Ivory.

### Inputs & Forms
- Minimalist line-style inputs. Only a bottom border (1px) in Warm Brown.
- Labels sit above the line in small, uppercase Montserrat.
- Error states use a muted version of the Tertiary color, never a bright "system red."

### Cards & Product Listings
- Images are the hero. Use a 4:5 aspect ratio (editorial standard).
- Text (Title and Price) is center-aligned below the image.
- Price should be displayed in Montserrat (Sans) to look modern and functional, while Product Titles are in Playfair Display (Serif).

### The "Sari Detail" Component
- A unique component used on product pages: a high-resolution, full-width "zoom" strip that allows users to see the weave texture without clicking, mimicking the tactile experience of feeling the fabric.

### Navigation
- Global Nav: Centered logo with split links (left/right) or a hidden "Mega Menu" triggered by a minimalist "Menu" text label instead of a hamburger icon.