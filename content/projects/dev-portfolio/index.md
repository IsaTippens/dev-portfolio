---
title: Dev Portfolio
description: The device you are holding — a SvelteKit portfolio built to read as one piece of hardware rather than a page with widgets on it.
date: 2026-09-17
published: true
status: ACTIVE
stack: [SvelteKit 2, Svelte 5, Tailwind, mdsvex, anime.js]
link: github.com/IsaTippens/dev-portfolio
---

Live at [isatippens.com](https://isatippens.com).

## What it is

A single-page-per-route portfolio with a Teenage Engineering-inspired industrial
aesthetic. The whole site is one device: a chassis, a top status bar, a portrait engine,
a tape-deck social interface, and instruments that report real state — scroll position,
battery level, frame rate.

## Notes on the build

- **Svelte 5 runes** throughout, with `mdsvex` rendering the blog from markdown in-repo.
- **One token layer.** Every colour, radius and stroke is a custom property, which is what
  makes four faceplates (LIGHT, DARK, PHOSPHOR, GAMEBOY) a pure token swap.
- **Motion has a vocabulary.** Stepped, quantised, mechanical: a shared module defines the
  curves and durations, and nothing overshoots except a physical knob.
- **Scroll is a readout, not a trigger.** The Cape Peninsula route line, the tape counter
  and the portrait engine's display modes are position-mapped, so scrubbing backwards runs
  them backwards.
