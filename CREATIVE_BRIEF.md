# Creative brief

Status: **Locked**  
Project: Stef Bracke portfolio redesign  
Branch: `redesign-v2`

This document is the decision filter for the redesign. New ideas should support
it directly. An idea that looks impressive but conflicts with the brief does
not belong on the site.

## Purpose

Present Stef Bracke as a technical artist and showcase his work through
extensive, well-structured documentation. The site should make both the final
result and the thinking, tools, process, and technical decisions behind it easy
to understand.

## Audience

- Recruiters and hiring teams evaluating role fit and capability quickly.
- Industry professionals assessing craft, process, and technical depth.
- Colleagues and friends exploring the work in greater detail.

The first reading layer must work for a fast professional review. Deeper layers
may provide extensive documentation without making the overview harder to scan.

## Tone

Professional, technical, and tasteful. The site should feel confident and
precise without becoming corporate, sterile, or theatrical.

## Visual principles

- Clear hierarchy and direct navigation.
- Snappy presentation with deliberate pacing.
- Strong readability at every level of detail.
- A restrained dark, blue, and orange visual system.
- A distinctive WebGL element that supports the work and identity instead of
  competing with them.
- Visual effects must have a clear purpose and remain secondary to content.

## Interaction philosophy

Interaction should reward curiosity without being required for navigation or
comprehension. Selected elements may respond to mouse movement, hover, or drag.
Their exact behavior will be defined later, one module at a time.

Every interaction must:

- Preserve an obvious path through the site.
- Respond immediately and feel intentional.
- Work without blocking access to content.
- Have an accessible and touch-friendly alternative where applicable.
- Degrade gracefully when motion is reduced or WebGL is unavailable.

## Anti-goals

The site must not be:

- Bloated with unnecessary content, dependencies, effects, or controls.
- Slow to load or sluggish to use.
- Difficult to navigate.
- Difficult to read or scan.
- Dependent on an interaction effect to communicate essential information.

## Decision test

Before adding a feature or visual treatment, ask:

1. Does it help present Stef or explain the work?
2. Is it clear on first use?
3. Does it preserve speed and readability?
4. Does it feel technical and tasteful rather than decorative?
5. Can it fail or disappear without breaking the experience?

If the answer to any of these is no, revise or reject it.
