# Uncodixify Rules

This project adopts an "uncodixified" UI style to avoid repetitive AI-generated patterns.

## Goal

Build interfaces that look normal, usable, and product-focused.

## Avoid

- Floating/glass cards as the default layout pattern
- Oversized rounded corners everywhere
- Heavy gradient backgrounds and decorative glows
- Badge spam and decorative labels
- Excessive shadows or layered depth for simple content

## Prefer

- Structured layouts with clear spacing rhythm
- Flat or low-contrast surfaces with light borders
- Small, purposeful radius values
- Typography-led hierarchy over decoration-led hierarchy
- Minimal motion and subtle interactions

## Practical Rules

- Keep global radii modest (around `6px` to `14px`)
- Use one background direction: plain surface + optional subtle texture
- Primary sections should read as content blocks, not floating objects
- Navigation should feel integrated with the page frame
- Buttons should be readable first, decorative second

## Project Checklist

Before shipping UI changes:

1. Remove unnecessary glow/blur/gradient effects.
2. Check if cards can become plain sections with borders.
3. Reduce radii if elements look "bubble-like."
4. Ensure type hierarchy is clear without decorative helpers.
5. Verify desktop and mobile spacing separately.
