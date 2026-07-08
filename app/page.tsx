import MainContent from './components/MainContent';
import RevealObserver from './components/RevealObserver';
import ChapterDivider from './components/ChapterDivider';
import Hero from './components/Hero';
import DaysSince from './components/DaysSince';
import Timeline from './components/Timeline';
import MoonSection from './components/MoonSection';
import MoodCheck from './components/MoodCheck';
import OddsSection from './components/OddsSection';
import ScatteredNotes from './components/ScatteredNotes';
import ScratchCard from './components/ScratchCard';
import ReasonsGenerator from './components/ReasonsGenerator';
import PromiseJar from './components/PromiseJar';
import HoldToReveal from './components/HoldToReveal';
import Constellation from './components/Constellation';
import AudioPlayer from './components/AudioPlayer';
import ReservedFrames from './components/ReservedFrames';
import ThingsToDoTimeline from './components/ThingsToDoTimeline';
import DaysMet from './components/DaysMet';
import BirthdaySection from './components/BirthdaySection';

export default function Home() {
  return (
    <MainContent>
      <RevealObserver />

      {/* HERO — stands alone, before the chapters begin */}
      <Hero />

      {/* ============ CHAPTER I — THE BEGINNING ============ */}
      <ChapterDivider
        numeral="i."
        title="The Beginning"
        epigraph="How everything started, and the shape of the sky the night it did."
      />

      <DaysSince />

      <Timeline
        heading="The Phases"
        entries={[
          {
            label: 'the prelude',
            text: 'The number of layers I had to unfold to know your real soft self beneath.',
          },
          {
            label: 'the shift',
            text: 'Promising you the comfort of the space where you could cry in my arms every time.',
          },
          {
            label: 'the anchor',
            text: 'To be certain about that going forward, you are what I need in my life and nothing else.',
          },
        ]}
      />

      <MoonSection />

      {/* ============ CHAPTER II — SHARED MEMORIES ============ */}
      <ChapterDivider
        numeral="ii."
        title="Shared Memories"
        epigraph="Moments that slowly became part of our story."
      />

      <MoodCheck />
      <OddsSection />
      <ScatteredNotes />

      {/* ============ CHAPTER III — HIDDEN FEELINGS ============ */}
      <ChapterDivider
        numeral="iii."
        title="Hidden Feelings"
        epigraph="Things I don't say often enough, kept somewhere you have to look for them."
      />

      <section className="section-padding reveal">
        <p className="mono" style={{ marginBottom: '0.5rem' }}>
          scratch to reveal
        </p>
        <p className="serif" style={{ opacity: 0.6, fontSize: '1rem', marginBottom: '1rem' }}>
          something i&apos;ve been holding for you
        </p>
        <ScratchCard />
        <p id="scratch-hint" className="mono">
          use your finger or mouse to scratch
        </p>
      </section>

      <ReasonsGenerator />
      <HoldToReveal />

      {/* ============ CHAPTER IV — PROMISES ============ */}
      <ChapterDivider
        numeral="iv."
        title="Promises"
        epigraph="Commitments, hopes, and the things I'm sure of even when nothing else is."
      />

      <PromiseJar />
      <Constellation />
      <AudioPlayer />

      {/* ============ CHAPTER V — DREAMS & FUTURE TOGETHER ============ */}
      <ChapterDivider
        numeral="v."
        title="Dreams"
        epigraph="Future adventures, plans, and a story that keeps going past this page."
      />

      <ReservedFrames />
      <ThingsToDoTimeline />

      <DaysMet />
      <BirthdaySection />

      <footer className="section-padding">
        <p className="mono">for you, my love</p>
      </footer>
    </MainContent>
  );
}
