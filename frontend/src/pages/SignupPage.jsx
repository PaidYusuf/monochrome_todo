import React, { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import RainingBackground from '../components/RainingBackground';
import { ThemeContext } from '../context/ThemeContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const LoginWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.darkMode
    ? 'repeating-linear-gradient(135deg, #111 0px, #222 32px, #232323 64px, #242424 96px, #252525 128px, #262626 160px, #272727 192px, #282828 224px, #292929 256px, #2a2a2a 288px, #2b2b2b 320px, #2c2c2c 352px, #2d2d2d 384px, #2e2e2e 416px, #2f2f2f 448px, #303030 480px, #313131 512px, #323232 544px, #333 576px, #343434 608px, #353535 640px, #363636 672px, #373737 704px, #383838 736px, #393939 768px, #3a3a3a 800px, #3b3b3b 832px, #3c3c3c 864px, #3d3d3d 896px, #3e3e3e 928px, #3f3f3f 960px, #404040 992px, #414141 1024px, #424242 1056px, #434343 1088px, #444 1120px)'
    : 'repeating-linear-gradient(135deg, #eee 0px, #eaeaea 32px, #e5e5e5 64px, #e0e0e0 96px, #dbdbdb 128px, #d6d6d6 160px, #d1d1d1 192px, #cccccc 224px, #c7c7c7 256px, #c2c2c2 288px, #bdbdbd 320px, #b8b8b8 352px, #b3b3b3 384px, #aeaeae 416px, #a9a9a9 448px, #a4a4a4 480px, #9f9f9f 512px, #9a9a9a 544px, #959595 576px, #909090 608px, #8b8b8b 640px, #868686 672px, #818181 704px, #7c7c7c 736px, #777777 768px, #727272 800px, #6d6d6d 832px, #686868 864px, #636363 896px, #5e5e5e 928px, #595959 960px, #545454 992px, #4f4f4f 1024px, #4a4a4a 1056px, #454545 1088px, #404040 1120px)'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#181818'};
  font-family: 'Inter', 'Roboto', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
`;

const LoginBox = styled.div`
  background: ${({ theme }) => theme.darkMode ? 'rgba(30,30,30,0.95)' : 'rgba(240,240,240,0.98)'};
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.darkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(180,180,180,0.18)'};
  padding: 48px 36px;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.8s cubic-bezier(.68,-0.55,.27,1.55);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  @media (max-width: 500px) {
    padding: 32px 8px;
    max-width: 98vw;
  }
`;

const FuturisticGlow = styled.div`
  position: absolute;
  pointer-events: none;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #eee 0%, #444 60%, transparent 100%);
  opacity: 0.12;
  filter: blur(16px);
  z-index: 0;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
`;

const gradientMove = keyframes`
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 32px;
  text-align: center;
  background: repeating-linear-gradient(90deg,
    rgba(34,34,34,0.85) 0px, rgba(34,34,34,0.85) 8px,
    #444 12px, #555 16px,
    #666 20px, #888 24px,
    #aaa 28px, #bbb 32px,
    #ccc 36px, #eee 40px,
    #fff 44px, #eee 48px,
    #ccc 52px, #bbb 56px,
    #aaa 60px, #888 64px,
    #666 68px, #555 72px,
    #444 76px, rgba(34,34,34,0.85) 80px
  );
  background-size: 400% 100%;
  animation: ${gradientMove} 30s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Input = styled.input`
  width: 90%;
  max-width: 320px;
  padding: 14px 18px;
  margin-bottom: 18px;
  border-radius: 12px;
  border: none !important;
  background: ${({ theme }) => theme.darkMode ? '#222' : '#fff'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#222'};
  font-size: 1rem;
  outline: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: background 0.2s;
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:focus {
    background: ${({ theme }) => theme.darkMode ? '#111' : '#f5f5f5'};
  }
`;

const shadowMove = keyframes`
  0% { box-shadow: 0 -12px 48px 8px rgba(120,120,120,0.32); }
  25% { box-shadow: 24px 0 48px 8px rgba(120,120,120,0.32); }
  50% { box-shadow: 0 12px 48px 8px rgba(120,120,120,0.32); }
  75% { box-shadow: -24px 0 48px 8px rgba(120,120,120,0.32); }
  100% { box-shadow: 0 -12px 48px 8px rgba(120,120,120,0.32); }
`;

const Button = styled.button`
  width: 90%;
  max-width: 320px;
  padding: 14px 0;
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.darkMode ? 'linear-gradient(90deg, #888 0%, #222 100%)' : 'linear-gradient(90deg, #eee 0%, #bbb 100%)'};
  color: ${({ theme }) => theme.darkMode ? '#fff' : '#181818'};
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 0 48px 8px rgba(120,120,120,0.32);
  animation: ${shadowMove} 4s linear infinite;
  transition: background 0.2s, transform 0.2s, animation-duration 0.2s;
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    background: ${({ theme }) => theme.darkMode ? 'linear-gradient(90deg, #222 0%, #888 100%)' : 'linear-gradient(90deg, #f5f5f5 0%, #bbb 100%)'};
    transform: scale(1.04);
    animation-duration: 1.2s;
  }
`;

const ErrorMsg = styled.div`
  color: #ff3b3b;
  background: rgba(50,0,0,0.12);
    border-radius: 8px;
    padding: 8px 0;
    text-align: center;
    margin-bottom: 12px;
    font-size: 0.98rem;
    color: ${({ theme }) => theme.darkMode ? '#ff3b3b' : '#b30000'};
    background: ${({ theme }) => theme.darkMode ? 'rgba(50,0,0,0.12)' : 'rgba(255,200,200,0.18)'};
  border-radius: 8px;
  padding: 8px 0;
  text-align: center;
  margin-bottom: 12px;
  font-size: 0.98rem;
`;

const HomeButton = styled.button`
  position: fixed;
  top: 24px;
  left: 24px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: none;
  color: #222;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(94, 94, 94, 0.45);
  transition: background 0.2s, color 0.2s;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover img {
    transform: scale(1.15);
    filter: drop-shadow(0 0 8px #888888d3);
    transition: transform 0.2s, filter 0.2s;
  }
`;

const ForgotPassword = styled.div`
  width: 90%;
  max-width: 320px;
  margin: 10px auto 0 auto;
  text-align: right;
  font-size: 0.98rem;
    color: ${({ theme }) => theme.darkMode ? '#888' : '#555'};
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
    &:hover {
      color: ${({ theme }) => theme.darkMode ? '#eee' : '#222'};
    }
  &:hover {
    color: #eee;
  }
`;

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: -40, y: -40 });
  const [showGlow, setShowGlow] = useState(false);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://monochrome-todo.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      localStorage.setItem('token', data.token);
      window.location.href = '/monochrome_todo';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <LoginWrapper theme={{ darkMode }}>
      <RainingBackground />
      <HomeButton onClick={() => navigate('/')} title="Return Home">
        {/* Home icon from Icons8 - now white */}
        <img src="https://img.icons8.com/ios-filled/50/ffffff/home.png" alt="Home Icon" width="32" height="32" style={{filter: 'drop-shadow(0 0 8px #aaa)'}} />
      </HomeButton>
  <LoginBox theme={{ darkMode }}
        onMouseMove={e => {
          const box = e.currentTarget.getBoundingClientRect();
          setGlowPos({
            x: e.clientX - box.left - 60,
            y: e.clientY - box.top - 60
          });
        }}
        onMouseEnter={() => setShowGlow(true)}
        onMouseLeave={() => setShowGlow(false)}
        style={{ position: 'relative' }}
      >
        <button
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 9999,
            background: darkMode ? '#232323' : '#f4f4f4',
            color: darkMode ? '#eaeaea' : '#222',
            border: '1px solid #bbb',
            borderRadius: 10,
            padding: '7px 18px',
            cursor: 'pointer',
            fontWeight: 600,
            fontFamily: 'Inter, Roboto, sans-serif',
            boxShadow: '0 2px 8px rgba(80,80,80,0.10)',
            letterSpacing: '1px',
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = darkMode ? '#181818' : '#e0e0e0';
            e.currentTarget.style.color = darkMode ? '#fff' : '#181818';
            e.currentTarget.style.border = '1px solid #888';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = darkMode ? '#232323' : '#f4f4f4';
            e.currentTarget.style.color = darkMode ? '#eaeaea' : '#222';
            e.currentTarget.style.border = '1px solid #bbb';
          }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        {showGlow && <FuturisticGlow x={glowPos.x} y={glowPos.y} />}
        <Title>Sign Up</Title>
  {error && <ErrorMsg theme={{ darkMode }}>{error}</ErrorMsg>}
        <form onSubmit={handleSignup}>
          <Input theme={{ darkMode }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input theme={{ darkMode }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input theme={{ darkMode }}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <Button theme={{ darkMode }} type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</Button>
        </form>
        <div style={{ width: '90%', maxWidth: 320, margin: '16px auto 0 auto', textAlign: 'center' }}>
          <span style={{ color: darkMode ? '#bbb' : '#222', fontSize: '0.98rem' }}>
            Do you have an account?{' '}
            <span style={{ color: darkMode ? '#fff' : '#181818', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Login
            </span>
          </span>
        </div>
  <ForgotPassword theme={{ darkMode }} onClick={() => alert('Password reset coming soon!')}>Forgot Password?</ForgotPassword>
      </LoginBox>
    </LoginWrapper>
  );
};

export default SignupPage;
