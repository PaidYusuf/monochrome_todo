// Styled Components for LandingPage
import styled from 'styled-components';

export const LandingWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
  background: #fff;
  color: #222;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  padding: 0;
  margin: 0 auto;
  @media (max-width: 600px) {
    min-height: 100vh;
    padding: 0 0.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 2px;
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #555;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const MainButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  background: #222;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #444;
  }
`;
