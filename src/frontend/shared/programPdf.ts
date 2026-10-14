// A program as a PDF, made in the browser: its name and what it needs, then each block with its week laid out day by day
// and every workout's exercises, on Letter pages with their numbers. It takes the program in the shared format (as a
// link shows it), so a program, a run's snapshot and a shared one all print the same way. pdf-lib loads only when one is
// made.

import { alpha, colors } from '@moonshot/design-system/colors';
import { DOW3 } from './constants';
import { exLine, minText, plural } from './helpers';
import { blockWorkouts, daysOf, programEquipment, programWeeks, trainingDays, type SharedProgram, type SharedWorkout } from './sharedProgram';

const PAGE = { w: 612, h: 792, margin: 48 };

// The standard PDF fonts only have Latin-1 and a few more (WinAnsi): anything else becomes a plain stand-in.
const WIN_ANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
const safe = (s: string) =>
  Array.from(s.replace(/ /g, ' '))
    .map((c) => (c.charCodeAt(0) <= 0xff || WIN_ANSI_EXTRA.includes(c) ? c : c === '−' ? '-' : '?'))
    .join('');

const kindOf = (w: SharedWorkout) =>
  [w.warmup ? 'Warm-up' : '', w.kind === 'ride' ? 'Cycling' : w.stretch ? 'Stretching' : w.yoga ? 'Yoga' : 'Lifting'].filter(Boolean).join(' · ');
const dayName = (d: number) => DOW3[d].charAt(0) + DOW3[d].slice(1).toLowerCase();

/** The PDF's bytes, for a program called `name`. */
export async function programPdf(name: string, program: SharedProgram): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  // A palette hex as a PDF color; `over` lays it on white at that strength, since a PDF has no see-through colors.
  const hex = (h: string, over = 1) => rgb(...([1, 3, 5].map((i) => 1 - (1 - parseInt(h.slice(i, i + 2), 16) / 255) * over) as [number, number, number]));
  const ink = hex(colors.ink);
  const muted = hex(colors.muted);
  const pink = hex(colors.pinkDeep);
  // The lines between rows: the app's line color, ink at the ladder's first rung.
  const rule = hex(colors.ink, parseFloat(alpha[1].value) / 100);
  const tint = hex(colors.pinkTint);
  const mist = hex(colors.mist);

  const doc = await PDFDocument.create();
  doc.setTitle(safe(name));
  doc.setCreator('Moonshot');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);
  type Font = typeof regular;

  const width = PAGE.w - PAGE.margin * 2;
  let page = doc.addPage([PAGE.w, PAGE.h]);
  let y = PAGE.h - PAGE.margin;
  const newPage = () => {
    page = doc.addPage([PAGE.w, PAGE.h]);
    y = PAGE.h - PAGE.margin;
  };
  // Room for `h` more points on this page, else the next one. The bottom keeps space for the page number.
  const room = (h: number) => {
    if (y - h < PAGE.margin + 18) newPage();
  };

  /** Lines of `text` no wider than `max` at this font and size, broken between words. */
  const wrap = (text: string, font: Font, size: number, max: number) => {
    const lines: string[] = [];
    let line = '';
    safe(text)
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => {
        const next = line ? line + ' ' + word : word;
        if (line && font.widthOfTextAtSize(next, size) > max) {
          lines.push(line);
          line = word;
        } else line = next;
      });
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  };
  /** Writes text from `x`, wrapping at `max`, and moves down past it. */
  const write = (text: string, o: { font?: Font; size?: number; color?: ReturnType<typeof rgb>; x?: number; max?: number; gap?: number }) => {
    const font = o.font || regular;
    const size = o.size || 10;
    const x = o.x ?? PAGE.margin;
    const lead = size * 1.35;
    wrap(text, font, size, o.max ?? width - (x - PAGE.margin)).forEach((line) => {
      room(lead);
      page.drawText(line, { x, y: y - size, size, font, color: o.color || ink });
      y -= lead;
    });
    y -= o.gap ?? 0;
  };

  // ---- The top: whose, what, how long, what it needs
  write('MOONSHOT', { font: bold, size: 9, color: pink, gap: 6 });
  write(name, { font: bold, size: 24, gap: 4 });
  const kit = programEquipment(program);
  write(
    [plural(programWeeks(program), 'week'), plural(trainingDays(program), 'day') + ' a week', kit.need.length ? kit.need.join(', ') : kit.complete ? 'No equipment' : '']
      .filter(Boolean)
      .join('  ·  '),
    { size: 11, color: muted, gap: program.by ? 2 : 14 },
  );
  if (program.by) write('Shared by ' + program.by, { size: 11, color: muted, gap: 14 });

  // ---- Each block: its week as seven days, then its workouts in full
  let before = 0;
  program.blocks.forEach((b, bi) => {
    const from = before + 1;
    before += b.weeks;
    const title = b.name || (program.blocks.length > 1 ? 'Block ' + (bi + 1) : 'Every week');
    room(120);
    page.drawLine({ start: { x: PAGE.margin, y }, end: { x: PAGE.margin + width, y }, thickness: 1, color: rule });
    y -= 14;
    write(title, { font: bold, size: 15, gap: 1 });
    write((b.weeks === 1 ? 'Week ' + from : 'Weeks ' + from + '–' + (from + b.weeks - 1)) + '  ·  ' + plural(blockWorkouts(b).length, 'workout'), { size: 10, color: muted, gap: 10 });

    // The week: a column a day, with the workouts on it.
    const col = width / 7;
    const cells = b.days.map((ixs) => ixs.flatMap((ix) => wrap(program.workouts[ix].name, regular, 8, col - 10)));
    const boxH = Math.max(46, 22 + Math.max(...cells.map((c) => c.length)) * 10);
    room(boxH + 10);
    b.days.forEach((ixs, d) => {
      const x = PAGE.margin + d * col;
      page.drawRectangle({ x: x + 1, y: y - boxH, width: col - 2, height: boxH, color: ixs.length ? tint : mist });
      page.drawText(DOW3[d], { x: x + 6, y: y - 13, size: 8, font: bold, color: ixs.length ? pink : muted });
      (ixs.length ? cells[d] : ['Rest']).forEach((line, k) => {
        page.drawText(line, { x: x + 6, y: y - 26 - k * 10, size: 8, font: regular, color: ixs.length ? ink : muted });
      });
    });
    y -= boxH + 14;

    blockWorkouts(b).forEach((ix) => {
      const w = program.workouts[ix];
      room(40);
      write(w.name, { font: bold, size: 12, gap: 0 });
      write([daysOf(b, ix).map(dayName).join(', '), kindOf(w), '~' + minText(w.minutes)].join('  ·  '), { size: 9, color: muted, gap: 4 });
      if (w.kind === 'ride' && w.ride)
        write([w.ride.dist ? w.ride.dist + ' mi' : '', w.ride.elev ? w.ride.elev + ' ft' : '', w.ride.zone].filter(Boolean).join('  ·  '), { size: 10, x: PAGE.margin + 12, gap: 2 });
      // Its exercises as two columns: the name, then sets, weight and rest.
      const nameX = PAGE.margin + 12;
      const nameMax = width * 0.42;
      const detailX = nameX + nameMax + 12;
      const detailMax = PAGE.margin + width - detailX;
      w.exercises.forEach((e) => {
        const names = wrap(e.name, bold, 10, nameMax);
        const details = wrap(exLine(e, true), regular, 10, detailMax);
        const lead = 13.5;
        room(Math.max(names.length, details.length) * lead + 2);
        names.forEach((line, k) => page.drawText(line, { x: nameX, y: y - 10 - k * lead, size: 10, font: bold, color: ink }));
        details.forEach((line, k) => page.drawText(line, { x: detailX, y: y - 10 - k * lead, size: 10, font: regular, color: muted }));
        y -= Math.max(names.length, details.length) * lead + 2;
      });
      if (w.notes) write(w.notes, { font: italic, size: 9, color: muted, x: PAGE.margin + 12, gap: 0 });
      y -= 10;
    });
    y -= 6;
  });

  // ---- Page numbers
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const text = safe(name) + '  ·  ' + (i + 1) + ' of ' + pages.length;
    p.drawText(text, { x: PAGE.margin, y: PAGE.margin - 18, size: 8, font: regular, color: muted });
    const made = 'Made with Moonshot';
    p.drawText(made, { x: PAGE.w - PAGE.margin - regular.widthOfTextAtSize(made, 8), y: PAGE.margin - 18, size: 8, font: regular, color: muted });
  });

  return doc.save();
}

/** A file name for it: "Fall routine.pdf", with characters file systems refuse taken out. */
export const pdfName = (name: string) => (name.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Program') + '.pdf';

/**
 * Makes the PDF and hands it over: to the phone's share sheet where it takes files (to send, or save to Files), else
 * downloaded. Resolves once it's out, or the share sheet was closed.
 */
export async function savePdf(name: string, program: SharedProgram) {
  const bytes = await programPdf(name, program);
  const file = new File([bytes], pdfName(name), { type: 'application/pdf' });
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      // Refused (the tap was too long ago, say): download it instead.
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
