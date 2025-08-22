import React from 'react';
import styled, { keyframes } from 'styled-components';

const rainDrop = keyframes`
  0% { opacity: 0.7; transform: translateY(-600px) scaleY(0.7); }
  95% { opacity: 0.7; }
  100% { opacity: 0.1; transform: translateY(100vh) scaleY(1.2); }
`;

const RainWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
`;

const RainDrop = styled.div`
  position: absolute;
  left: ${({ left }) => left};
  width: 2px;
  height: ${({ height }) => height};
  background: linear-gradient(180deg, #fff 0%, #bbb 100%);
  opacity: 0.7;
  border-radius: 2px;
  animation: ${rainDrop} ${({ duration }) => duration}s linear infinite;
  animation-delay: ${({ delay }) => delay}s;
  top: ${({ initialTop }) => initialTop};
`;

const drops = Array.from({ length: 80 }).map((_, i) => ({
  left: `${Math.random() * 100}vw`,
  height: `${60 + Math.random() * 80}px`,
  duration: 3 + Math.random() * 2.5,
  delay: Math.random() * 2.5,
  initialTop: `${(-Math.random() * 300) - 10}vh`
}));

const RainingBackground = () => (
  <RainWrapper>
    {drops.map((drop, idx) => (
      <RainDrop key={idx} {...drop} />
    ))}
  </RainWrapper>
);

export default RainingBackground;
