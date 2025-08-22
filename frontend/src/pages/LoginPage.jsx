import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import RainingBackground from '../components/RainingBackground';

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
  /* Cross-diagonal monochrome gradient for all browsers */
  background: repeating-linear-gradient(135deg,
    #222 0px, #222 32px,
    #232323 32px, #232323 64px,
    #242424 64px, #242424 96px,
    #252525 96px, #252525 128px,
    #262626 128px, #262626 160px,
    #272727 160px, #272727 192px,
    #282828 192px, #282828 224px,
    #292929 224px, #292929 256px,
    #2a2a2a 256px, #2a2a2a 288px,
    #2b2b2b 288px, #2b2b2b 320px,
    #2c2c2c 320px, #2c2c2c 352px,
    #2d2d2d 352px, #2d2d2d 384px,
    #2e2e2e 384px, #2e2e2e 416px,
    #2f2f2f 416px, #2f2f2f 448px,
    #303030 448px, #303030 480px,
    #313131 480px, #313131 512px,
    #323232 512px, #323232 544px,
    #333 544px, #333 576px,
    #343434 576px, #343434 608px,
    #353535 608px, #353535 640px,
    #363636 640px, #363636 672px,
    #373737 672px, #373737 704px,
    #383838 704px, #383838 736px,
    #393939 736px, #393939 768px,
    #3a3a3a 768px, #3a3a3a 800px,
    #3b3b3b 800px, #3b3b3b 832px,
    #3c3c3c 832px, #3c3c3c 864px,
    #3d3d3d 864px, #3d3d3d 896px,
    #3e3e3e 896px, #3e3e3e 928px,
    #3f3f3f 928px, #3f3f3f 960px,
    #404040 960px, #404040 992px,
    #414141 992px, #414141 1024px,
    #424242 1024px, #424242 1056px,
    #434343 1056px, #434343 1088px,
    #444 1088px, #444 1120px
  );
  color: #fff;
  font-family: 'Inter', 'Roboto', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
`;

const LoginBox = styled.div`
  background: rgba(30, 30, 30, 0.95);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
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
  background: #222;
  color: #fff;
  font-size: 1rem;
  outline: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: background 0.2s;
  display: block;
  margin-left: auto;
  margin-right: auto;
  &:focus {
    background: #333;
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
  background: linear-gradient(90deg, #888 0%, #222 100%);
  color: #fff;
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
    background: linear-gradient(90deg, #222 0%, #888 100%);
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
  box-shadow: 0 2px 8px rgba(0, 238, 255, 0.62);
  transition: background 0.2s, color 0.2s;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover img {
    transform: scale(1.15);
  filter: drop-shadow(0 0 8px #888);
    transition: transform 0.2s, filter 0.2s;
  }
`;


const ForgotPassword = styled.div`
  width: 90%;
  max-width: 320px;
  margin: 10px auto 0 auto;
  text-align: right;
  font-size: 0.98rem;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
  &:hover {
    color: #eee;
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: -40, y: -40 });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <RainingBackground />
      <HomeButton onClick={() => navigate('/')} title="Return Home">
        {/* Home icon from Icons8 */}
  <img src="https://img.icons8.com/ios-filled/50/888888/home.png" alt="Home Icon" width="32" height="32" style={{filter: 'drop-shadow(0 0 4px #888)'}} />
      </HomeButton>
      <LoginBox
        onMouseMove={e => {
          const box = e.currentTarget.getBoundingClientRect();
          setGlowPos({
            x: e.clientX - box.left - 60,
            y: e.clientY - box.top - 60
          });
        }}
  // onMouseLeave removed so glow stays at last position
        style={{ position: 'relative' }}
      >
        <FuturisticGlow x={glowPos.x} y={glowPos.y} />
        <Title>Sign In</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <ForgotPassword onClick={() => alert('Password reset coming soon!')}>Forgot Password?</ForgotPassword>
      </LoginBox>
    </LoginWrapper>
  );
};

export default LoginPage;
