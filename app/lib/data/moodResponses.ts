export type MoodKey = 'happy' | 'sad' | 'tired' | 'anxious' | 'loved' | 'numb' | 'silly' | 'missing';

export const MOOD_RESPONSES: Record<MoodKey, string> = {
  happy: 'There it is. That smile you\'re wearing right now, I can practically see it from here and it\'s doing something to me.',
  sad: 'Set your head on my chest for a while. You don\'t have to explain anything. I\'ll just hold you until it passes.',
  tired: 'Then rest, love. You carry more than you let on. Put it all down for tonight and let me watch over you instead.',
  anxious: 'Take a slow breath with me. Every hard thing so far has passed through your hands and you\'re still here. So will this one.',
  loved: 'Good. Stay right there in that feeling, because that is exactly how I mean for you to feel, every single day.',
  numb: 'That\'s allowed too. You don\'t owe anyone a big feeling today. I\'m still right here either way, patient and steady.',
  silly: 'This is my favorite version of you honestly. Chaotic, giggling, completely unfiltered. Never grow out of this please.',
  missing: 'I feel that too, right now, in my chest. Hang on a little longer, I am counting down the same minutes you are.',
};
