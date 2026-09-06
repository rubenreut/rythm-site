let audioCtx = null;

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function ensureAudioResumed() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

/**
 * Play a short click sound at the given time.
 * accent=true plays a higher-pitched downbeat click.
 */
export function scheduleClick(time, accent = false) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = accent ? 1000 : 800;
  osc.type = 'triangle';

  gain.gain.setValueAtTime(accent ? 0.3 : 0.15, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

  osc.start(time);
  osc.stop(time + 0.05);
}

/**
 * Play an immediate positive feedback sound (short pleasant tick).
 */
export function playGood() {
  const ctx = ensureAudioResumed();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 1200;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc.start(now);
  osc.stop(now + 0.08);
}

/**
 * Play an immediate negative feedback sound (low thud).
 */
export function playBad() {
  const ctx = ensureAudioResumed();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 300;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Play a success fanfare for completing a level.
 */
export function playSuccess() {
  const ctx = ensureAudioResumed();
  const now = ctx.currentTime;

  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = 'sine';
    const t = now + i * 0.12;
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}

/**
 * Schedule a note tone (woodblock-like sound) at a given time.
 * Used for the "listen" preview so the user hears what notes sound like.
 */
export function scheduleNoteTone(time, duration) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 660;
  osc.type = 'sine';

  const noteLength = Math.min(duration * 0.8, 0.15);
  gain.gain.setValueAtTime(0.2, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + noteLength);

  osc.start(time);
  osc.stop(time + noteLength);
}

/**
 * Preview a level's rhythm: plays metronome + note tones.
 * Returns { stop() } to cancel playback.
 */
export function previewRhythm(level) {
  const ctx = ensureAudioResumed();
  const beatDuration = 60 / level.bpm;
  const startTime = ctx.currentTime + 0.05;

  // Count-in clicks
  for (let i = 0; i < level.beatsPerBar; i++) {
    const t = startTime + i * beatDuration;
    scheduleClick(t, i === 0);
  }

  const countInEnd = startTime + level.beatsPerBar * beatDuration;
  const totalBeats = level.beatsPerBar * level.bars;

  // Metronome clicks during rhythm
  for (let i = 0; i < totalBeats; i++) {
    const t = countInEnd + i * beatDuration;
    const isDownbeat = (i % level.beatsPerBar) === 0;
    scheduleClick(t, isDownbeat);
  }

  // Note tones
  let beatPos = 0;
  for (const ev of level.rhythm) {
    if (ev.type === 'note') {
      const t = countInEnd + beatPos * beatDuration;
      scheduleNoteTone(t, ev.duration * beatDuration);
    }
    beatPos += ev.duration;
  }

  const endTime = countInEnd + totalBeats * beatDuration;

  // Return a handle with stop and onDone
  let doneTimer = null;
  let stopped = false;
  const handle = {
    endTime,
    onDone: null,
    stop() {
      stopped = true;
      clearTimeout(doneTimer);
    },
  };

  const durationMs = (endTime - ctx.currentTime) * 1000 + 200;
  doneTimer = setTimeout(() => {
    if (!stopped && handle.onDone) handle.onDone();
  }, durationMs);

  return handle;
}

export function now() {
  return getAudioContext().currentTime;
}
