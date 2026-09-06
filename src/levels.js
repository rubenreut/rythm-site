/**
 * Curated rhythmic cell progression using Kodály syllables.
 *
 * Each level has a pool of bar patterns. Each attempt randomly
 * picks bars from the pool — variety within a consistent difficulty.
 *
 * Syllables:
 *   Ta       = quarter note (1 beat)
 *   Ti-Ti    = eighth note pair (½ beat each)
 *   To-e     = half note (2 beats)
 *   Ta-a-a-a = whole note (4 beats)
 *   shh      = rest (duration varies)
 */

const n = (d) => ({ type: 'note', duration: d });
const r = (d) => ({ type: 'rest', duration: d });
const nt = (d) => ({ type: 'note', duration: d, tie: true });
const tri = 1 / 3;

const levels = [
  // ═══════════════════════════════════════════════════
  // STAGE 1: Ta and Ti-Ti
  // ═══════════════════════════════════════════════════

  {
    id: 1,
    name: 'Ta Ta Ta Ta',
    description: 'Quarter notes only',
    stage: 1,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(1), n(1)],
    ],
  },
  {
    id: 2,
    name: 'Ta Ta Ti-Ti Ta',
    description: 'One Ti-Ti per bar',
    stage: 1,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(1), n(1), n(1)],
      [n(1), n(0.5), n(0.5), n(1), n(1)],
      [n(1), n(1), n(1), n(0.5), n(0.5)],
    ],
  },
  {
    id: 3,
    name: 'Ti-Ti Ta Ti-Ti Ta',
    description: 'Two Ti-Ti per bar',
    stage: 1,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), n(1), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(0.5), n(0.5), n(1), n(1)],
      [n(1), n(1), n(0.5), n(0.5), n(0.5), n(0.5)],
      [n(1), n(0.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(1), n(1), n(0.5), n(0.5)],
    ],
  },
  {
    id: 4,
    name: 'Ti-Ti Ti-Ti Ti-Ti Ta',
    description: 'Three Ti-Ti per bar',
    stage: 1,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(1), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5)],
      [n(0.5), n(0.5), n(1), n(0.5), n(0.5), n(0.5), n(0.5)],
      [n(0.5), n(0.5), n(0.5), n(0.5), n(1), n(0.5), n(0.5)],
    ],
  },
  {
    id: 5,
    name: 'Ti-Ti Ti-Ti Ti-Ti Ti-Ti',
    description: 'All eighth notes',
    stage: 1,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5)],
    ],
  },
  {
    id: 6,
    name: 'Stage 1 Mix',
    description: 'All Ta and Ti-Ti combos',
    stage: 1,
    bpm: 76,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(1), n(1)],
      [n(1), n(1), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(1), n(1), n(1)],
      [n(0.5), n(0.5), n(1), n(0.5), n(0.5), n(1)],
      [n(1), n(1), n(0.5), n(0.5), n(0.5), n(0.5)],
      [n(0.5), n(0.5), n(0.5), n(0.5), n(1), n(1)],
      [n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(1), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5)],
      [n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(0.5)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 2: Introduce To-e (half notes)
  // ═══════════════════════════════════════════════════

  {
    id: 7,
    name: 'To-e Ta Ta',
    description: 'Half note first',
    stage: 2,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(2), n(1), n(1)],
      [n(1), n(1), n(2)],
    ],
  },
  {
    id: 8,
    name: 'To-e Ti-Ti Ta',
    description: 'Half note with eighths',
    stage: 2,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(2), n(0.5), n(0.5), n(1)],
      [n(1), n(0.5), n(0.5), n(2)],
      [n(2), n(1), n(0.5), n(0.5)],
    ],
  },
  {
    id: 9,
    name: 'Ta Ti-Ti To-e',
    description: 'Half note at the end',
    stage: 2,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(0.5), n(0.5), n(2)],
      [n(0.5), n(0.5), n(1), n(2)],
      [n(1), n(1), n(2)],
    ],
  },
  {
    id: 10,
    name: 'Ti-Ti Ti-Ti To-e',
    description: 'Eighths into half note',
    stage: 2,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), n(0.5), n(0.5), n(2)],
      [n(0.5), n(0.5), n(1), n(2)],
      [n(1), n(0.5), n(0.5), n(2)],
    ],
  },
  {
    id: 11,
    name: 'Ta To-e Ti-Ti',
    description: 'Half note in the middle',
    stage: 2,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(2), n(0.5), n(0.5)],
      [n(0.5), n(0.5), n(2), n(1)],
      [n(1), n(2), n(1)],
    ],
  },
  {
    id: 12,
    name: 'Ti-Ti Ta To-e',
    description: 'Eighths, quarter, then half',
    stage: 2,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), n(1), n(2)],
      [n(0.5), n(0.5), n(2), n(0.5), n(0.5)],
      [n(1), n(0.5), n(0.5), n(2)],
    ],
  },
  {
    id: 13,
    name: 'Stage 2 Mix',
    description: 'All To-e combos',
    stage: 2,
    bpm: 76,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(2), n(1), n(1)],
      [n(1), n(1), n(2)],
      [n(2), n(0.5), n(0.5), n(1)],
      [n(1), n(0.5), n(0.5), n(2)],
      [n(0.5), n(0.5), n(0.5), n(0.5), n(2)],
      [n(1), n(2), n(0.5), n(0.5)],
      [n(0.5), n(0.5), n(1), n(2)],
      [n(0.5), n(0.5), n(2), n(1)],
      [n(2), n(2)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 3: Introduce shh (rests)
  // Quarter notes, eighth notes, half notes + rests
  // ═══════════════════════════════════════════════════

  // i) Ta Ti-Ti Ta shh
  {
    id: 14,
    name: 'Ta Ti-Ti Ta shh',
    description: 'Rest at the end',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(0.5), n(0.5), n(1), r(1)],
      [n(0.5), n(0.5), n(1), n(1), r(1)],
      [n(1), n(1), n(0.5), n(0.5), r(1)],
    ],
  },

  // ii) Ti-Ti Ta shh Ta
  {
    id: 15,
    name: 'Ti-Ti Ta shh Ta',
    description: 'Rest in the middle',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), n(1), r(1), n(1)],
      [n(1), n(0.5), n(0.5), r(1), n(1)],
      [n(0.5), n(0.5), n(1), r(1), n(0.5), n(0.5)],
    ],
  },

  // iii) To-e Ti-Ti shh
  {
    id: 16,
    name: 'To-e Ti-Ti shh',
    description: 'Half note, eighths, then rest',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(2), n(0.5), n(0.5), r(1)],
      [n(2), n(1), r(1)],
      [n(1), n(2), r(1)],
    ],
  },

  // iv) Ti-Ti shh Ti-Ti shh
  {
    id: 17,
    name: 'Ti-Ti shh Ti-Ti shh',
    description: 'Alternating notes and rests',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), r(1), n(0.5), n(0.5), r(1)],
      [n(1), r(1), n(1), r(1)],
      [n(0.5), n(0.5), r(1), n(1), r(1)],
      [n(1), r(1), n(0.5), n(0.5), r(1)],
    ],
  },

  // v) shh Ta Ti-Ti Ta
  {
    id: 18,
    name: 'shh Ta Ti-Ti Ta',
    description: 'Rest at the start',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [r(1), n(1), n(0.5), n(0.5), n(1)],
      [r(1), n(0.5), n(0.5), n(1), n(1)],
      [r(1), n(1), n(1), n(0.5), n(0.5)],
    ],
  },

  // vi) shh Ta To-e
  {
    id: 19,
    name: 'shh Ta To-e',
    description: 'Rest into half note',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [r(1), n(1), n(2)],
      [r(1), n(2), n(1)],
      [n(1), r(1), n(2)],
    ],
  },

  // vii) shh Ta Ti-Ti shh
  {
    id: 20,
    name: 'shh Ta Ti-Ti shh',
    description: 'Rests on both ends',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [r(1), n(1), n(0.5), n(0.5), r(1)],
      [r(1), n(0.5), n(0.5), n(1), r(1)],
      [r(1), n(0.5), n(0.5), n(0.5), n(0.5), r(1)],
    ],
  },

  // viii) shh Ti-Ti shh Ta
  {
    id: 21,
    name: 'shh Ti-Ti shh Ta',
    description: 'Rest, eighths, rest, quarter',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [r(1), n(0.5), n(0.5), r(1), n(1)],
      [r(1), n(1), r(1), n(0.5), n(0.5)],
      [r(1), n(0.5), n(0.5), r(1), n(0.5), n(0.5)],
    ],
  },

  // ix) shh shh shh Ti-Ti
  {
    id: 22,
    name: 'shh shh shh Ti-Ti',
    description: 'Three rests then eighths',
    stage: 3,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [r(1), r(1), r(1), n(0.5), n(0.5)],
      [r(1), r(1), n(0.5), n(0.5), r(1)],
      [r(1), r(1), r(1), n(1)],
      [r(1), r(1), n(1), r(1)],
    ],
  },

  // Stage 3 Mix
  {
    id: 23,
    name: 'Stage 3 Mix',
    description: 'All rest patterns',
    stage: 3,
    bpm: 74,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(0.5), n(0.5), n(1), r(1)],
      [n(0.5), n(0.5), n(1), r(1), n(1)],
      [n(2), n(0.5), n(0.5), r(1)],
      [n(0.5), n(0.5), r(1), n(0.5), n(0.5), r(1)],
      [r(1), n(1), n(0.5), n(0.5), n(1)],
      [r(1), n(1), n(2)],
      [r(1), n(1), n(0.5), n(0.5), r(1)],
      [r(1), n(0.5), n(0.5), r(1), n(1)],
      [r(1), r(1), r(1), n(0.5), n(0.5)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 4: Introduce Ta-a-a-a (whole notes)
  // ═══════════════════════════════════════════════════

  {
    id: 24,
    name: 'Ta-a-a-a',
    description: 'Whole notes',
    stage: 4,
    bpm: 76,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(4)],
    ],
  },
  {
    id: 25,
    name: 'Long & Short',
    description: 'Whole notes mixed in',
    stage: 4,
    bpm: 76,
    beatsPerBar: 4,
    bars: 4,
    patterns: [
      [n(4)],
      [n(2), n(1), n(1)],
      [n(1), n(1), n(0.5), n(0.5), n(1)],
      [n(2), n(0.5), n(0.5), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 5: Review Mix (everything so far)
  // ═══════════════════════════════════════════════════

  {
    id: 26,
    name: 'Review Mix',
    description: 'All cells so far',
    stage: 5,
    bpm: 78,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(0.5), n(0.5), n(1)],
      [n(2), n(1), n(1)],
      [n(0.5), n(0.5), n(1), n(0.5), n(0.5), n(1)],
      [n(1), r(1), n(0.5), n(0.5), n(1)],
      [n(2), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(1), r(1), n(1)],
      [n(1), n(1), n(2)],
      [r(1), n(1), n(0.5), n(0.5), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 6: Introduce Tiki-Tiki (sixteenth notes)
  // ═══════════════════════════════════════════════════

  // i) One Tiki-Tiki per bar
  {
    id: 27,
    name: 'Ta Ta Ta Tiki-Tiki',
    description: 'One Tiki-Tiki per bar',
    stage: 6,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(1), n(0.25), n(0.25), n(0.25), n(0.25)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1), n(1)],
      [n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1)],
      [n(1), n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(1)],
    ],
  },

  // ii) Two Tiki-Tiki per bar
  {
    id: 28,
    name: 'Tiki-Tiki Ta Tiki-Tiki Ta',
    description: 'Two Tiki-Tiki per bar',
    stage: 6,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(1)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1)],
      [n(1), n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25)],
      [n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(0.25), n(0.25), n(0.25), n(0.25)],
    ],
  },

  // iii) Ti-Ti and Tiki-Tiki
  {
    id: 29,
    name: 'Ti-Ti Tiki-Tiki Ta',
    description: 'Eighths and sixteenths',
    stage: 6,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1)],
      [n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(0.5), n(1)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(0.5), n(1), n(1)],
      [n(1), n(0.5), n(0.5), n(1), n(0.25), n(0.25), n(0.25), n(0.25)],
    ],
  },

  // iv) Three+ Tiki-Tiki
  {
    id: 30,
    name: 'Tiki-Tiki Tiki-Tiki Tiki-Tiki Ta',
    description: 'Lots of sixteenths',
    stage: 6,
    bpm: 66,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(1)],
      [n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25)],
    ],
  },

  // Stage 6 Mix
  {
    id: 31,
    name: 'Stage 6 Mix',
    description: 'All Tiki-Tiki combos',
    stage: 6,
    bpm: 70,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(1), n(0.25), n(0.25), n(0.25), n(0.25)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1), n(1)],
      [n(0.5), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1)],
      [n(1), n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(0.5)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 7: Ti-Tiki and Tiki-Ti (uneven combos)
  // ═══════════════════════════════════════════════════

  // i) Introduce Ti-Tiki (eighth + two sixteenths)
  {
    id: 32,
    name: 'Ta Ta Ta Ti-Tiki',
    description: 'Introducing Ti-Tiki',
    stage: 7,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(1), n(0.5), n(0.25), n(0.25)],
      [n(0.5), n(0.25), n(0.25), n(1), n(1), n(1)],
      [n(1), n(0.5), n(0.25), n(0.25), n(1), n(1)],
      [n(1), n(1), n(0.5), n(0.25), n(0.25), n(1)],
    ],
  },

  // ii) Two Ti-Tiki
  {
    id: 33,
    name: 'Ti-Tiki Ta Ti-Tiki Ta',
    description: 'Two Ti-Tiki per bar',
    stage: 7,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.25), n(0.25), n(1), n(0.5), n(0.25), n(0.25), n(1)],
      [n(0.5), n(0.25), n(0.25), n(0.5), n(0.25), n(0.25), n(1), n(1)],
      [n(1), n(0.5), n(0.25), n(0.25), n(1), n(0.5), n(0.25), n(0.25)],
    ],
  },

  // iii) Introduce Tiki-Ti (two sixteenths + eighth)
  {
    id: 34,
    name: 'Ta Ta Ta Tiki-Ti',
    description: 'Introducing Tiki-Ti',
    stage: 7,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(1), n(0.25), n(0.25), n(0.5)],
      [n(0.25), n(0.25), n(0.5), n(1), n(1), n(1)],
      [n(1), n(0.25), n(0.25), n(0.5), n(1), n(1)],
      [n(1), n(1), n(0.25), n(0.25), n(0.5), n(1)],
    ],
  },

  // iv) Two Tiki-Ti
  {
    id: 35,
    name: 'Tiki-Ti Ta Tiki-Ti Ta',
    description: 'Two Tiki-Ti per bar',
    stage: 7,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.25), n(0.25), n(0.5), n(1), n(0.25), n(0.25), n(0.5), n(1)],
      [n(0.25), n(0.25), n(0.5), n(0.25), n(0.25), n(0.5), n(1), n(1)],
      [n(1), n(0.25), n(0.25), n(0.5), n(1), n(0.25), n(0.25), n(0.5)],
    ],
  },

  // v) Mix Ti-Tiki and Tiki-Ti
  {
    id: 36,
    name: 'Ti-Tiki Ta Tiki-Ti Ta',
    description: 'Both in one bar',
    stage: 7,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.25), n(0.25), n(1), n(0.25), n(0.25), n(0.5), n(1)],
      [n(0.25), n(0.25), n(0.5), n(1), n(0.5), n(0.25), n(0.25), n(1)],
      [n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(1), n(1)],
      [n(1), n(0.25), n(0.25), n(0.5), n(0.5), n(0.25), n(0.25), n(1)],
    ],
  },

  // Stage 7 Mix
  {
    id: 37,
    name: 'Stage 7 Mix',
    description: 'All uneven sixteenth combos',
    stage: 7,
    bpm: 70,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.25), n(0.25), n(1), n(1), n(1)],
      [n(1), n(0.25), n(0.25), n(0.5), n(1), n(1)],
      [n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(1), n(1)],
      [n(1), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(1)],
      [n(0.25), n(0.25), n(0.5), n(0.5), n(0.25), n(0.25), n(1), n(0.5), n(0.5)],
      [n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 8: Introduce Tam-Ti (dotted quarter + eighth)
  // ═══════════════════════════════════════════════════

  // i) Tam-Ti at the start
  {
    id: 38,
    name: 'Tam-Ti Ta Ta',
    description: 'Dotted quarter + eighth',
    stage: 8,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1.5), n(0.5), n(1), n(1)],
      [n(1), n(1), n(1.5), n(0.5)],
    ],
  },

  // ii) Tam-Ti at the end
  {
    id: 39,
    name: 'Ta Ta Tam-Ti',
    description: 'Quarter notes then dotted',
    stage: 8,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(1.5), n(0.5)],
      [n(1.5), n(0.5), n(1), n(1)],
      [n(1), n(1.5), n(0.5), n(1)],
    ],
  },

  // iii) Two Tam-Ti
  {
    id: 40,
    name: 'Tam-Ti Tam-Ti',
    description: 'Two dotted patterns',
    stage: 8,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1.5), n(0.5), n(1.5), n(0.5)],
    ],
  },

  // iv) Tam-Ti with Ti-Ti
  {
    id: 41,
    name: 'Tam-Ti Ti-Ti Ta',
    description: 'Dotted quarter with eighths',
    stage: 8,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(1.5), n(0.5), n(1)],
      [n(1), n(0.5), n(0.5), n(1.5), n(0.5)],
    ],
  },

  // v) Tam-Ti with Tiki-Tiki
  {
    id: 42,
    name: 'Tam-Ti Tiki-Tiki Ta',
    description: 'Dotted quarter with sixteenths',
    stage: 8,
    bpm: 70,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1.5), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(1)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1.5), n(0.5)],
      [n(1.5), n(0.5), n(1), n(0.25), n(0.25), n(0.25), n(0.25)],
    ],
  },

  // Stage 8 Mix
  {
    id: 43,
    name: 'Stage 8 Mix',
    description: 'All Tam-Ti combos',
    stage: 8,
    bpm: 74,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1.5), n(0.5), n(1), n(1)],
      [n(1), n(1), n(1.5), n(0.5)],
      [n(1.5), n(0.5), n(1.5), n(0.5)],
      [n(1.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(1.5), n(0.5), n(1)],
      [n(1.5), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(1)],
      [n(1), n(0.5), n(0.5), n(1.5), n(0.5)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 9: Introduce To-e. (dotted half = 3 beats)
  // ═══════════════════════════════════════════════════

  // i) To-e. Ta
  {
    id: 44,
    name: 'To-e. Ta',
    description: 'Dotted half + quarter',
    stage: 9,
    bpm: 74,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(3), n(1)],
      [n(1), n(3)],
    ],
  },

  // ii) To-e. with eighths
  {
    id: 45,
    name: 'To-e. Ti-Ti',
    description: 'Dotted half + eighths',
    stage: 9,
    bpm: 74,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(3), n(0.5), n(0.5)],
      [n(0.5), n(0.5), n(3)],
    ],
  },

  // iii) To-e. mixed
  {
    id: 46,
    name: 'To-e. Patterns',
    description: 'Dotted half mixed in',
    stage: 9,
    bpm: 74,
    beatsPerBar: 4,
    bars: 4,
    patterns: [
      [n(3), n(1)],
      [n(1), n(3)],
      [n(3), n(0.5), n(0.5)],
      [n(2), n(1), n(1)],
      [n(1), n(1), n(0.5), n(0.5), n(1)],
      [n(1.5), n(0.5), n(1), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 10: The Grand Mix
  // ═══════════════════════════════════════════════════

  {
    id: 47,
    name: 'Grand Mix',
    description: 'All cells combined',
    stage: 10,
    bpm: 78,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(1), n(0.5), n(0.5), n(1)],
      [n(2), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.25), n(0.25), n(1), n(0.25), n(0.25), n(0.5), n(1)],
      [n(1.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(0.5), n(1), n(1)],
      [n(1), r(1), n(0.5), n(0.25), n(0.25), n(1)],
      [n(0.5), n(0.5), n(1), r(1), n(1)],
      [n(1), n(0.25), n(0.25), n(0.5), n(1.5), n(0.5)],
      [r(1), n(0.5), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(1)],
    ],
  },
  {
    id: 48,
    name: 'Speed Round',
    description: 'Everything faster',
    stage: 10,
    bpm: 92,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(0.5), n(0.25), n(0.25), n(1), n(1)],
      [n(0.25), n(0.25), n(0.5), n(0.5), n(0.5), n(1), n(1)],
      [n(1.5), n(0.5), n(0.5), n(0.5), n(1)],
      [n(1), r(1), n(0.5), n(0.25), n(0.25), n(1)],
      [n(0.5), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1)],
      [n(0.25), n(0.25), n(0.5), n(1), n(0.5), n(0.25), n(0.25), n(1)],
      [n(1), n(1), n(0.25), n(0.25), n(0.25), n(0.25), n(0.5), n(0.5)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 11: Eighth rests
  // ═══════════════════════════════════════════════════

  {
    id: 49,
    name: 'Ta (shh) Ti Ta',
    description: 'Eighth rests',
    stage: 11,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), r(0.5), n(0.5), n(1), n(1)],
      [r(0.5), n(0.5), n(1), n(1), n(1)],
      [n(1), n(1), r(0.5), n(0.5), n(1)],
      [n(1), n(1), n(1), r(0.5), n(0.5)],
    ],
  },
  {
    id: 50,
    name: 'Ti (shh) Ti (shh)',
    description: 'Eighth rests alternating',
    stage: 11,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), r(0.5), n(0.5), r(0.5), n(1), n(1)],
      [n(1), n(0.5), r(0.5), n(0.5), r(0.5), n(1)],
      [n(0.5), r(0.5), n(1), n(0.5), r(0.5), n(1)],
    ],
  },
  {
    id: 51,
    name: 'Ti-Ti (shh) Ti-Ti',
    description: 'Eighth rests with eighths',
    stage: 11,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(0.5), r(0.5), n(0.5), n(1), n(1)],
      [n(1), n(0.5), n(0.5), r(0.5), n(0.5), n(1)],
      [r(0.5), n(0.5), n(0.5), n(0.5), n(1), n(1)],
    ],
  },
  {
    id: 52,
    name: 'Stage 11 Mix',
    description: 'All eighth rest patterns',
    stage: 11,
    bpm: 74,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), r(0.5), n(0.5), n(1), n(1)],
      [n(0.5), r(0.5), n(0.5), r(0.5), n(1), n(1)],
      [n(0.5), n(0.5), r(0.5), n(0.5), n(1), n(1)],
      [r(0.5), n(0.5), n(1), n(0.5), r(0.5), n(1)],
      [n(1), n(1), r(0.5), n(0.5), n(0.5), n(0.5)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 12: Sixteenth rests
  // ═══════════════════════════════════════════════════

  {
    id: 53,
    name: 'Tiki (shh) ki Ta',
    description: 'Sixteenth rests',
    stage: 12,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.25), n(0.25), r(0.25), n(0.25), n(1), n(1), n(1)],
      [r(0.25), n(0.25), n(0.25), n(0.25), n(1), n(1), n(1)],
      [n(0.25), r(0.25), n(0.25), n(0.25), n(1), n(1), n(1)],
      [n(0.25), n(0.25), n(0.25), r(0.25), n(1), n(1), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 13: Whole rests
  // ═══════════════════════════════════════════════════

  {
    id: 54,
    name: 'Full Bar Rest',
    description: 'Whole bar of silence',
    stage: 13,
    bpm: 76,
    beatsPerBar: 4,
    bars: 4,
    patterns: [
      [r(4)],
      [n(1), n(1), n(1), n(1)],
      [n(0.5), n(0.5), n(1), n(1), n(1)],
      [n(2), n(1), n(1)],
    ],
  },
  {
    id: 55,
    name: 'Rest & Play',
    description: 'Whole rests mixed in',
    stage: 13,
    bpm: 76,
    beatsPerBar: 4,
    bars: 4,
    patterns: [
      [r(4)],
      [n(1), n(0.5), n(0.5), n(1), n(1)],
      [n(0.5), n(0.5), n(0.5), n(0.5), n(1), n(1)],
      [n(2), n(0.5), n(0.5), n(1)],
      [n(1), n(1), n(2)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 14: Syncopation (Ti-Ta-Ti)
  // ═══════════════════════════════════════════════════

  {
    id: 56,
    name: 'Ti-Ta-Ti Ta Ta',
    description: 'Introducing syncopation',
    stage: 14,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(1), n(0.5), n(1), n(1)],
      [n(1), n(1), n(0.5), n(1), n(0.5)],
    ],
  },
  {
    id: 57,
    name: 'Ta Ti-Ta-Ti Ta',
    description: 'Syncopation in the middle',
    stage: 14,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), n(0.5), n(1), n(0.5), n(1)],
      [n(0.5), n(0.5), n(0.5), n(1), n(0.5), n(1)],
    ],
  },
  {
    id: 58,
    name: 'Ti-Ta-Ti Ti-Ta-Ti',
    description: 'Double syncopation',
    stage: 14,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(1), n(0.5), n(0.5), n(1), n(0.5)],
    ],
  },
  {
    id: 59,
    name: 'Ti-Ta-Ti Ti-Ti Ta',
    description: 'Syncopation with eighths',
    stage: 14,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(1), n(0.5), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.5), n(0.5), n(1), n(0.5), n(1)],
      [n(0.5), n(1), n(0.5), n(1), n(0.5), n(0.5)],
    ],
  },
  {
    id: 60,
    name: 'Stage 14 Mix',
    description: 'All syncopation patterns',
    stage: 14,
    bpm: 76,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(1), n(0.5), n(1), n(1)],
      [n(1), n(0.5), n(1), n(0.5), n(1)],
      [n(0.5), n(1), n(0.5), n(0.5), n(1), n(0.5)],
      [n(0.5), n(1), n(0.5), n(0.5), n(0.5), n(1)],
      [n(1), n(1), n(0.5), n(1), n(0.5)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 15: Dotted eighth + sixteenth (Tam-ka)
  // ═══════════════════════════════════════════════════

  {
    id: 61,
    name: 'Tam-ka Ta Ta Ta',
    description: 'Dotted eighth + sixteenth',
    stage: 15,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.75), n(0.25), n(1), n(1), n(1)],
      [n(1), n(1), n(0.75), n(0.25), n(1)],
      [n(1), n(1), n(1), n(0.75), n(0.25)],
    ],
  },
  {
    id: 62,
    name: 'Tam-ka Tam-ka Ta',
    description: 'Two dotted eighth patterns',
    stage: 15,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.75), n(0.25), n(0.75), n(0.25), n(1), n(1)],
      [n(1), n(0.75), n(0.25), n(0.75), n(0.25), n(1)],
      [n(0.75), n(0.25), n(1), n(0.75), n(0.25), n(1)],
    ],
  },
  {
    id: 63,
    name: 'ka-Tam Ta Ta',
    description: 'Scotch snap — reverse',
    stage: 15,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.25), n(0.75), n(1), n(1), n(1)],
      [n(1), n(0.25), n(0.75), n(1), n(1)],
      [n(1), n(1), n(0.25), n(0.75), n(1)],
    ],
  },
  {
    id: 64,
    name: 'Stage 15 Mix',
    description: 'All dotted eighth combos',
    stage: 15,
    bpm: 74,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.75), n(0.25), n(1), n(1), n(1)],
      [n(0.75), n(0.25), n(0.75), n(0.25), n(1), n(1)],
      [n(0.25), n(0.75), n(1), n(1), n(1)],
      [n(1), n(0.75), n(0.25), n(0.5), n(0.5), n(1)],
      [n(0.75), n(0.25), n(0.5), n(0.5), n(1), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 16: Ties
  // ═══════════════════════════════════════════════════

  {
    id: 65,
    name: 'Ta (hold) Ta Ta',
    description: 'Tied quarter notes',
    stage: 16,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), nt(1), n(1), n(1)],
      [n(1), n(1), n(1), nt(1)],
    ],
  },
  {
    id: 66,
    name: 'Ti-Ti (hold) Ta',
    description: 'Tied eighths',
    stage: 16,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), nt(0.5), n(1), n(1), n(1)],
      [n(1), n(0.5), nt(0.5), n(1), n(1)],
      [n(1), n(1), n(0.5), nt(0.5), n(1)],
    ],
  },
  {
    id: 67,
    name: 'To-e (hold) Ta',
    description: 'Tied half note',
    stage: 16,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(2), nt(1), n(1)],
      [n(1), n(2), nt(1)],
    ],
  },
  {
    id: 68,
    name: 'Stage 16 Mix',
    description: 'All tie patterns',
    stage: 16,
    bpm: 74,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(1), nt(1), n(1), n(1)],
      [n(0.5), nt(0.5), n(1), n(1), n(1)],
      [n(2), nt(1), n(1)],
      [n(1), n(1), n(0.5), nt(0.5), n(1)],
      [n(0.5), n(0.5), n(1), nt(1), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 17: Triplets (Tri-pe-let)
  // ═══════════════════════════════════════════════════

  {
    id: 69,
    name: 'Tri-pe-let Ta Ta Ta',
    description: 'Introducing triplets',
    stage: 17,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(tri), n(tri), n(tri), n(1), n(1), n(1)],
      [n(1), n(tri), n(tri), n(tri), n(1), n(1)],
      [n(1), n(1), n(tri), n(tri), n(tri), n(1)],
      [n(1), n(1), n(1), n(tri), n(tri), n(tri)],
    ],
  },
  {
    id: 70,
    name: 'Two Triplets',
    description: 'Two triplets per bar',
    stage: 17,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(tri), n(tri), n(tri), n(tri), n(tri), n(tri), n(1), n(1)],
      [n(1), n(tri), n(tri), n(tri), n(1), n(tri), n(tri), n(tri)],
      [n(tri), n(tri), n(tri), n(1), n(1), n(tri), n(tri), n(tri)],
    ],
  },
  {
    id: 71,
    name: 'Triplets & Ti-Ti',
    description: 'Triplets with eighths',
    stage: 17,
    bpm: 72,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(tri), n(tri), n(tri), n(0.5), n(0.5), n(1), n(1)],
      [n(0.5), n(0.5), n(tri), n(tri), n(tri), n(1), n(1)],
      [n(1), n(tri), n(tri), n(tri), n(0.5), n(0.5), n(1)],
    ],
  },
  {
    id: 72,
    name: 'Stage 17 Mix',
    description: 'All triplet patterns',
    stage: 17,
    bpm: 76,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(tri), n(tri), n(tri), n(1), n(1), n(1)],
      [n(1), n(tri), n(tri), n(tri), n(1), n(1)],
      [n(tri), n(tri), n(tri), n(tri), n(tri), n(tri), n(1), n(1)],
      [n(tri), n(tri), n(tri), n(0.5), n(0.5), n(1), n(1)],
      [n(0.5), n(0.5), n(1), n(tri), n(tri), n(tri), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 18: Dotted sixteenth + thirty-second
  // ═══════════════════════════════════════════════════

  {
    id: 73,
    name: 'Tim-ka Ta Ta Ta',
    description: 'Dotted sixteenth + thirty-second',
    stage: 18,
    bpm: 68,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.375), n(0.125), n(0.375), n(0.125), n(1), n(1), n(1)],
      [n(1), n(0.375), n(0.125), n(0.375), n(0.125), n(1), n(1)],
      [n(1), n(1), n(0.375), n(0.125), n(0.375), n(0.125), n(1)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 19: Dotted whole note (in 6/4)
  // ═══════════════════════════════════════════════════

  {
    id: 74,
    name: 'Dotted Whole',
    description: 'Dotted whole note in 6/4',
    stage: 19,
    bpm: 76,
    beatsPerBar: 6,
    beatUnit: 4,
    bars: 2,
    patterns: [
      [n(6)],
      [n(2), n(2), n(2)],
      [n(1), n(1), n(1), n(1), n(1), n(1)],
      [n(3), n(3)],
    ],
  },

  // ═══════════════════════════════════════════════════
  // STAGE 20: The Ultimate Mix
  // ═══════════════════════════════════════════════════

  {
    id: 75,
    name: 'Ultimate Mix',
    description: 'Everything combined',
    stage: 20,
    bpm: 78,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(1), n(0.5), n(1), n(1)],
      [n(0.75), n(0.25), n(0.5), n(0.5), n(1), n(1)],
      [n(tri), n(tri), n(tri), n(1), n(0.5), n(0.5), n(1)],
      [n(1.5), n(0.5), n(0.25), n(0.25), n(0.25), n(0.25), n(1)],
      [n(1), nt(1), n(0.5), n(0.5), n(1)],
      [n(0.5), n(0.25), n(0.25), r(1), n(0.5), n(1), n(0.5)],
      [n(0.25), n(0.25), n(0.5), n(0.75), n(0.25), n(1), n(1)],
      [r(0.5), n(0.5), n(0.5), n(0.5), n(0.5), n(1), n(0.5)],
    ],
  },
  {
    id: 76,
    name: 'Ultimate Speed',
    description: 'Everything at 96 BPM',
    stage: 20,
    bpm: 96,
    beatsPerBar: 4,
    bars: 2,
    patterns: [
      [n(0.5), n(1), n(0.5), n(0.5), n(0.5), n(1)],
      [n(0.75), n(0.25), n(1), n(0.75), n(0.25), n(1)],
      [n(tri), n(tri), n(tri), n(0.5), n(0.5), n(1), n(1)],
      [n(1.5), n(0.5), n(1), n(0.5), n(0.5)],
      [n(0.25), n(0.25), n(0.5), n(0.5), n(0.25), n(0.25), n(1), n(1)],
      [r(0.5), n(0.5), n(1), n(0.5), n(1), n(0.5)],
    ],
  },
];

/**
 * Generate a rhythm by randomly picking bars from the level's pattern pool.
 */
export function generateRhythm(level) {
  const { patterns, bars } = level;
  const rhythm = [];

  for (let i = 0; i < bars; i++) {
    const bar = patterns[Math.floor(Math.random() * patterns.length)];
    rhythm.push(...bar);
  }

  return rhythm;
}

export default levels;
