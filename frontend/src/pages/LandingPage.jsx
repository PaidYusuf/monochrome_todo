import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';
import BubblesBackground from '../components/BubblesBackground';
import ImageGallery from '../components/ImageGallery';
import {
	LandingWrapper,
	Title,
	Subtitle,
	ButtonGroup,
	MainButton
} from '../styles/landingPageStyles';

const featureImages = [
	{
	src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
		label: 'Organize',
		desc: 'Organize your tasks efficiently with a clean, minimalist interface designed for productivity.'
	},
	{
	src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
		label: 'Reminders',
		desc: 'Set smart reminders and never miss a deadline, with notifications that keep you on track.'
	},
	{
	src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
		label: 'Analytics',
		desc: 'Track your productivity with insightful analytics and stats to help you improve.'
	}
];

const Footer = () => (
	<footer style={{
		width: '100%',
		background: '#111',
		color: '#eee',
		textAlign: 'center',
		padding: '2rem 0',
		marginTop: '2rem',
		fontSize: '1rem',
		letterSpacing: '1px',
	}}>
		&copy; {new Date().getFullYear()} Monochrome Todo. All rights reserved.
	</footer>
);

const WelcomeText = ({ dark }) => {
	const navigate = useNavigate();
	return (
		<LandingWrapper dark={dark} style={{ zIndex: 1, position: 'relative', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
			<Title dark={dark}>Monochrome Todo List</Title>
			<Subtitle dark={dark}>
				Professional, minimalist productivity app for creators. Organize your tasks, track your progress, and stay focused.
			</Subtitle>
			<ButtonGroup>
				<MainButton dark={dark} onClick={() => navigate('/login')}>
					<span style={{marginRight: '0.5rem', display: 'inline-block'}}>
						{/* Simple user icon SVG */}
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						  <circle cx="9" cy="6" r="3.5" stroke={dark ? '#222' : '#fff'} strokeWidth="1.5"/>
						  <path d="M3 15c0-2.5 3-4 6-4s6 1.5 6 4" stroke={dark ? '#222' : '#fff'} strokeWidth="1.5" strokeLinecap="round"/>
						</svg>
					</span>
					Sign In
				</MainButton>
				<MainButton dark={dark} onClick={() => navigate('/register')}>
					<span style={{marginRight: '0.5rem', display: 'inline-block'}}>
						{/* Simple plus icon SVG */}
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						  <line x1="9" y1="4" x2="9" y2="14" stroke={dark ? '#222' : '#fff'} strokeWidth="1.5" strokeLinecap="round"/>
						  <line x1="4" y1="9" x2="14" y2="9" stroke={dark ? '#222' : '#fff'} strokeWidth="1.5" strokeLinecap="round"/>
						</svg>
					</span>
					Sign Up
				</MainButton>
			</ButtonGroup>
		</LandingWrapper>
	);
};

const LoggedInLanding = ({ dark }) => (
  <LandingWrapper dark={dark} style={{ zIndex: 1, position: 'relative', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
    <Title dark={dark}>Welcome Back!</Title>
    <Subtitle dark={dark}>
      You are logged in. Access your tasks, analytics, and more.
    </Subtitle>
    <ButtonGroup>
      <MainButton dark={dark} onClick={() => window.location.href = '/monochrome_todo/dashboard'}>
        Go to Dashboard
      </MainButton>
      <MainButton dark={dark} onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>
        Log Out
      </MainButton>
    </ButtonGroup>
  </LandingWrapper>
);

// FeatureSection: Alternates left/right, animates to center on scroll
const FeatureSection = ({ feature, idx, darkMode }) => {
	const ref = useRef();
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const observer = new window.IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ threshold: 0.8 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	// Alternate left/right
	const isLeft = idx % 2 === 0;
	return (
		<div
			ref={ref}
			style={{
				width: '100%',
				maxWidth: '800px', // was 500px
				margin: '0 auto',
				display: 'flex',
				flexDirection: isLeft ? 'row' : 'row-reverse',
				alignItems: 'center',
				gap: '2rem',
				opacity: inView ? 1 : 0,
				transform: inView
					? 'translateX(0)'
					: isLeft
						? 'translateX(-120px)'
						: 'translateX(120px)',
				transition: 'all 0.8s cubic-bezier(.68,-0.55,.27,1.55)',
				marginBottom: '3rem',
			}}
		>
			<img
				src={feature.src}
				alt={feature.label}
				style={{
					width: '55%', // slightly less to balance with wider text
					maxWidth: '400px',
					borderRadius: '16px',
					boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
					display: 'block',
				}}
			/>
			<div style={{ flex: 1, textAlign: isLeft ? 'left' : 'right', maxWidth: '380px', minWidth: '220px', padding: '0 2rem' }}>
				<div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: darkMode ? '#eee' : '#444', marginBottom: '0.5rem' }}>{feature.label}</div>
				<div style={{ fontSize: '1.05rem', color: darkMode ? '#bbb' : '#888' }}>{feature.desc}</div>
			</div>
		</div>
	);
};

const GallerySection = () => {
	const { darkMode } = useContext(ThemeContext);
	const [showGallery, setShowGallery] = useState(false);
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	useEffect(() => {
		const timer = setTimeout(() => setShowGallery(true), 800); // 800ms delay
		return () => clearTimeout(timer);
	}, []);

	return (
		<section style={{ width: '100vw', maxWidth: '100vw', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', margin: '0 auto', padding: '4rem 0', position: 'relative' }}>
			<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', margin: '4rem 0', position: 'relative', zIndex: 2 }}>
				{featureImages.map((feature, idx) => (
					<FeatureSection key={idx} feature={feature} idx={idx} darkMode={darkMode} />
				))}
			</div>
			{showGallery && (
        <div style={{ width: '90vw', maxWidth: '1200px', margin: '0 auto', padding: '2rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ImageGallery dark={darkMode} />
        </div>
      )}
			{!token && (
        <div style={{ width: '100%', textAlign: 'center', margin: '2rem 0', position: 'relative', zIndex: 2 }}>
          <MainButton
            dark={darkMode}
            style={{ fontSize: '1.25rem', padding: '1rem 2.5rem', borderRadius: '8px' }}
            onClick={() => window.location.href = '/monochrome_todo/register'}
          >
            Join Now
          </MainButton>
        </div>
      )}
		</section>
	);
};

const bounce = {
	animation: 'bounceDown 2.2s infinite',
};

const DownArrow = ({ visible, onClick, dark }) => {
	if (!visible) return null;
	 return (
	 	<button
	 		style={{
	 			position: 'fixed',
	 			left: 'calc(50% - 31px)',
	 			bottom: '32px',
	 			transform: 'translateX(-50px)',
	 			background: dark ? '#111' : '#fff',
	 			color: dark ? '#fff' : '#111',
	 			border: `0px solid ${dark ? '#fff' : '#111'}`,
	 			borderRadius: '50%',
	 			boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
	 			width: '40px',
	 			height: '40px',
	 			display: 'flex',
	 			alignItems: 'center',
	 			justifyContent: 'center',
	 			fontSize: '1.5rem',
	 			cursor: 'pointer',
	 			zIndex: 1000,
	 			opacity: 0.92,
	 			transition: 'background 0.2s, color 0.2s, border 0.2s',
	 			...bounce,
	 		}}
            onClick={onClick}
	 		
	 		aria-label="Scroll down"
	 	>
	 		<span style={{ display: 'block', width: '100%', height: '100%', lineHeight: '1', fontWeight: 700, transform: 'translateX(-10px) translateY(-10px)' }}>
	 			▼
	 		</span>
	 		<style>{`
	 			@keyframes bounceDown {
	 				0%, 100% { transform: translateY(0); }
	 				50% { transform: translateY(8px); }
	 			}
	 		`}</style>
	 	</button>
	 );
};

const LandingPage = () => {
	const { darkMode } = useContext(ThemeContext);
	const bgColor = darkMode ? '#111' : '#fff';
	const textColor = darkMode ? '#eee' : '#222';
	const [showArrow, setShowArrow] = useState(true);
	const token = localStorage.getItem('token');

	useEffect(() => {
		const handleScroll = () => {
			setShowArrow(window.scrollY < 32);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleArrowClick = () => {
		window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
	};

	return (
		<div style={{ position: 'relative', minHeight: '100vh', width: '100vw', maxWidth: '100vw', overflowX: 'hidden', background: bgColor, color: textColor, margin: 0, padding: 0, transition: 'background 0.3s, color 0.3s' }}>
			<ThemeToggle />
			<BubblesBackground />
			{token ? <LoggedInLanding dark={darkMode} /> : <WelcomeText dark={darkMode} />}
			<GallerySection />
			<Footer />
			<DownArrow visible={showArrow} onClick={handleArrowClick} dark={darkMode} />
		</div>
	);
};

export default LandingPage;
