import { getAudioContext, ensureAudioResumed, scheduleClick, scheduleNoteTone, playGood, playBad, playSuccess } from './audio.js';
import { renderNotation, createCursor, updateCursor, highlightNote } from './notation.js';

// Scoring tolerance (seconds)
const PERFECT_WINDOW = 0.06;
const GREAT_WINDOW = 0.11;
const GOOD_WINDOW = 0.17;
const MISS_WINDOW = 0.25;

// Scheduler lookahead
const SCHEDULE_AHEAD = 0.1;
const SCHEDULE_INTERVAL = 25;

export class Game {
  constructor({ container, level, onFinish }) {
    this.container = container;
    this.level = level;
    this.onFinish = onFinish;

    this.playing = false;
    this.startTime = 0;
    this.beatDuration = 60 / level.bpm;
    this.totalBeats = level.beatsPerBar * level.bars;
    this.countInBeats = level.beatsPerBar;

    // Build expected note times (only notes that should be tapped — skip rests and tied notes)
    this.expectedNotes = [];
    let beatPos = 0;
    for (const ev of level.rhythm) {
      if (ev.type === 'note' && !ev.tie) {
        this.expectedNotes.push({
          time: 0,
          beatPos,
          duration: ev.duration,
          matched: false,
          quality: null,
        });
      }
      beatPos += ev.duration;
    }

    this.taps = [];
    this.schedulerTimer = null;
    this.animFrame = null;
    this.nextScheduledBeat = 0;
    this.notationData = null;
    this.cursor = null;

    // Preview mode
    this.previewMode = false;
    this.previewTapEl = null;
    this.previewNextNote = 0;

    // Scoring results
    this.results = {
      perfect: 0,
      great: 0,
      good: 0,
      miss: 0,
      total: this.expectedNotes.length,
    };
  }

  /**
   * Render the notation and prepare the game.
   */
  prepare() {
    this.notationData = renderNotation(this.container, this.level);
    this.cursor = createCursor(this.notationData.svg);
    this.cursor.style.display = 'none';
  }

  /**
   * Start the game: count-in then play.
   */
  start() {
    const ctx = ensureAudioResumed();
    this.playing = true;

    // Start time: now + a tiny buffer
    this.startTime = ctx.currentTime + 0.05;

    // Set absolute times for expected notes
    const countInDuration = this.countInBeats * this.beatDuration;
    for (const note of this.expectedNotes) {
      note.time = this.startTime + countInDuration + note.beatPos * this.beatDuration;
    }

    this.nextScheduledBeat = 0;
    this.totalScheduledBeats = this.countInBeats + this.totalBeats;

    // Start scheduler and animation
    this.schedulerTimer = setInterval(() => this._schedule(), SCHEDULE_INTERVAL);
    this._animate();
  }

  /**
   * Start a visual + audio preview. Shows cursor, highlights notes,
   * and flashes the given tapEl on each note.
   */
  startPreview(tapEl) {
    const ctx = ensureAudioResumed();
    this.playing = true;
    this.previewMode = true;
    this.previewTapEl = tapEl;
    this.previewNextNote = 0;

    this.startTime = ctx.currentTime + 0.05;

    const countInDuration = this.countInBeats * this.beatDuration;
    for (const note of this.expectedNotes) {
      note.time = this.startTime + countInDuration + note.beatPos * this.beatDuration;
    }

    // Schedule note tones for the preview
    for (const note of this.expectedNotes) {
      scheduleNoteTone(note.time, note.duration * this.beatDuration);
    }

    this.nextScheduledBeat = 0;
    this.totalScheduledBeats = this.countInBeats + this.totalBeats;

    this.schedulerTimer = setInterval(() => this._schedule(), SCHEDULE_INTERVAL);
    this._animate();
  }

  /**
   * Lookahead scheduler for metronome clicks.
   */
  _schedule() {
    const ctx = getAudioContext();
    const lookAheadEnd = ctx.currentTime + SCHEDULE_AHEAD;

    while (this.nextScheduledBeat < this.totalScheduledBeats) {
      const beatTime = this.startTime + this.nextScheduledBeat * this.beatDuration;

      if (beatTime > lookAheadEnd) break;

      const beatInBar = (this.nextScheduledBeat < this.countInBeats)
        ? this.nextScheduledBeat % this.level.beatsPerBar
        : (this.nextScheduledBeat - this.countInBeats) % this.level.beatsPerBar;

      const isDownbeat = beatInBar === 0;
      scheduleClick(beatTime, isDownbeat);

      this.nextScheduledBeat++;
    }
  }

  /**
   * Animation loop: update cursor, countdown, check for end.
   */
  _animate() {
    if (!this.playing) return;

    const ctx = getAudioContext();
    // Compensate for audio output latency so cursor matches what you hear
    const outputLatency = ctx.outputLatency || ctx.baseLatency || 0;
    const elapsed = ctx.currentTime - this.startTime - outputLatency;
    const countInDuration = this.countInBeats * this.beatDuration;

    // Countdown display
    const countdownEl = document.getElementById('countdown');
    if (elapsed < countInDuration) {
      const countBeat = Math.floor(elapsed / this.beatDuration);
      countdownEl.textContent = countBeat + 1;
      countdownEl.classList.remove('hidden');
      this.cursor.style.display = 'none';
    } else {
      countdownEl.classList.add('hidden');
      this.cursor.style.display = '';

      // Update cursor position
      const musicElapsed = elapsed - countInDuration;
      const currentBeat = musicElapsed / this.beatDuration;
      updateCursor(this.cursor, currentBeat, this.notationData.beatWidth, this.notationData.notePositions);

      // In preview mode, auto-flash tap button and highlight notes
      if (this.previewMode) {
        this._autoTapPreview(ctx.currentTime);
      }

      // Check if finished
      if (currentBeat >= this.totalBeats + 0.5) {
        if (this.previewMode) {
          this._finishPreview();
        } else {
          this._finish();
        }
        return;
      }
    }

    this.animFrame = requestAnimationFrame(() => this._animate());
  }

  /**
   * During preview, auto-flash the tap button and highlight notes as they pass.
   */
  _autoTapPreview(currentTime) {
    while (this.previewNextNote < this.expectedNotes.length) {
      const note = this.expectedNotes[this.previewNextNote];
      if (currentTime >= note.time - 0.02) {
        // Flash the tap button
        if (this.previewTapEl) {
          this.previewTapEl.classList.add('flash-good');
          setTimeout(() => {
            if (this.previewTapEl) {
              this.previewTapEl.classList.remove('flash-good');
            }
          }, 120);
        }

        // Highlight the note in the SVG
        const noteVisual = this.notationData.notePositions.find(
          (np) => Math.abs(np.beatStart - note.beatPos) < 0.01 && np.type === 'note'
        );
        if (noteVisual) {
          highlightNote(this.notationData.svg, noteVisual, 'perfect');
        }

        this.previewNextNote++;
      } else {
        break;
      }
    }
  }

  _finishPreview() {
    this.playing = false;
    this.previewMode = false;
    clearInterval(this.schedulerTimer);
    cancelAnimationFrame(this.animFrame);
    this.cursor.style.display = 'none';

    if (this.onPreviewDone) this.onPreviewDone();
  }

  /**
   * Handle a tap from the user.
   */
  tap() {
    if (!this.playing) return;

    const ctx = getAudioContext();
    const tapTime = ctx.currentTime;
    this.taps.push(tapTime);

    // Find the closest unmatched note
    let bestNote = null;
    let bestDiff = Infinity;

    for (const note of this.expectedNotes) {
      if (note.matched) continue;
      const diff = Math.abs(tapTime - note.time);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestNote = note;
      }
    }

    if (bestNote && bestDiff <= MISS_WINDOW) {
      bestNote.matched = true;

      if (bestDiff <= PERFECT_WINDOW) {
        bestNote.quality = 'perfect';
        this.results.perfect++;
        this._showFeedback('Perfect!', 'perfect');
      } else if (bestDiff <= GREAT_WINDOW) {
        bestNote.quality = 'great';
        this.results.great++;
        this._showFeedback('Great!', 'great');
      } else if (bestDiff <= GOOD_WINDOW) {
        bestNote.quality = 'good';
        this.results.good++;
        this._showFeedback('Good', 'good');
      } else {
        bestNote.quality = 'miss';
        this.results.miss++;
        this._showFeedback('Off', 'miss');
      }

      // Highlight the note in the SVG
      const noteVisual = this.notationData.notePositions.find(
        (np) => Math.abs(np.beatStart - bestNote.beatPos) < 0.01 && np.type === 'note'
      );
      if (noteVisual) {
        highlightNote(this.notationData.svg, noteVisual, bestNote.quality);
      }

      if (bestNote.quality !== 'miss') {
        playGood();
      } else {
        playBad();
      }
    } else {
      // Extra tap (during rest or too far from any note)
      playBad();
      this._showFeedback('', 'miss');
    }
  }

  _showFeedback(text, quality) {
    const el = document.getElementById('feedback-text');
    el.textContent = text;
    el.className = 'feedback-text feedback-' + quality;
    clearTimeout(this._feedbackTimeout);
    this._feedbackTimeout = setTimeout(() => {
      el.textContent = '';
      el.className = 'feedback-text';
    }, 400);
  }

  /**
   * Finish the game, calculate final score.
   */
  _finish() {
    this.playing = false;
    clearInterval(this.schedulerTimer);
    cancelAnimationFrame(this.animFrame);

    // Mark unmatched notes as misses
    for (const note of this.expectedNotes) {
      if (!note.matched) {
        this.results.miss++;
      }
    }

    // Calculate percentage score
    const maxPoints = this.results.total * 100;
    const earnedPoints =
      this.results.perfect * 100 +
      this.results.great * 75 +
      this.results.good * 50;
    const score = maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 100) : 0;

    // Stars
    let stars = 0;
    if (score >= 90) stars = 3;
    else if (score >= 75) stars = 2;
    else if (score >= 60) stars = 1;

    const passed = score >= 70;

    if (passed) {
      playSuccess();
    }

    this.onFinish({
      score,
      stars,
      passed,
      breakdown: { ...this.results },
    });
  }

  /**
   * Clean up timers.
   */
  destroy() {
    this.playing = false;
    this.previewMode = false;
    clearInterval(this.schedulerTimer);
    cancelAnimationFrame(this.animFrame);
  }
}
