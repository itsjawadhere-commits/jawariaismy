# 31 March | Jawaria — Next.js 15 Migration

A 1:1 migration of the original single-file HTML page into Next.js 15 (App Router,
TypeScript, Tailwind CSS), kept on a single route (`/`).

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (verified clean — single static "/" route)
npm run start
```

### Audio file

The original page referenced `Audio%20Note.mp4` as a relative file next to the HTML.
That binary wasn't part of the uploaded source, so drop your file at:

```
public/Audio Note.mp4
```

The `AudioPlayer` component already points at `/Audio%20Note.mp4`.

## Folder structure

```
app/
  layout.tsx              Root layout: fonts, <CustomCursor/>, .grain overlay, <ScrollThread/>
  page.tsx                Single route "/" — assembles every section in original order
  globals.css             All former inline <style> CSS, ported 1:1 (vars, keyframes,
                           component classes, responsive breakpoints), plus Tailwind directives
  components/
    MainContent.tsx        Client: body overflow + fade-in (#main-content / .content-visible)
    RevealObserver.tsx     Client: IntersectionObserver for .reveal and .trait-item (blur-focus)
    CustomCursor.tsx        Client: custom dot cursor + hover-grow + tab-title-on-blur
    ScrollThread.tsx        Client: left-edge scroll progress line
    Hero.tsx                 Client: PKT greeting, name-scramble effect, March 31 countdown
    DaysSince.tsx             Client: days since Oct 6, 2025 counter
    Timeline.tsx              Reusable timeline (used for "The Phases" and "Things I wanna do")
    ThingsToDoTimeline.tsx    Wraps Timeline with its content
    MoonSection.tsx            Static "October 6" section
    MoodCheck.tsx              Client: mood buttons -> response text
    OddsSection.tsx             Static "The Odds" section
    ObservationsSection.tsx     Static trait items (blur-focus via RevealObserver)
    ScatteredNotes.tsx           Client: positioned/staggered note reveal
    ScratchCard.tsx               Client: canvas scratch-to-reveal
    ReasonsGenerator.tsx          Client: random "why I love you" generator
    PromiseJar.tsx                  Client: one-promise-per-day jar (localStorage)
    HoldToReveal.tsx                 Client: press-and-hold progress reveal
    Constellation.tsx                Client: click-to-connect star canvas
    AudioPlayer.tsx                   Client: custom play/pause + progress + time
    ReservedFrames.tsx                 Client: tap-to-upload polaroids (localStorage, compressed)
    SealedEnvelope.tsx                  Client: time-gated letter (auto-unlocks May 7 2026 3PM PKT,
                                         supports ?preview=1)
    DaysMet.tsx                          Client: "days since we met" counter (hidden until May 7 2026)
    BirthdaySection.tsx                   Client: gated section, visible only March 31 (PKT)
  lib/data/
    reasons.ts               204 "why I love you" lines
    promises.ts               12 promise-jar lines
    constellationMsgs.ts     107 constellation messages
    moodResponses.ts           8 mood -> response strings
    scatteredNotes.ts         20 scattered notes + their layout positions
```

## Notes on the migration

- **Dead code removed**: `#open-envelope-btn` and the `.orbit` / `.planet` / `.map-svg-wrap`
  CSS rules existed in the original `<style>` block but had no corresponding markup or JS
  usage anywhere in the page — they were unreachable and have been dropped from the React
  output (the unused `.urdu` CSS class was kept in `globals.css` for parity, since requirement
  #3 asks to preserve styling, but it's likewise not rendered by any component since the
  original HTML never used it either).
- **Behavior preserved exactly**: countdown math, PKT-timezone greeting/birthday-gate logic,
  the scramble effect, scratch-canvas drawing, constellation star/line math, promise-jar
  daily-lock logic, and the May 7 2026 envelope/days-met gating all use the same formulas,
  thresholds, and `localStorage` keys as the original inline `<script>`.
- **Styling**: all inline CSS was moved into `app/globals.css` as the source of truth (CSS
  variables, keyframes, and every component class), since the page's look depends on dozens of
  highly specific selectors that don't map cleanly to utility classes without a redesign.
  Tailwind is wired up and available for any new styling, per the requirement to use it, while
  `globals.css` keeps the exact existing appearance intact.
- **Single route**: everything lives under `app/page.tsx` → `/`. No new routes were created.
