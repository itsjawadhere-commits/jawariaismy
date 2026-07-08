interface TimelineEntry {
  label: string;
  text: string;
}

interface TimelineProps {
  heading: string;
  entries: TimelineEntry[];
}

export default function Timeline({ heading, entries }: TimelineProps) {
  return (
    <section className="section-padding">
      <p className="mono" style={{ marginBottom: '4rem', fontSize: '1rem', letterSpacing: '0.1em' }}>
        {heading}
      </p>
      <div className="timeline-container">
        <div className="timeline-line" />
        {entries.map((entry) => (
          <div key={entry.label} className="timeline-entry reveal">
            <div className="dot" />
            <span className="mono" style={{ color: 'var(--accent-gold)' }}>
              {entry.label}
            </span>
            <p className="serif" style={{ fontSize: '1.6rem', marginTop: '0.5rem', opacity: 0.9 }}>
              {entry.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
