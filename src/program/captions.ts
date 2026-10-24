export function parseSrt(text: string) {
  const input = text
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .trim();
  if (!input) return [];
  const seconds = (time: string) => {
    const m = time.match(/^(\d{2,}):(\d{2}):(\d{2})[,.](\d{3})$/);
    if (!m || Number(m[2]) > 59 || Number(m[3]) > 59)
      throw new Error(`Invalid SRT timestamp: ${time}`);
    return (
      Number(m[1]) * 3600 +
      Number(m[2]) * 60 +
      Number(m[3]) +
      Number(m[4]) / 1000
    );
  };
  return input.split(/\n\s*\n/).map((block, i) => {
    const lines = block.split("\n");
    if (/^\d+$/.test(lines[0].trim())) lines.shift();
    const timing = lines
      .shift()
      ?.match(
        /^(\d{2,}:\d{2}:\d{2}[,.]\d{3})\s+-->\s+(\d{2,}:\d{2}:\d{2}[,.]\d{3})$/,
      );
    if (!timing) throw new Error(`Invalid SRT cue ${i + 1}`);
    return {
      start: seconds(timing[1]),
      end: seconds(timing[2]),
      text: lines
        .join("\n")
        .replace(/<[^>]*>/g, "")
        .trim(),
    };
  });
}
