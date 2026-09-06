/**
 * Renders visual legends for the tutorial screen showing
 * note and rest symbols with labels.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

const NOTES = [
  { label: '"Ta-a-a-a"', sub: 'Whole note \u2022 4 beats', draw: drawWholeNote },
  { label: '"To-e."', sub: 'Dotted half \u2022 3 beats', draw: drawDottedHalf },
  { label: '"To-e"', sub: 'Half note \u2022 2 beats', draw: drawHalfNote },
  { label: '"Tam-Ti"', sub: 'Dotted quarter + eighth \u2022 2 beats', draw: drawTamTi },
  { label: '"Ta"', sub: 'Quarter note \u2022 1 beat', draw: drawQuarterNote },
  { label: '"Ti-Ti"', sub: 'Eighth notes \u2022 \u00BD beat each', draw: drawEighthNote },
  { label: '"Tiki-Tiki"', sub: 'Sixteenth notes \u2022 \u00BC beat each', draw: drawTikiTiki },
  { label: '"Ti-Tiki"', sub: 'Eighth + 2 sixteenths \u2022 1 beat', draw: drawTiTiki },
  { label: '"Tiki-Ti"', sub: '2 sixteenths + eighth \u2022 1 beat', draw: drawTikiTi },
  { label: '"Tam-ka"', sub: 'Dotted eighth + sixteenth \u2022 1 beat', draw: drawTamKa },
  { label: '"Ti-Ta-Ti"', sub: 'Syncopation \u2022 2 beats', draw: drawSyncopation },
  { label: '"Tri-pe-let"', sub: 'Triplet \u2022 3 in 1 beat', draw: drawTriplet },
  { label: 'Tie', sub: 'Hold across notes', draw: drawTieLegend },
];

const RESTS = [
  { label: '"shh\u2026"', sub: 'Whole rest \u2022 4 beats', draw: drawWholeRest },
  { label: '"shh"', sub: 'Half rest \u2022 2 beats', draw: drawHalfRest },
  { label: '"shh"', sub: 'Quarter rest \u2022 1 beat', draw: drawQuarterRest },
  { label: '"shh"', sub: 'Eighth rest \u2022 \u00BD beat', draw: drawEighthRest },
  { label: '"shh"', sub: 'Sixteenth rest \u2022 \u00BC beat', draw: drawSixteenthRest },
];

export function renderLegend(noteContainer, restContainer) {
  noteContainer.innerHTML = '';
  restContainer.innerHTML = '';

  for (const note of NOTES) {
    noteContainer.appendChild(createLegendItem(note));
  }
  for (const rest of RESTS) {
    restContainer.appendChild(createLegendItem(rest));
  }
}

function createLegendItem({ label, sub, draw }) {
  const item = document.createElement('div');
  item.className = 'legend-item';

  const svgWrap = document.createElement('div');
  svgWrap.className = 'legend-symbol';

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '36');
  svg.setAttribute('height', '44');
  svg.setAttribute('viewBox', '0 0 36 44');
  draw(svg);
  svgWrap.appendChild(svg);

  const labelDiv = document.createElement('div');
  labelDiv.className = 'legend-label';
  labelDiv.innerHTML = `<strong>${label}</strong><span>${sub}</span>`;

  item.appendChild(svgWrap);
  item.appendChild(labelDiv);
  return item;
}

// ─── Note drawing functions ─────────────────────────

function drawWholeNote(svg) {
  const cx = 18, cy = 24;
  const head = document.createElementNS(SVG_NS, 'ellipse');
  head.setAttribute('cx', cx);
  head.setAttribute('cy', cy);
  head.setAttribute('rx', '9');
  head.setAttribute('ry', '5.5');
  head.setAttribute('transform', `rotate(-15, ${cx}, ${cy})`);
  head.setAttribute('fill', 'white');
  head.setAttribute('stroke', '#222');
  head.setAttribute('stroke-width', '2');
  svg.appendChild(head);
}

function drawHalfNote(svg) {
  const cx = 14, cy = 28;
  const head = document.createElementNS(SVG_NS, 'ellipse');
  head.setAttribute('cx', cx);
  head.setAttribute('cy', cy);
  head.setAttribute('rx', '7');
  head.setAttribute('ry', '5');
  head.setAttribute('transform', `rotate(-15, ${cx}, ${cy})`);
  head.setAttribute('fill', 'white');
  head.setAttribute('stroke', '#222');
  head.setAttribute('stroke-width', '2');
  svg.appendChild(head);

  const stem = document.createElementNS(SVG_NS, 'line');
  stem.setAttribute('x1', cx + 6);
  stem.setAttribute('y1', cy);
  stem.setAttribute('x2', cx + 6);
  stem.setAttribute('y2', cy - 22);
  stem.setAttribute('stroke', '#222');
  stem.setAttribute('stroke-width', '2');
  svg.appendChild(stem);
}

function drawQuarterNote(svg) {
  const cx = 14, cy = 28;
  const head = document.createElementNS(SVG_NS, 'ellipse');
  head.setAttribute('cx', cx);
  head.setAttribute('cy', cy);
  head.setAttribute('rx', '7');
  head.setAttribute('ry', '5');
  head.setAttribute('transform', `rotate(-15, ${cx}, ${cy})`);
  head.setAttribute('fill', '#222');
  svg.appendChild(head);

  const stem = document.createElementNS(SVG_NS, 'line');
  stem.setAttribute('x1', cx + 6);
  stem.setAttribute('y1', cy);
  stem.setAttribute('x2', cx + 6);
  stem.setAttribute('y2', cy - 22);
  stem.setAttribute('stroke', '#222');
  stem.setAttribute('stroke-width', '2');
  svg.appendChild(stem);
}

function drawEighthNote(svg) {
  const cx = 12, cy = 30;
  const head = document.createElementNS(SVG_NS, 'ellipse');
  head.setAttribute('cx', cx);
  head.setAttribute('cy', cy);
  head.setAttribute('rx', '7');
  head.setAttribute('ry', '5');
  head.setAttribute('transform', `rotate(-15, ${cx}, ${cy})`);
  head.setAttribute('fill', '#222');
  svg.appendChild(head);

  const stemX = cx + 6;
  const stemTop = cy - 22;
  const stem = document.createElementNS(SVG_NS, 'line');
  stem.setAttribute('x1', stemX);
  stem.setAttribute('y1', cy);
  stem.setAttribute('x2', stemX);
  stem.setAttribute('y2', stemTop);
  stem.setAttribute('stroke', '#222');
  stem.setAttribute('stroke-width', '2');
  svg.appendChild(stem);

  const flag = document.createElementNS(SVG_NS, 'path');
  flag.setAttribute('d', `M ${stemX} ${stemTop} q 4 8 0 12 q 6 -4 2 -14`);
  flag.setAttribute('fill', '#222');
  svg.appendChild(flag);
}

// ─── New note drawing functions ──────────────────────

function drawDottedHalf(svg) {
  // Open head + stem + dot
  drawHalfNote(svg);
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', '26');
  dot.setAttribute('cy', '24');
  dot.setAttribute('r', '2');
  dot.setAttribute('fill', '#222');
  svg.appendChild(dot);
}

function drawTamTi(svg) {
  // Dotted quarter + flagged eighth, side by side
  // Dotted quarter on left
  const cx1 = 8, cy = 28;
  const head1 = document.createElementNS(SVG_NS, 'ellipse');
  head1.setAttribute('cx', cx1);
  head1.setAttribute('cy', cy);
  head1.setAttribute('rx', '5.5');
  head1.setAttribute('ry', '4');
  head1.setAttribute('transform', `rotate(-15, ${cx1}, ${cy})`);
  head1.setAttribute('fill', '#222');
  svg.appendChild(head1);
  const stem1 = document.createElementNS(SVG_NS, 'line');
  stem1.setAttribute('x1', cx1 + 5);
  stem1.setAttribute('y1', cy);
  stem1.setAttribute('x2', cx1 + 5);
  stem1.setAttribute('y2', cy - 18);
  stem1.setAttribute('stroke', '#222');
  stem1.setAttribute('stroke-width', '2');
  svg.appendChild(stem1);
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', cx1 + 10);
  dot.setAttribute('cy', cy - 2);
  dot.setAttribute('r', '1.8');
  dot.setAttribute('fill', '#222');
  svg.appendChild(dot);

  // Eighth note on right
  const cx2 = 24;
  const head2 = document.createElementNS(SVG_NS, 'ellipse');
  head2.setAttribute('cx', cx2);
  head2.setAttribute('cy', cy);
  head2.setAttribute('rx', '5.5');
  head2.setAttribute('ry', '4');
  head2.setAttribute('transform', `rotate(-15, ${cx2}, ${cy})`);
  head2.setAttribute('fill', '#222');
  svg.appendChild(head2);
  const stem2 = document.createElementNS(SVG_NS, 'line');
  stem2.setAttribute('x1', cx2 + 5);
  stem2.setAttribute('y1', cy);
  stem2.setAttribute('x2', cx2 + 5);
  stem2.setAttribute('y2', cy - 18);
  stem2.setAttribute('stroke', '#222');
  stem2.setAttribute('stroke-width', '2');
  svg.appendChild(stem2);
  const flag = document.createElementNS(SVG_NS, 'path');
  flag.setAttribute('d', `M ${cx2 + 5} ${cy - 18} q 3 6 0 9 q 5 -3 1.5 -11`);
  flag.setAttribute('fill', '#222');
  svg.appendChild(flag);
}

function drawTikiTiki(svg) {
  // 4 beamed sixteenths with double beam
  const xs = [4, 12, 20, 28];
  const cy = 30, stemTop = cy - 18;
  for (const x of xs) {
    const h = document.createElementNS(SVG_NS, 'ellipse');
    h.setAttribute('cx', x);
    h.setAttribute('cy', cy);
    h.setAttribute('rx', '4.5');
    h.setAttribute('ry', '3.5');
    h.setAttribute('transform', `rotate(-15, ${x}, ${cy})`);
    h.setAttribute('fill', '#222');
    svg.appendChild(h);
    const s = document.createElementNS(SVG_NS, 'line');
    s.setAttribute('x1', x + 4);
    s.setAttribute('y1', cy);
    s.setAttribute('x2', x + 4);
    s.setAttribute('y2', stemTop);
    s.setAttribute('stroke', '#222');
    s.setAttribute('stroke-width', '1.5');
    svg.appendChild(s);
  }
  // Primary beam
  const b1 = document.createElementNS(SVG_NS, 'rect');
  b1.setAttribute('x', xs[0] + 4);
  b1.setAttribute('y', stemTop);
  b1.setAttribute('width', xs[3] - xs[0]);
  b1.setAttribute('height', '3');
  b1.setAttribute('fill', '#222');
  svg.appendChild(b1);
  // Secondary beam
  const b2 = document.createElementNS(SVG_NS, 'rect');
  b2.setAttribute('x', xs[0] + 4);
  b2.setAttribute('y', stemTop + 4.5);
  b2.setAttribute('width', xs[3] - xs[0]);
  b2.setAttribute('height', '3');
  b2.setAttribute('fill', '#222');
  svg.appendChild(b2);
}

function drawTiTiki(svg) {
  // Eighth + 2 sixteenths beamed: single beam across all, double beam on last two
  const xs = [4, 16, 26];
  const cy = 30, stemTop = cy - 18;
  for (const x of xs) {
    const h = document.createElementNS(SVG_NS, 'ellipse');
    h.setAttribute('cx', x);
    h.setAttribute('cy', cy);
    h.setAttribute('rx', '4.5');
    h.setAttribute('ry', '3.5');
    h.setAttribute('transform', `rotate(-15, ${x}, ${cy})`);
    h.setAttribute('fill', '#222');
    svg.appendChild(h);
    const s = document.createElementNS(SVG_NS, 'line');
    s.setAttribute('x1', x + 4);
    s.setAttribute('y1', cy);
    s.setAttribute('x2', x + 4);
    s.setAttribute('y2', stemTop);
    s.setAttribute('stroke', '#222');
    s.setAttribute('stroke-width', '1.5');
    svg.appendChild(s);
  }
  // Primary beam (all 3)
  const b1 = document.createElementNS(SVG_NS, 'rect');
  b1.setAttribute('x', xs[0] + 4);
  b1.setAttribute('y', stemTop);
  b1.setAttribute('width', xs[2] - xs[0]);
  b1.setAttribute('height', '3');
  b1.setAttribute('fill', '#222');
  svg.appendChild(b1);
  // Secondary beam (last 2 only)
  const b2 = document.createElementNS(SVG_NS, 'rect');
  b2.setAttribute('x', xs[1] + 4);
  b2.setAttribute('y', stemTop + 4.5);
  b2.setAttribute('width', xs[2] - xs[1]);
  b2.setAttribute('height', '3');
  b2.setAttribute('fill', '#222');
  svg.appendChild(b2);
}

function drawTikiTi(svg) {
  // 2 sixteenths + eighth beamed: single beam across all, double beam on first two
  const xs = [4, 14, 26];
  const cy = 30, stemTop = cy - 18;
  for (const x of xs) {
    const h = document.createElementNS(SVG_NS, 'ellipse');
    h.setAttribute('cx', x);
    h.setAttribute('cy', cy);
    h.setAttribute('rx', '4.5');
    h.setAttribute('ry', '3.5');
    h.setAttribute('transform', `rotate(-15, ${x}, ${cy})`);
    h.setAttribute('fill', '#222');
    svg.appendChild(h);
    const s = document.createElementNS(SVG_NS, 'line');
    s.setAttribute('x1', x + 4);
    s.setAttribute('y1', cy);
    s.setAttribute('x2', x + 4);
    s.setAttribute('y2', stemTop);
    s.setAttribute('stroke', '#222');
    s.setAttribute('stroke-width', '1.5');
    svg.appendChild(s);
  }
  // Primary beam (all 3)
  const b1 = document.createElementNS(SVG_NS, 'rect');
  b1.setAttribute('x', xs[0] + 4);
  b1.setAttribute('y', stemTop);
  b1.setAttribute('width', xs[2] - xs[0]);
  b1.setAttribute('height', '3');
  b1.setAttribute('fill', '#222');
  svg.appendChild(b1);
  // Secondary beam (first 2 only)
  const b2 = document.createElementNS(SVG_NS, 'rect');
  b2.setAttribute('x', xs[0] + 4);
  b2.setAttribute('y', stemTop + 4.5);
  b2.setAttribute('width', xs[1] - xs[0]);
  b2.setAttribute('height', '3');
  b2.setAttribute('fill', '#222');
  svg.appendChild(b2);
}

// ─── Rest drawing functions ─────────────────────────

function drawWholeRest(svg) {
  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.setAttribute('x', '9');
  rect.setAttribute('y', '16');
  rect.setAttribute('width', '18');
  rect.setAttribute('height', '7');
  rect.setAttribute('fill', '#222');
  rect.setAttribute('rx', '1');
  svg.appendChild(rect);

  // Reference line above
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', '4');
  line.setAttribute('y1', '16');
  line.setAttribute('x2', '32');
  line.setAttribute('y2', '16');
  line.setAttribute('stroke', '#bbb');
  line.setAttribute('stroke-width', '1');
  svg.appendChild(line);
}

function drawHalfRest(svg) {
  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.setAttribute('x', '9');
  rect.setAttribute('y', '17');
  rect.setAttribute('width', '18');
  rect.setAttribute('height', '7');
  rect.setAttribute('fill', '#222');
  rect.setAttribute('rx', '1');
  svg.appendChild(rect);

  // Reference line below
  const line = document.createElementNS(SVG_NS, 'line');
  line.setAttribute('x1', '4');
  line.setAttribute('y1', '24');
  line.setAttribute('x2', '32');
  line.setAttribute('y2', '24');
  line.setAttribute('stroke', '#bbb');
  line.setAttribute('stroke-width', '1');
  svg.appendChild(line);
}

function drawQuarterRest(svg) {
  // Standard quarter rest: two mirrored curved strokes forming a zigzag
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d',
    'M 20 8 C 20 8 14 14 14 16 C 14 18 22 20 22 22 C 22 24 12 30 14 34 C 15 36 18 34 17 32 C 16 30 22 26 22 22 C 22 20 14 18 14 16 C 14 14 20 8 20 8 Z'
  );
  path.setAttribute('fill', '#222');
  svg.appendChild(path);
}

function drawEighthRest(svg) {
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', '22'); dot.setAttribute('cy', '14');
  dot.setAttribute('r', '3'); dot.setAttribute('fill', '#222');
  svg.appendChild(dot);
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M 22 16 C 18 20 16 22 14 30');
  path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#222');
  path.setAttribute('stroke-width', '2.5'); path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);
}

function drawSixteenthRest(svg) {
  // Two dots + curved stem
  for (const cy of [12, 19]) {
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', '22'); dot.setAttribute('cy', cy);
    dot.setAttribute('r', '2.5'); dot.setAttribute('fill', '#222');
    svg.appendChild(dot);
  }
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M 22 14 C 18 18 16 22 14 32');
  path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#222');
  path.setAttribute('stroke-width', '2.5'); path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);
}

// ─── New concept legend drawings ────────────────────

function drawTamKa(svg) {
  // Dotted eighth + sixteenth beamed
  const xs = [8, 26], cy = 30, stemTop = cy - 18;
  for (const x of xs) {
    const h = document.createElementNS(SVG_NS, 'ellipse');
    h.setAttribute('cx', x); h.setAttribute('cy', cy);
    h.setAttribute('rx', '5.5'); h.setAttribute('ry', '4');
    h.setAttribute('transform', `rotate(-15, ${x}, ${cy})`);
    h.setAttribute('fill', '#222'); svg.appendChild(h);
    const s = document.createElementNS(SVG_NS, 'line');
    s.setAttribute('x1', x + 5); s.setAttribute('y1', cy);
    s.setAttribute('x2', x + 5); s.setAttribute('y2', stemTop);
    s.setAttribute('stroke', '#222'); s.setAttribute('stroke-width', '1.5');
    svg.appendChild(s);
  }
  // Primary beam
  const b = document.createElementNS(SVG_NS, 'rect');
  b.setAttribute('x', xs[0] + 5); b.setAttribute('y', stemTop);
  b.setAttribute('width', xs[1] - xs[0]); b.setAttribute('height', '3');
  b.setAttribute('fill', '#222'); svg.appendChild(b);
  // Stub secondary beam on second note only
  const b2 = document.createElementNS(SVG_NS, 'rect');
  b2.setAttribute('x', xs[1] + 5 - 6); b2.setAttribute('y', stemTop + 4.5);
  b2.setAttribute('width', '6'); b2.setAttribute('height', '3');
  b2.setAttribute('fill', '#222'); svg.appendChild(b2);
  // Dot on first note
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('cx', xs[0] + 12); dot.setAttribute('cy', cy - 2);
  dot.setAttribute('r', '1.8'); dot.setAttribute('fill', '#222');
  svg.appendChild(dot);
}

function drawSyncopation(svg) {
  // Ti-Ta-Ti: eighth, quarter, eighth (3 notes)
  const xs = [4, 16, 28], cy = 30, stemTop = cy - 18;
  const fills = [true, true, true];
  for (let i = 0; i < 3; i++) {
    const x = xs[i];
    const h = document.createElementNS(SVG_NS, 'ellipse');
    h.setAttribute('cx', x); h.setAttribute('cy', cy);
    h.setAttribute('rx', '5.5'); h.setAttribute('ry', '4');
    h.setAttribute('transform', `rotate(-15, ${x}, ${cy})`);
    h.setAttribute('fill', '#222'); svg.appendChild(h);
    const s = document.createElementNS(SVG_NS, 'line');
    s.setAttribute('x1', x + 5); s.setAttribute('y1', cy);
    s.setAttribute('x2', x + 5); s.setAttribute('y2', stemTop);
    s.setAttribute('stroke', '#222'); s.setAttribute('stroke-width', '1.5');
    svg.appendChild(s);
    // Flags on eighths (first and last)
    if (i === 0 || i === 2) {
      const f = document.createElementNS(SVG_NS, 'path');
      f.setAttribute('d', `M ${x + 5} ${stemTop} q 3 6 0 9 q 5 -3 1.5 -11`);
      f.setAttribute('fill', '#222'); svg.appendChild(f);
    }
  }
}

function drawTriplet(svg) {
  // 3 beamed notes with "3" bracket
  const xs = [4, 16, 28], cy = 30, stemTop = cy - 18;
  for (const x of xs) {
    const h = document.createElementNS(SVG_NS, 'ellipse');
    h.setAttribute('cx', x); h.setAttribute('cy', cy);
    h.setAttribute('rx', '5.5'); h.setAttribute('ry', '4');
    h.setAttribute('transform', `rotate(-15, ${x}, ${cy})`);
    h.setAttribute('fill', '#222'); svg.appendChild(h);
    const s = document.createElementNS(SVG_NS, 'line');
    s.setAttribute('x1', x + 5); s.setAttribute('y1', cy);
    s.setAttribute('x2', x + 5); s.setAttribute('y2', stemTop);
    s.setAttribute('stroke', '#222'); s.setAttribute('stroke-width', '1.5');
    svg.appendChild(s);
  }
  // Beam
  const b = document.createElementNS(SVG_NS, 'rect');
  b.setAttribute('x', xs[0] + 5); b.setAttribute('y', stemTop);
  b.setAttribute('width', xs[2] - xs[0]); b.setAttribute('height', '3');
  b.setAttribute('fill', '#222'); svg.appendChild(b);
  // "3" bracket
  const midX = 18, bracketY = stemTop - 6;
  const t = document.createElementNS(SVG_NS, 'text');
  t.setAttribute('x', midX); t.setAttribute('y', bracketY + 4);
  t.setAttribute('text-anchor', 'middle'); t.setAttribute('font-size', '9');
  t.setAttribute('font-weight', 'bold'); t.setAttribute('fill', '#666');
  t.textContent = '3'; svg.appendChild(t);
}

function drawTieLegend(svg) {
  // Two quarter notes with a tie arc
  const xs = [8, 26], cy = 24;
  for (const x of xs) {
    const h = document.createElementNS(SVG_NS, 'ellipse');
    h.setAttribute('cx', x); h.setAttribute('cy', cy);
    h.setAttribute('rx', '6'); h.setAttribute('ry', '4.5');
    h.setAttribute('transform', `rotate(-15, ${x}, ${cy})`);
    h.setAttribute('fill', '#222'); svg.appendChild(h);
    const s = document.createElementNS(SVG_NS, 'line');
    s.setAttribute('x1', x + 5); s.setAttribute('y1', cy);
    s.setAttribute('x2', x + 5); s.setAttribute('y2', cy - 18);
    s.setAttribute('stroke', '#222'); s.setAttribute('stroke-width', '1.5');
    svg.appendChild(s);
  }
  // Tie arc
  const midX = (xs[0] + xs[1]) / 2;
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', `M ${xs[0]} ${cy + 6} Q ${midX} ${cy + 16} ${xs[1]} ${cy + 6}`);
  path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#222');
  path.setAttribute('stroke-width', '1.5'); svg.appendChild(path);
}
