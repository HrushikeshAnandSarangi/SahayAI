'use client'; 

import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

const LottiePlayer = ({ src, className, loop = true, autoplay = true }: { src: string, className?: string, loop?: boolean, autoplay?: boolean }) => {
  return (
    <DotLottiePlayer
      src={src}
      className={className}
      loop={loop}
      autoplay={autoplay}
    />
  );
};

export default LottiePlayer;