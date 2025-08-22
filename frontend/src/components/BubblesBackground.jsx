// Animated black chromatic bubbles background
import React from 'react';
import styled, { keyframes } from 'styled-components';

const bubbleMove = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.7;
  }
  100% {
    transform: translate(80vw, -80vh) scale(1.3);
    opacity: 0.2;
  }
`;

const Bubble = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #222 80%, #000 100%);
  opacity: 0.5;
  animation: ${bubbleMove} 16s linear infinite;
`;

const bubblesConfig = [
  { size: 120, left: '2vw', bottom: '4vh', delay: '0s' },
  { size: 80, left: '10vw', bottom: '10vh', delay: '2s' },
  { size: 60, left: '20vw', bottom: '2vh', delay: '4s' },
  { size: 100, left: '5vw', bottom: '20vh', delay: '6s' },
  { size: 70, left: '15vw', bottom: '15vh', delay: '8s' },
  { size: 90, left: '60vw', bottom: '30vh', delay: '3s' },
  { size: 110, left: '40vw', bottom: '60vh', delay: '5s' },
  { size: 75, left: '80vw', bottom: '10vh', delay: '7s' },
  { size: 60, left: '70vw', bottom: '50vh', delay: '9s' },
];

const BubblesBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {bubblesConfig.map((bubble, idx) => (
      <Bubble
        key={idx}
        style={{
          width: bubble.size,
          height: bubble.size,
          left: bubble.left,
          bottom: bubble.bottom,
          animationDelay: bubble.delay,
        }}
      />
    ))}
  </div>
);

export default BubblesBackground;
