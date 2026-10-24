import fs from "node:fs";
import path from "node:path";
import { createBundleServer } from "./bundle-server";
import { selectComposition, renderMedia } from "@remotion/renderer";
import { readEpisode, sidecars } from "./io";

async function main() {
  const [file, output = "out/episode.mp4", ...flags] = process.argv.slice(2);
  if (!file)
    throw new Error(
      "Usage: pnpm render episode.json out/video.mp4 [--draft] [--overwrite] [--prores] [--concurrency=2]",
    );
  for (const f of flags)
    if (
      !["--draft", "--overwrite", "--prores"].includes(f) &&
      !/^--concurrency=\d+$/.test(f)
    )
      throw new Error(`Unknown flag: ${f}`);
  if (fs.existsSync(output) && !flags.includes("--overwrite"))
    throw new Error(
      `Output exists: ${output}. Pass --overwrite to replace it.`,
    );
  const concurrency = Number(
    flags.find((f) => f.startsWith("--concurrency="))?.split("=")[1] || 2,
  );
  if (concurrency < 1 || concurrency > 16)
    throw new Error("Concurrency must be 1–16");
  const prores = flags.includes("--prores");
  if (prores && !output.endsWith(".mov"))
    throw new Error("ProRes output must use .mov");
  if (!prores && !output.endsWith(".mp4"))
    throw new Error("H.264 output must use .mp4");
  const episode = readEpisode(file);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const inputProps = { episode };
  const server = await createBundleServer();
  const serveUrl = server.url;
  try {
    const composition = await selectComposition({
      chromiumOptions: { enableMultiProcessOnLinux: true, gl: "swangle" },
      serveUrl,
      id: "FinanceEpisode",
      inputProps,
    });
    let last = -1;
    await renderMedia({
      chromiumOptions: { enableMultiProcessOnLinux: true, gl: "swangle" },
      serveUrl,
      composition,
      inputProps,
      outputLocation: path.resolve(output),
      codec: prores ? "prores" : "h264",
      ...(prores
        ? { proResProfile: "hq" as const, pixelFormat: "yuv422p10le" as const }
        : {
            crf: flags.includes("--draft") ? 26 : 18,
            pixelFormat: "yuv420p" as const,
          }),
      scale: flags.includes("--draft") ? 0.5 : 1,
      concurrency,
      timeoutInMilliseconds: 90_000,
      onProgress: ({ progress }) => {
        const p = Math.floor(progress * 10) * 10;
        if (p !== last) {
          console.log(`Rendering ${p}%`);
          last = p;
        }
      },
      overwrite: flags.includes("--overwrite"),
    });
    const base = output.replace(/\.[^.]+$/, "");
    sidecars(episode, base);
    console.log(`Rendered ${output}`);
  } finally {
    await server.close();
  }
}
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
