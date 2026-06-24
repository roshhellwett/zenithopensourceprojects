let sharedAudioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!sharedAudioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  return sharedAudioCtx;
};

export type SoundType =
  | "click"
  | "beep"
  | "success"
  | "toggle"
  | "crt"
  | "minimize"
  | "maximize"
  | "close"
  | "error";

export const getSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  const val = localStorage.getItem("zenith_sound_enabled");
  return val !== "false"; // default is true
};

export const setSoundEnabled = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("zenith_sound_enabled", String(enabled));
  // Dispatch custom event to notify other parts of the app
  window.dispatchEvent(new CustomEvent("zenith_sound_toggle", { detail: enabled }));
};

export const playRetroSound = (type: SoundType) => {
  try {
    if (!getSoundEnabled()) return;

    const audioCtx = getAudioContext();
    if (!audioCtx) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === "click") {
      // Crisp mechanical/arcade click
      // Tone part
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

      gainNode.gain.setValueAtTime(0.04, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);

      // Noise click part (adds high-frequency mechanical feel)
      const bufferSize = audioCtx.sampleRate * 0.01; // 10ms of noise
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(1000, now);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.015, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.015);
    } 
    else if (type === "beep") {
      // Classic 8-bit selection beep
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } 
    else if (type === "success") {
      // Arpeggio success sound
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const duration = 0.08;
      
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.06);
        
        gainNode.gain.setValueAtTime(0.04, now + index * 0.06);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(now + index * 0.06);
        osc.stop(now + index * 0.06 + duration);
      });
    } 
    else if (type === "toggle") {
      // Retro toggle switch sound
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.06);

      gainNode.gain.setValueAtTime(0.015, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } 
    else if (type === "crt") {
      // CRT boot/degauss hum
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(60, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      gainNode.gain.setValueAtTime(0.02, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.25);
      osc2.stop(now + 0.25);
    }
    else if (type === "minimize") {
      // Whoosh downwards
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

      gainNode.gain.setValueAtTime(0.035, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }
    else if (type === "maximize") {
      // Whoosh upwards
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.18);

      gainNode.gain.setValueAtTime(0.035, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    }
    else if (type === "close") {
      // Retro folder close chime
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.setValueAtTime(350, now + 0.06);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(750, now);
      osc2.frequency.setValueAtTime(525, now + 0.06);

      gainNode.gain.setValueAtTime(0.025, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.12);
      osc2.stop(now + 0.12);
    }
    else if (type === "error") {
      // Retro detuned alarm buzz
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = "square";
      osc1.frequency.setValueAtTime(110, now); // A2
      osc1.frequency.linearRampToValueAtTime(130, now + 0.25);

      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(112, now); // detuned
      osc2.frequency.linearRampToValueAtTime(132, now + 0.25);

      gainNode.gain.setValueAtTime(0.02, now);
      gainNode.gain.linearRampToValueAtTime(0.015, now + 0.15);
      gainNode.gain.linearRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    }
  } catch (e) {
    console.warn("Failed to play sound:", e);
  }
};
