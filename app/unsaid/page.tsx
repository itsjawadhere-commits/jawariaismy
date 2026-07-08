import MainContent from '../components/MainContent';
import RevealObserver from '../components/RevealObserver';
import UnsaidNotes from '../components/UnsaidNotes';
import Journal from '../components/Journal';

export default function Unsaid() {
  return (
    <MainContent>
      <RevealObserver />
      <UnsaidNotes />
      <Journal />
      <footer className="section-padding" style={{ minHeight: 'auto', paddingTop: '2vh' }}>
        <p className="mono">a safe space for you. always.</p>
      </footer>
    </MainContent>
  );
}
