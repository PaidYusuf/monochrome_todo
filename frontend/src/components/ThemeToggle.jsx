import React, { useContext } from 'react';

import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';

const SliderWrapper = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SliderButton = styled.button`
  width: 60px;
  height: 32px;
  background: ${({ dark }) => (dark ? '#222' : '#eee')};
  border: 2px solid ${({ dark }) => (dark ? '#fff' : '#222')};
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  outline: none;
  padding: 0;
`;

const SliderKnob = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ dark }) => (dark ? '28px' : '2px')};
  width: 26px;
  height: 26px;
  background: ${({ dark }) => (dark ? '#fff' : '#222')};
  border-radius: 50%;
  transition: left 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${({ dark }) => (dark ? '#222' : '#fff')};
  transform: translateY(-50%);
`;

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <SliderWrapper>
      <SliderButton dark={darkMode} onClick={() => setDarkMode((prev) => !prev)} title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
  <SliderKnob dark={darkMode}>{darkMode ? '◐' : '◑'}</SliderKnob>
      </SliderButton>
    </SliderWrapper>
  );
};

export default ThemeToggle;
