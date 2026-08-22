# GlobeTrotter Design Brainstorm

## Approach 1

**Theme Name:** Sunlit Atlas Editorial

**Very Brief Intro:** A bright travel-journal interface that pairs crisp white space with destination colors, oversized editorial typography, and map-route details. It should feel optimistic, cultured, and easy to scan while planning a real trip.

**Probability:** 0.07

## Approach 2

**Theme Name:** Coastal Postcard Club

**Very Brief Intro:** A playful postcard-inspired system with sky blue, coral, and citrus accents, layered paper textures, stamps, and scrapbook-like trip moments. It would feel social and expressive, with a lighter community-first mood.

**Probability:** 0.04

## Approach 3

**Theme Name:** Midnight Terminal

**Very Brief Intro:** A dark, cinematic airport-lounge direction with midnight navy surfaces, luminous route lines, and warm boarding-pass accents. It would emphasize premium travel and a more nocturnal sense of adventure.

**Probability:** 0.03

# Chosen Direction: Sunlit Atlas Editorial

## Design Movement

Contemporary editorial travel design, blending **Swiss-inspired information hierarchy** with the tactile cues of a well-loved field journal and the optimism of modern destination branding.

## Core Principles

1. **White space is the runway.** Keep the interface bright and breathable so the colorful trip content has room to lead.
2. **Color carries meaning.** Use a small family of destination-inspired colors for action, place, mood, and budget states rather than decorative noise.
3. **Editorial structure over dashboard sameness.** Use asymmetric compositions, offset cards, route bands, and strong section rhythm instead of repeating uniform panels.
4. **Every detail should point outward.** Pins, coordinates, stamps, dates, and route lines should make the product feel connected to real places.

## Color Philosophy

The base is warm white and soft sand, keeping long planning sessions comfortable and visually calm. **Tangerine orange** is the ownable action color: it communicates movement, warmth, and the moment of choosing a destination. **Aqua teal** signals safe progress and budget confidence. **Sky blue** anchors maps and discovery, while **coral, mango, and leaf green** provide distinct regional and category cues. Navy is reserved for high-contrast text and occasional hero overlays, never as the dominant background.

## Layout Paradigm

Use an asymmetric editorial frame: a wide content rail with occasional offset side notes, a narrow vertical route marker, and sections that alternate between full-bleed imagery and calm white information zones. The home page should lead with a destination-led hero, then move through regional cards, recent journeys, and a clear planning action. Detail screens should use a persistent contextual rail rather than a generic centered card stack.

## Signature Elements

- A small compass-star mark paired with the GlobeTrotter wordmark.
- Curved dotted route lines and coordinate labels as recurring separators and background details.
- Passport-style micro-badges for trip status, destination count, and budget health.

## Interaction Philosophy

Interactions should feel like pinning a place in a travel journal: direct, tactile, and reassuring. Buttons respond with a short press scale and a warm color shift. Cards lift minimally and reveal more destination context. Search and filters should feel instant, with clear empty states and no ambiguous controls.

## Animation

Use 180–260ms ease-out transitions for hover, active, dropdown, and route selection states. Stagger destination cards by 40ms during initial reveal. Animate route lines with subtle opacity and stroke-dash movement only on first view or when a trip changes. Avoid continuous decorative motion. Respect reduced-motion preferences and preserve instant keyboard interactions.

## Typography System

Use **Plus Jakarta Sans** for navigation, metadata, and readable body copy. Use **DM Serif Display** sparingly for major travel headlines and destination names, giving the product an editorial travel-journal voice without sacrificing clarity. Headings should be compact and confident; labels should use modest uppercase tracking; body copy should remain at a comfortable 1.55 line height.

## Brand Essence

**GlobeTrotter is a bright, thoughtful travel planner for people who want to turn scattered ideas into an itinerary worth remembering.**

Personality adjectives: **curious, warm, capable**.

## Brand Voice

Headlines should be inviting and specific, never generic. CTAs should sound like a confident travel companion, and microcopy should reduce planning anxiety with calm, concrete guidance.

Example headline: **“Your next good story starts with a place.”**

Example CTA: **“Map out the journey”**.

## Wordmark & Logo

Build the mark around a compact compass star nested inside a rounded location pin, with a small orbit line suggesting a globe. Pair the symbol with a custom-feeling GlobeTrotter wordmark using a high-contrast serif “G” and clean sans-serif remaining letters. The mark must work independently as a favicon and inside the header.

## Signature Brand Color

**Tangerine Route — #F27A4B.** It is warm enough to feel human, vivid enough to guide action, and distinct from generic SaaS blue or purple.

## Style Decisions

- Keep the application **white-first and colorful**, not dark-first.
- Use navy only for text and high-contrast moments.
- Prefer warm editorial depth, thin route motifs, and destination imagery over heavy gradients or glossy 3D effects.
- Keep card corners moderately rounded and varied; do not make every surface a floating pill.

## Style Decisions

- The GlobeTrotter mark is the same compact compass-star-in-location-pin identity on every page; generic app-icon substitutes are not used.
- Route details are structural, not decorative: major pages include visible journey devices such as dotted route bands, coordinate labels, route lines, or contextual travel rails.
- Functional copy uses a calm travel-companion voice, favoring journey-oriented phrasing when it remains equally clear.
