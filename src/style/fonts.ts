import { useEffect, useState } from "react";
import {
  staticFile,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { fontPaths } from "../assets";

export const MONO_FONT =
  'var(--fm-font, "IBM Plex Mono"), "Noto Sans SC", monospace';
let fontsReady: Promise<void> | undefined;

/** Load after the renderer initializes its environment, once per document. */
export function ensureFonts(): Promise<void> {
  if (!fontsReady) {
    fontsReady = Promise.all([
      loadFont({
        family: "IBM Plex Mono",
        url: fontPaths.monoRegular,
        weight: "400",
        format: "woff2",
      }),
      loadFont({
        family: "IBM Plex Mono",
        url: fontPaths.monoSemiBold,
        weight: "600",
        format: "woff2",
      }),
      ...[400, 600, 700].map((weight) =>
        loadFont({
          family: "Noto Sans SC",
          url: staticFile(`fonts/NotoSansSC-${weight}.woff2`),
          weight: String(weight),
          format: "woff2",
        }),
      ),
    ]).then(() => undefined);
  }
  return fontsReady;
}

export function useFonts() {
  const [handle] = useState(() => delayRender("Finance Motion local fonts"));
  useEffect(() => {
    let mounted = true;
    ensureFonts()
      .then(() => {
        if (mounted) continueRender(handle);
      })
      .catch(cancelRender);
    return () => {
      mounted = false;
      continueRender(handle);
    };
  }, [handle]);
}
