import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Backdrop } from "./components/Backdrop";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Chat } from "./scenes/Scene3Chat";
import { Scene4Features } from "./scenes/Scene4Features";
import { Scene5Stack } from "./scenes/Scene5Stack";
import { Scene6Outro } from "./scenes/Scene6Outro";

export const SCENES = [200, 260, 500, 360, 300, 300];
export const TRANSITION = 20;
export const TOTAL = SCENES.reduce((a, b) => a + b, 0) - TRANSITION * (SCENES.length - 1);

const t = () => (
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
);

export const MainVideo: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
        <Scene1Intro />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
        <Scene2Problem />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
        <Scene3Chat />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
        <Scene4Features />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={SCENES[4]}>
        <Scene5Stack />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={SCENES[5]}>
        <Scene6Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
