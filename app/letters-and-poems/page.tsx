import EnvelopeCard, { EnvelopeItem } from '../components/EnvelopeCard';
import MainContent from '../components/MainContent';
import RevealObserver from '../components/RevealObserver';

const items: EnvelopeItem[] = [
  {
    id: 'letter-001',
    type: 'letter',
    title: 'the letter i wrote before we met',
    date: 'february 2026',
    content: `Alright, one thing is confirmed, by the time you'll be reading this, you'd be sitting next to me. Or maybe on my lap if you are not being shy right now. But when the fuck we are going to meet I mean I have no idea in heaven or hell. It will be the most unstable emotional kicker day for both of us. Oh, you think I'm going to act all okay and cool? I bet you, I'd be kicking my feet in the air on my way to you. But what do I get you? If I tell you right now, even giving you a hint might ruin the surprise and my future self will hate me for it. But leave all that.

Something that started on 14th august with a single text and now we're sitting into each other's presence is nothing less than a miracle of possibilities. But the possibility of "what if we never meet" exists as well. Don't kick me in the nuts if you're reading this alright, I'm just afraid to lose you that's all. I love you more than a man could love so the mixture of getting what one wants sometimes scare you off as well. But at the same time, something about this doesn't feel temporary. I've tried to doubt it, it just doesn't sit right.

It's February now and I think I should code something into the website that will count the days since October and we'll see after how many days we meet, if we meet.

Okay let's assume we are meeting today, what do I notice first thing about you? Your smile? More like blushes. Or how your almondy doe eyes change when you smile. I keep wondering what the first 5 seconds will look like. Do we just stand there like idiots or do I pull you in before my brain even catches up or or…

Being honest don't want to bore you with this letter, if you're next to me, kiss me already. (I'm jealous of my lucky future self). Bye.

<span style="font-size:0.8rem;opacity:0.45;font-style:normal;font-family:var(--mono-font);letter-spacing:0.05em;">written 95 days before we met.</span>`,
  },
  {
    id: 'poem-001',
    type: 'poem',
    title: 'in her city',
    content: `In her city, because they are fond of her,
People have named the sunsets after her. Every sunset
is named after her because they vanish one
after another into the dark; colours scattered
across the sky, gold and crimson thrown
carelessly into evening. "At least this one didn't end
too soon," someone says. And sure enough,
after a while, that same familiar glow
returns to the horizon. It's her again.
Well, how else are you to live except by devotion,
by some beautiful fiction, some little song to
hum while the inevitable, the distance, the black and
white fact that nothing stays, comes hurtling
toward you out of the deep?`,
  },
  {
    id: 'poem-002',
    type: 'poem',
    title: 'the fragrant flower',
    content: `Her eyes; brown glories at dusk,
wide open to the world,
but look closer, and you'll see it
the flicker, the ember, the wildfire waiting.

She dreams in detonations of sunset,
sees the world in spring's first bloom,
leans toward beauty like a moth to flame.

At her window, a rose droop
she smiles, knowing loveliness is a fleeting guest.
But in the distance, willows burn,
their ashes settling in the forests of her mind.
She frowns.

She loves perennial around red roses
adores what grows, what reaches,
what stretches toward light
yet she does not see, not yet.

The fire that takes,
the fire that consumes,
the fire that leaves the earth bare is hers.
And so is the rebirth.`,
  },
  // ── add more letters, poems and couplets below this line ──
];

export default function LettersAndPoems() {
  return (
    <MainContent>
      <RevealObserver />

      {/* Page Header */}
      <section className="section-padding reveal" style={{ minHeight: 'auto', paddingBottom: '4vh' }}>
        <p className="mono" style={{ marginBottom: '0.5rem' }}>a growing collection</p>
        <h1
          className="serif"
          style={{
            fontFamily: 'var(--serif-font)',
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            color: 'var(--text-color)',
          }}
        >
          letters &amp; poems
        </h1>
        <p
          className="serif"
          style={{ opacity: 0.5, fontSize: '1rem', marginTop: '0.8rem' }}
        >
          everything sealed, everything yours. click to open.
        </p>
      </section>

      {/* Envelopes */}
      <section
        className="section-padding reveal"
        style={{
          minHeight: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6vh',
          alignItems: 'center',
          paddingTop: '2vh',
        }}
      >
        {items.map((item) => (
          <EnvelopeCard key={item.id} item={item} />
        ))}
      </section>

      <footer className="section-padding" style={{ minHeight: 'auto', paddingTop: '4vh' }}>
        <p className="mono">more arriving soon ✦</p>
      </footer>
    </MainContent>
  );
}
