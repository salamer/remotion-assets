import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";

export const MONO_FONT = "IBM Plex Mono";

loadFont({
  family: MONO_FONT,
  url: staticFile("fonts/IBMPlexMono-Regular.woff2"),
  weight: "400",
  format: "woff2",
});

loadFont({
  family: MONO_FONT,
  url: staticFile("fonts/IBMPlexMono-SemiBold.woff2"),
  weight: "600",
  format: "woff2",
});