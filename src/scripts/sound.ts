/**
 * sound.ts
 * A "thock" keyboard sound on press and a soft tick on release, synthesized with the Web Audio API
 * (no audio files). Works with mouse and touch; on iOS the audio context is unlocked on the first tap.
 */

let audio: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let output: GainNode | null = null;

/** Lazily creates the shared AudioContext (with a gentle compressor) and resumes it if suspended. */
function context(): AudioContext | null {
  if (!audio) {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    audio = new AudioCtor();

    // Shared output through a soft compressor: keeps the sound round, with no harsh peaks
    const compressor = audio.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.ratio.value = 4;
    output = audio.createGain();
    output.gain.value = 0.9;
    output.connect(compressor).connect(audio.destination);
  }

  if (audio.state === "suspended") void audio.resume();
  return audio;
}

/** Builds (once) and reuses a short white-noise buffer used for the "tap" of the key press. */
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noise) return noise;

  noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return noise;
}

/** A gain node with a quick attack and decay, used to shape every oscillator and noise burst. */
function envelope(ctx: AudioContext, peak: number, attack: number, decay: number): GainNode {
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  return gain;
}

/** Press sound: a round, low-pitched body plus a short noise tap for the key texture. */
function press(pitch = 1): void {
  const ctx = context();
  if (!ctx || !output) return;
  const now = ctx.currentTime;

  const body = ctx.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(260 * pitch, now);
  body.frequency.exponentialRampToValueAtTime(120 * pitch, now + 0.05);
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1100;
  body.connect(lowpass).connect(envelope(ctx, 0.32, 0.004, 0.09)).connect(output);
  body.start(now);
  body.stop(now + 0.12);

  const tap = ctx.createBufferSource();
  tap.buffer = noiseBuffer(ctx);
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1400 * pitch;
  band.Q.value = 0.7;
  tap.connect(band).connect(envelope(ctx, 0.12, 0.002, 0.03)).connect(output);
  tap.start(now);
  tap.stop(now + 0.05);
}

/** Release sound: a short, higher and quieter tick, like a spring returning. */
function release(pitch = 1): void {
  const ctx = context();
  if (!ctx || !output) return;
  const now = ctx.currentTime;

  const tick = ctx.createOscillator();
  tick.type = "sine";
  tick.frequency.setValueAtTime(900 * pitch, now);
  tick.frequency.exponentialRampToValueAtTime(600 * pitch, now + 0.03);
  tick.connect(envelope(ctx, 0.07, 0.002, 0.04)).connect(output);
  tick.start(now);
  tick.stop(now + 0.06);
}

/** Unlocks audio playback on mobile: iOS only allows starting the context inside a user gesture. */
function unlock(): void {
  const ctx = context();
  if (!ctx) return;

  const source = ctx.createBufferSource();
  source.buffer = ctx.createBuffer(1, 1, 22050);
  source.connect(ctx.destination);
  source.start(0);

  document.removeEventListener("touchend", unlock);
}

document.addEventListener("touchend", unlock, { passive: true });

let pressed: { pitch: number } | null = null;

document.addEventListener(
  "pointerdown",
  (e: PointerEvent) => {
    if (e.button !== 0) return;

    const target = (e.target as Element | null)?.closest<HTMLElement>("a, button");
    if (!target) return;

    // Theme and language toggles sound a bit higher-pitched
    const pitch = target.matches("#theme-toggle, .lang-toggle") ? 1.2 : 1;
    pressed = { pitch };
    press(pitch);
  },
  { passive: true }
);

document.addEventListener(
  "pointerup",
  () => {
    if (!pressed) return;
    release(pressed.pitch);
    pressed = null;
  },
  { passive: true }
);
