/**
 * SVG rhythm notation renderer.
 * Supports: whole, dotted half, half, dotted quarter, quarter, dotted eighth,
 * eighth, sixteenth, dotted sixteenth notes — with beaming, ties, triplets,
 * and Kodály syllables.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

const STAFF_Y = 55;
const SYLLABLE_Y = 95;
const NOTE_HEAD_RX = 7;
const NOTE_HEAD_RY = 5;
const STEM_HEIGHT = 30;
const FLAG_LENGTH = 12;
const BEAM_THICKNESS = 3.5;
const BEAM_GAP = 5;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 20;
const BAR_EXTEND = 15;
const NOTE_INSET = 8;
const TRIPLET_EPS = 0.02; // epsilon for detecting triplet duration ≈ 1/3

// ─── Main render ────────────────────────────────────

export function renderNotation(container, level) {
  container.innerHTML = '';

  const { rhythm, beatsPerBar, bars } = level;
  const totalBeats = beatsPerBar * bars;

  const width = Math.max(container.clientWidth, 360);
  const height = 110;
  const usableWidth = width - MARGIN_LEFT - MARGIN_RIGHT;
  const beatWidth = usableWidth / totalBeats;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.style.display = 'block';

  svg.appendChild(createLine(MARGIN_LEFT, STAFF_Y, width - MARGIN_RIGHT, STAFF_Y, '#999', 1));
  drawTimeSignature(svg, beatsPerBar, level.beatUnit || 4, 12, STAFF_Y);

  for (let bar = 0; bar <= bars; bar++) {
    const x = MARGIN_LEFT + bar * beatsPerBar * beatWidth;
    svg.appendChild(createLine(x, STAFF_Y - BAR_EXTEND, x, STAFF_Y + BAR_EXTEND, '#666', bar === bars ? 2 : 1));
  }
  const finalX = MARGIN_LEFT + bars * beatsPerBar * beatWidth - 4;
  svg.appendChild(createLine(finalX, STAFF_Y - BAR_EXTEND, finalX, STAFF_Y + BAR_EXTEND, '#666', 1));

  const groups = groupSubBeatNotes(rhythm);
  const notePositions = [];
  let currentBeat = 0;
  let prevNoteX = null;

  for (const group of groups) {
    if (group.beam) {
      const xPositions = [];
      let groupBeat = currentBeat;
      for (const ev of group.events) {
        const x = MARGIN_LEFT + groupBeat * beatWidth + NOTE_INSET;
        xPositions.push(x);
        notePositions.push({ x, beatStart: groupBeat, duration: ev.duration, type: 'note', tie: !!ev.tie });
        groupBeat += ev.duration;
      }

      // Check if first note is tied
      if (group.events[0].tie && prevNoteX !== null) {
        drawTieArc(svg, prevNoteX, xPositions[0], STAFF_Y);
      }

      if (group.triplet) {
        drawTripletGroup(svg, group.events, xPositions, STAFF_Y);
      } else {
        drawBeamedGroup(svg, group.events, xPositions, STAFF_Y);
      }

      const midX = (xPositions[0] + xPositions[xPositions.length - 1]) / 2;
      drawSyllable(svg, midX, SYLLABLE_Y, getGroupSyllable(group.events), 'note');
      prevNoteX = xPositions[xPositions.length - 1];
      currentBeat = groupBeat;
    } else {
      const ev = group.events[0];
      const x = MARGIN_LEFT + currentBeat * beatWidth + NOTE_INSET;
      notePositions.push({ x, beatStart: currentBeat, duration: ev.duration, type: ev.type, tie: !!ev.tie });

      if (ev.type === 'note') {
        if (ev.tie && prevNoteX !== null) {
          drawTieArc(svg, prevNoteX, x, STAFF_Y);
        }
        drawNote(svg, x, STAFF_Y, ev.duration);
        drawSyllable(svg, x, SYLLABLE_Y, ev.tie ? '\u2014' : getNoteSyllable(ev.duration), 'note');
        prevNoteX = x;
      } else {
        drawRest(svg, x, STAFF_Y, ev.duration);
        drawSyllable(svg, x, SYLLABLE_Y, 'shh', 'rest');
        prevNoteX = null;
      }
      currentBeat += ev.duration;
    }
  }

  container.appendChild(svg);
  return { notePositions, totalBeats, marginLeft: MARGIN_LEFT, marginRight: MARGIN_RIGHT, width, beatWidth, svg };
}

// ─── Grouping ───────────────────────────────────────

function groupSubBeatNotes(rhythm) {
  const groups = [];
  let i = 0;
  let currentBeat = 0;

  while (i < rhythm.length) {
    const ev = rhythm[i];

    if (ev.type === 'note' && ev.duration < 1) {
      const beatBoundary = Math.floor(currentBeat + 0.01) + 1;
      const beamGroup = [ev];
      let lookBeat = currentBeat + ev.duration;
      let j = i + 1;

      while (j < rhythm.length && rhythm[j].type === 'note' && rhythm[j].duration < 1 && lookBeat + 0.01 < beatBoundary) {
        beamGroup.push(rhythm[j]);
        lookBeat += rhythm[j].duration;
        j++;
      }

      if (beamGroup.length >= 2) {
        const isTriplet = beamGroup.length === 3 && beamGroup.every((e) => Math.abs(e.duration - 1 / 3) < TRIPLET_EPS);
        groups.push({ beam: true, events: beamGroup, triplet: isTriplet });
        currentBeat += beamGroup.reduce((s, e) => s + e.duration, 0);
        i = j;
      } else {
        groups.push({ beam: false, events: [ev] });
        currentBeat += ev.duration;
        i++;
      }
    } else {
      groups.push({ beam: false, events: [ev] });
      currentBeat += ev.duration;
      i++;
    }
  }
  return groups;
}

// ─── Note drawing ───────────────────────────────────

function drawNote(svg, x, y, duration) {
  if (duration >= 3.5) {
    // Whole note (4) or dotted whole (6)
    drawNoteHead(svg, x, y, false, true);
    if (Math.abs(duration - 6) < 0.01) drawDot(svg, x, y);
  } else if (Math.abs(duration - 3) < 0.01) {
    drawNoteHead(svg, x, y, false, false);
    drawStem(svg, x, y);
    drawDot(svg, x, y);
  } else if (Math.abs(duration - 2) < 0.01) {
    drawNoteHead(svg, x, y, false, false);
    drawStem(svg, x, y);
  } else if (Math.abs(duration - 1.5) < 0.01) {
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
    drawDot(svg, x, y);
  } else if (Math.abs(duration - 1) < 0.01) {
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
  } else if (Math.abs(duration - 0.75) < 0.01) {
    // Dotted eighth
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
    drawFlag(svg, x, y, 1);
    drawDot(svg, x, y);
  } else if (Math.abs(duration - 0.5) < 0.01) {
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
    drawFlag(svg, x, y, 1);
  } else if (Math.abs(duration - 0.375) < 0.01) {
    // Dotted sixteenth
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
    drawFlag(svg, x, y, 2);
    drawDot(svg, x, y);
  } else if (duration < 0.34 && duration > 0.3) {
    // Triplet eighth (1/3)
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
    drawFlag(svg, x, y, 1);
  } else if (Math.abs(duration - 0.25) < 0.01) {
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
    drawFlag(svg, x, y, 2);
  } else if (Math.abs(duration - 0.125) < 0.01) {
    // Thirty-second note
    drawNoteHead(svg, x, y, true, false);
    drawStem(svg, x, y);
    drawFlag(svg, x, y, 3);
  }
}

function drawNoteHead(svg, x, y, filled, isWhole) {
  const head = document.createElementNS(SVG_NS, 'ellipse');
  head.setAttribute('cx', x);
  head.setAttribute('cy', y);
  head.setAttribute('rx', isWhole ? NOTE_HEAD_RX + 2 : NOTE_HEAD_RX);
  head.setAttribute('ry', NOTE_HEAD_RY);
  head.setAttribute('transform', `rotate(-15, ${x}, ${y})`);
  head.setAttribute('fill', filled ? '#222' : 'white');
  head.setAttribute('stroke', '#222');
  head.setAttribute('stroke-width', filled ? '0' : '2');
  svg.appendChild(head);
}

function drawStem(svg, x, y) {
  const stemX = x + NOTE_HEAD_RX - 1;
  svg.appendChild(createLine(stemX, y, stemX, y - STEM_HEIGHT, '#222', 2));
}

function drawDot(svg, x, y) {
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', x + NOTE_HEAD_RX + 5);
  dot.setAttribute('cy', y - 3);
  dot.setAttribute('r', 2);
  dot.setAttribute('fill', '#222');
  svg.appendChild(dot);
}

function drawFlag(svg, x, y, count) {
  const stemX = x + NOTE_HEAD_RX - 1;
  const stemTop = y - STEM_HEIGHT;
  for (let f = 0; f < count; f++) {
    const offset = f * 7;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${stemX} ${stemTop + offset} q 4 8 0 ${FLAG_LENGTH} q 6 -4 2 -${FLAG_LENGTH + 2}`);
    path.setAttribute('fill', '#222');
    svg.appendChild(path);
  }
}

// ─── Ties ───────────────────────────────────────────

function drawTieArc(svg, x1, x2, y) {
  const midX = (x1 + x2) / 2;
  const ty = y + NOTE_HEAD_RY + 2;
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', `M ${x1} ${ty} Q ${midX} ${ty + 12} ${x2} ${ty}`);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#222');
  path.setAttribute('stroke-width', '1.5');
  svg.appendChild(path);
}

// ─── Beamed groups ──────────────────────────────────

function drawBeamedGroup(svg, events, xPositions, y) {
  for (let i = 0; i < events.length; i++) {
    drawNoteHead(svg, xPositions[i], y, true, false);
    drawStem(svg, xPositions[i], y);
    // Dot for dotted notes within beam
    if (isDotted(events[i].duration)) {
      drawDot(svg, xPositions[i], y);
    }
  }

  const stemXs = xPositions.map((x) => x + NOTE_HEAD_RX - 1);
  const beamY = y - STEM_HEIGHT;

  drawBeamRect(svg, stemXs[0], stemXs[stemXs.length - 1], beamY);

  // Secondary beam for sixteenths
  let runStart = null;
  for (let i = 0; i <= events.length; i++) {
    const isSixteenth = i < events.length && (Math.abs(events[i].duration - 0.25) < 0.01 || Math.abs(events[i].duration - 0.125) < 0.01 || Math.abs(events[i].duration - 0.375) < 0.01);
    if (isSixteenth && runStart === null) {
      runStart = i;
    } else if (!isSixteenth && runStart !== null) {
      const runEnd = i - 1;
      if (runEnd > runStart) {
        drawBeamRect(svg, stemXs[runStart], stemXs[runEnd], beamY + BEAM_GAP);
      } else {
        const stubLen = 6;
        const sx = stemXs[runStart];
        if (runStart === 0) drawBeamRect(svg, sx, sx + stubLen, beamY + BEAM_GAP);
        else drawBeamRect(svg, sx - stubLen, sx, beamY + BEAM_GAP);
      }
      runStart = null;
    }
  }
}

function drawTripletGroup(svg, events, xPositions, y) {
  for (let i = 0; i < events.length; i++) {
    drawNoteHead(svg, xPositions[i], y, true, false);
    drawStem(svg, xPositions[i], y);
  }

  const stemXs = xPositions.map((x) => x + NOTE_HEAD_RX - 1);
  const beamY = y - STEM_HEIGHT;
  drawBeamRect(svg, stemXs[0], stemXs[stemXs.length - 1], beamY);

  // Triplet bracket with "3"
  const midX = (stemXs[0] + stemXs[stemXs.length - 1]) / 2;
  const bracketY = beamY - 8;
  svg.appendChild(createLine(stemXs[0], bracketY + 4, stemXs[0], bracketY, '#666', 1));
  svg.appendChild(createLine(stemXs[stemXs.length - 1], bracketY + 4, stemXs[stemXs.length - 1], bracketY, '#666', 1));
  svg.appendChild(createLine(stemXs[0], bracketY, midX - 5, bracketY, '#666', 1));
  svg.appendChild(createLine(midX + 5, bracketY, stemXs[stemXs.length - 1], bracketY, '#666', 1));
  const txt = document.createElementNS(SVG_NS, 'text');
  txt.setAttribute('x', midX);
  txt.setAttribute('y', bracketY + 4);
  txt.setAttribute('text-anchor', 'middle');
  txt.setAttribute('font-size', '9');
  txt.setAttribute('font-weight', 'bold');
  txt.setAttribute('fill', '#666');
  txt.textContent = '3';
  svg.appendChild(txt);
}

function isDotted(d) {
  return Math.abs(d - 0.75) < 0.01 || Math.abs(d - 0.375) < 0.01 || Math.abs(d - 1.5) < 0.01 || Math.abs(d - 3) < 0.01;
}

function drawBeamRect(svg, x1, x2, y) {
  const beam = document.createElementNS(SVG_NS, 'rect');
  beam.setAttribute('x', Math.min(x1, x2));
  beam.setAttribute('y', y);
  beam.setAttribute('width', Math.abs(x2 - x1) || 1);
  beam.setAttribute('height', BEAM_THICKNESS);
  beam.setAttribute('fill', '#222');
  svg.appendChild(beam);
}

// ─── Rests ──────────────────────────────────────────

function drawRest(svg, x, y, duration) {
  if (Math.abs(duration - 4) < 0.01) {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x - 8); rect.setAttribute('y', y - 10);
    rect.setAttribute('width', 16); rect.setAttribute('height', 6);
    rect.setAttribute('fill', '#222');
    svg.appendChild(rect);
  } else if (Math.abs(duration - 2) < 0.01) {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x - 8); rect.setAttribute('y', y - 6);
    rect.setAttribute('width', 16); rect.setAttribute('height', 6);
    rect.setAttribute('fill', '#222');
    svg.appendChild(rect);
  } else if (Math.abs(duration - 1) < 0.01) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d',
      `M ${x + 2} ${y - 14} C ${x + 2} ${y - 14} ${x - 4} ${y - 8} ${x - 4} ${y - 6} C ${x - 4} ${y - 4} ${x + 4} ${y - 2} ${x + 4} ${y} C ${x + 4} ${y + 2} ${x - 6} ${y + 8} ${x - 4} ${y + 12} C ${x - 3} ${y + 14} ${x} ${y + 12} ${x - 1} ${y + 10} C ${x - 2} ${y + 8} ${x + 4} ${y + 4} ${x + 4} ${y} C ${x + 4} ${y - 2} ${x - 4} ${y - 4} ${x - 4} ${y - 6} C ${x - 4} ${y - 8} ${x + 2} ${y - 14} ${x + 2} ${y - 14} Z`
    );
    path.setAttribute('fill', '#222');
    svg.appendChild(path);
  } else if (Math.abs(duration - 0.5) < 0.01) {
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', x + 4); dot.setAttribute('cy', y - 9);
    dot.setAttribute('r', 2.5); dot.setAttribute('fill', '#222');
    svg.appendChild(dot);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${x + 4} ${y - 7} C ${x} ${y - 3} ${x - 2} ${y - 1} ${x - 4} ${y + 8}`);
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#222');
    path.setAttribute('stroke-width', '2'); path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
  } else if (Math.abs(duration - 0.25) < 0.01) {
    // Sixteenth rest: two dots with curved stem
    const dot1 = document.createElementNS(SVG_NS, 'circle');
    dot1.setAttribute('cx', x + 4); dot1.setAttribute('cy', y - 12);
    dot1.setAttribute('r', 2); dot1.setAttribute('fill', '#222');
    svg.appendChild(dot1);
    const dot2 = document.createElementNS(SVG_NS, 'circle');
    dot2.setAttribute('cx', x + 4); dot2.setAttribute('cy', y - 5);
    dot2.setAttribute('r', 2); dot2.setAttribute('fill', '#222');
    svg.appendChild(dot2);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', `M ${x + 4} ${y - 10} C ${x} ${y - 6} ${x - 2} ${y - 3} ${x - 4} ${y + 6}`);
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#222');
    path.setAttribute('stroke-width', '2'); path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
  }
}

// ─── Time signature ─────────────────────────────────

function drawTimeSignature(svg, top, bottom, x, y) {
  for (const [val, dy] of [[top, y - 4], [bottom, y + 16]]) {
    const t = document.createElementNS(SVG_NS, 'text');
    t.setAttribute('x', x); t.setAttribute('y', dy);
    t.setAttribute('font-size', '18'); t.setAttribute('font-weight', 'bold');
    t.setAttribute('font-family', 'serif'); t.setAttribute('text-anchor', 'middle');
    t.setAttribute('fill', '#222'); t.textContent = val;
    svg.appendChild(t);
  }
}

// ─── Cursor & highlights ────────────────────────────

export function createCursor(svg) {
  const cursor = document.createElementNS(SVG_NS, 'circle');
  cursor.setAttribute('cx', MARGIN_LEFT); cursor.setAttribute('cy', STAFF_Y);
  cursor.setAttribute('r', '14');
  cursor.setAttribute('fill', 'rgba(59, 130, 246, 0.25)');
  cursor.setAttribute('stroke', 'rgba(59, 130, 246, 0.6)');
  cursor.setAttribute('stroke-width', '2');
  cursor.classList.add('playback-cursor');
  svg.appendChild(cursor);
  return cursor;
}

export function updateCursor(cursor, currentBeat, beatWidth, notePositions) {
  if (!notePositions || notePositions.length === 0) {
    cursor.setAttribute('cx', MARGIN_LEFT + currentBeat * beatWidth + NOTE_INSET);
    return;
  }
  let activeNote = notePositions[0];
  for (let i = 0; i < notePositions.length; i++) {
    const np = notePositions[i];
    const nextBeat = i + 1 < notePositions.length ? notePositions[i + 1].beatStart : Infinity;
    if (currentBeat >= np.beatStart - 0.01 && currentBeat < nextBeat) {
      activeNote = np;
      break;
    }
  }
  cursor.setAttribute('cx', activeNote.x);
}

export function highlightNote(svg, notePos, quality) {
  const colors = { perfect: '#22c55e', great: '#84cc16', good: '#eab308', miss: '#ef4444' };
  const circle = document.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('cx', notePos.x); circle.setAttribute('cy', STAFF_Y);
  circle.setAttribute('r', '14');
  circle.setAttribute('fill', colors[quality] || colors.miss);
  circle.setAttribute('opacity', '0.4');
  svg.appendChild(circle);
  setTimeout(() => { circle.setAttribute('opacity', '0'); setTimeout(() => circle.remove(), 100); }, 300);
}

// ─── Kodály syllables ───────────────────────────────

function getNoteSyllable(duration) {
  if (Math.abs(duration - 6) < 0.01) return 'Ta-a-a-a-a-a';
  if (Math.abs(duration - 4) < 0.01) return 'Ta-a-a-a';
  if (Math.abs(duration - 3) < 0.01) return 'To-e.';
  if (Math.abs(duration - 2) < 0.01) return 'To-e';
  if (Math.abs(duration - 1.5) < 0.01) return 'Tam';
  if (Math.abs(duration - 1) < 0.01) return 'Ta';
  if (Math.abs(duration - 0.75) < 0.01) return 'Tam';
  if (Math.abs(duration - 0.5) < 0.01) return 'Ti';
  if (Math.abs(duration - 0.375) < 0.01) return 'Tim';
  if (duration > 0.3 && duration < 0.35) return 'Tri';
  if (Math.abs(duration - 0.25) < 0.01) return 'Ti';
  if (Math.abs(duration - 0.125) < 0.01) return 'Ti';
  return '';
}

function getGroupSyllable(events) {
  const ds = events.map((e) => e.duration);
  const key = ds.map((d) => d.toFixed(3)).join(',');

  // Triplet
  if (events.length === 3 && ds.every((d) => Math.abs(d - 1 / 3) < TRIPLET_EPS)) return 'Tri-pe-let';

  // Common cells
  const k2 = ds.map((d) => Math.round(d * 100)).join(',');
  const map = {
    '50,50': 'Ti-Ti',
    '25,25,25,25': 'Tiki-Tiki',
    '50,25,25': 'Ti-Tiki',
    '25,25,50': 'Tiki-Ti',
    '75,25': 'Tam-ka',
    '25,75': 'ka-Tam',
    '38,13': 'Tim-ka',
    '13,38': 'ka-Tim',
  };
  if (map[k2]) return map[k2];

  return ds.map((d) => getNoteSyllable(d)).join('-');
}

function drawSyllable(svg, x, y, text, type) {
  const el = document.createElementNS(SVG_NS, 'text');
  el.setAttribute('x', x); el.setAttribute('y', y);
  el.setAttribute('text-anchor', 'middle'); el.setAttribute('font-size', '10');
  el.setAttribute('font-family', '-apple-system, BlinkMacSystemFont, sans-serif');
  el.setAttribute('fill', type === 'rest' ? '#aaa' : '#666');
  el.setAttribute('font-style', type === 'rest' ? 'italic' : 'normal');
  el.textContent = text;
  svg.appendChild(el);
}

// ─── Utility ────────────────────────────────────────

function createLine(x1, y1, x2, y2, color, strokeWidth) {
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', color); line.setAttribute('stroke-width', strokeWidth);
  return line;
}
