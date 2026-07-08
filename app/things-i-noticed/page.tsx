import MainContent from '../components/MainContent';
import RevealObserver from '../components/RevealObserver';
import MemoryJar from '../components/MemoryJar';

export default function ThingsINoticed() {
  return (
    <MainContent>
      <RevealObserver />
      <MemoryJar />
      <footer className="section-padding" style={{ minHeight: 'auto', paddingTop: '2vh' }}>
        <p className="mono">cannot wait to meet you again to add more things</p>
      </footer>
    </MainContent>
  );
}
