// Because we're using a CDN, Tone.js will be on the window object.
declare const Tone: any;

let isAudioInitialized = false;
let correctSynth: any;
let incorrectSynth: any;
let resultSynths: any[];

const initializeSynths = () => {
    correctSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'fmsine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 },
    }).toDestination();

    incorrectSynth = new Tone.MonoSynth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 },
        filter: { type: 'lowpass', frequency: 1200 },
        filterEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.1, release: 0.2, baseFrequency: 300, octaves: 4 }
    }).toDestination();

    resultSynths = [
        new Tone.PolySynth(Tone.FMSynth, {
            harmonicity: 3,
            modulationIndex: 10,
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.4 }
        }).toDestination(),
        new Tone.MembraneSynth({
            pitchDecay: 0.01,
            octaves: 4,
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' }
        }).toDestination()
    ];
}

export const initAudio = async () => {
  if (!isAudioInitialized && typeof Tone !== 'undefined') {
    await Tone.start();
    initializeSynths();
    console.log('Audio context started');
    isAudioInitialized = true;
  }
};

export const playCorrectSound = () => {
  if (!isAudioInitialized) return;
  correctSynth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n', Tone.now());
};

export const playIncorrectSound = () => {
  if (!isAudioInitialized) return;
  incorrectSynth.triggerAttackRelease('F#3', '8n', Tone.now());
};

export const playResultSound = (score: number) => {
    if (!isAudioInitialized) return;
    const now = Tone.now();
    if (score > 15) { // Cheerful, triumphant fanfare for a good score
        resultSynths[0].triggerAttackRelease('C5', '16n', now);
        resultSynths[0].triggerAttackRelease('E5', '16n', now + 0.1);
        resultSynths[0].triggerAttackRelease('G5', '16n', now + 0.2);
        resultSynths[0].triggerAttackRelease('C6', '8n', now + 0.3);
        resultSynths[0].triggerAttackRelease(['E5', 'G5', 'C6'], '4n', now + 0.35);
        resultSynths[1].triggerAttackRelease('C3', '2n', now);
    } else { // Uplifting, encouraging sound for a lower score
        resultSynths[0].triggerAttackRelease('G4', '8n', now);
        resultSynths[0].triggerAttackRelease('C5', '4n', now + 0.15);
        resultSynths[1].triggerAttackRelease('C3', '4n', now + 0.15);
    }
};