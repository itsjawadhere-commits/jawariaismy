// Photos for the "Kept, Not Taken" section (app/components/ReservedFrames.tsx).
//
// `alt` is a placeholder for each slot — please replace these with a real,
// short description of what's actually in each photo (e.g. "Jawaria laughing
// on the rooftop, October 2025"). Screen reader users rely on this text
// since it's the only way they'll know what these photos show; empty alt
// text here would make this whole section invisible to them.

export const RESERVED_FRAMES = Array.from({ length: 15 }, (_, i) => ({
  image: `/images/${i + 1}.jpeg`,
  alt: `A kept photo, ${i + 1} of 15 — replace with a real description`,
}));
