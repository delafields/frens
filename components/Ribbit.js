import {  useState } from 'react';
import useSound from 'use-sound';
import ribbitSfx from '../sounds/ribbit.mp3';

export default function Ribbit() {
    const [playbackRate, setPlaybackRate] = useState(0.75);

    const [play] = useSound(ribbitSfx, {
      playbackRate,
      // `interrupt` ensures that if the sound starts again before it's
      // ended, it will truncate it. Otherwise, the sound can overlap.
      interrupt: true,
    });
  
    const handleRibbit = () => {
      setPlaybackRate(playbackRate + 0.05);
      play();
    };

    return (
        <div className="flex justify-center m-0 text-6xl text-center mb-10">
            <h1>
            frens
            </h1>
            <h1 
            className="cursor-pointer"
            onClick={handleRibbit}
            onMouseEnter={handleRibbit}
            >
            🐸
            </h1>
        </div>
    )
}