import MainContent from '../components/MainContent';
import RevealObserver from '../components/RevealObserver';
import UnsaidNotes from '../components/UnsaidNotes';

export default function Unsaid() {
  return (
    <MainContent>
      <RevealObserver />
      <UnsaidNotes />
      <footer className="section-padding" style={{ minHeight: 'auto', paddingTop: '2vh' }}>
        <p className="mono">whatever it is, it reaches me. always.</p>
      </footer>
    </MainContent>
  );
}
