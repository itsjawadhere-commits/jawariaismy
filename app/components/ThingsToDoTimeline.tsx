import Timeline from './Timeline';

export default function ThingsToDoTimeline() {
  return (
    <Timeline
      heading="Things i wanna do when we meet"
      entries={[
        {
          label: 'coordinate 01',
          text: 'Take a road trip with no real destination, just you, me, and a playlist we build together.',
        },
        {
          label: 'coordinate 02',
          text: 'Try cooking a dish neither of us has made before and see who ruins it first.',
        },
        {
          label: 'coordinate 03',
          text: 'Watch the sunrise from somewhere we have never been, still half asleep and holding hands.',
        },
      ]}
    />
  );
}
