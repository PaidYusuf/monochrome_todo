// Horizontal image gallery with left-to-right auto-scroll
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const GalleryWrapper = styled.div`
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  position: relative;
  background: ${({ dark }) => (dark ? '#111' : '#fff')};
`;

// To adjust gallery speed, change the animation duration below (e.g., 36s for slower, 18s for faster)
const GalleryTrack = styled.div`
  display: flex;
  gap: 2rem;
  width: max-content;
  animation: scrollGallery 288s linear infinite;
  @keyframes scrollGallery {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

const GalleryImage = styled.img`
  width: 320px;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
`;

// To adjust the number of frames/images, add or remove URLs in the array below
const images = [
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', // workspace
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80', // productivity
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', // calendar
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80', // notes
  'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=400&q=80', // mobile
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80', // dashboard
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80', // planning
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80', // teamwork
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', // mobile app
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', // productivity desk
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80', // dashboard
  'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=400&q=80', // mobile
];

const IMAGE_WIDTH = 320;
const IMAGE_GAP = 32; // 2rem in px
const loopImages = [...images, ...images];

const ImageGallery = () => (
  <GalleryWrapper>
    <GalleryTrack>
      {Array(8).fill(loopImages).flat().map((src, idx) => (
        <GalleryImage key={idx} src={src} alt={`Gallery ${idx + 1}`} />
      ))}
    </GalleryTrack>
  </GalleryWrapper>
);

export default ImageGallery;
