import React, { useContext, useEffect, useState } from 'react';
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

const WelcomeText = ({ dark }) => (
	<LandingWrapper dark={dark} style={{ zIndex: 1, position: 'relative', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', padding: '0 1rem' }}>
		<Title dark={dark}>Monochrome Todo List</Title>
		<Subtitle dark={dark}>
			Professional, minimalist productivity app for creators. Organize your tasks, track your progress, and stay focused.
		</Subtitle>
		<ButtonGroup>
			<MainButton dark={dark}>Sign In</MainButton>
			<MainButton dark={dark}>Sign Up</MainButton>
		</ButtonGroup>
	</LandingWrapper>
);

const GallerySection = () => {
  const { darkMode } = useContext(ThemeContext);
	return (
		<section style={{ width: '100vw', maxWidth: '100vw', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', margin: '0 auto', padding: '4rem 0', position: 'relative' }}>
			<ImageGallery dark={darkMode} />
			<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', margin: '4rem 0', position: 'relative', zIndex: 2 }}>
				{featureImages.map((feature, idx) => (
					<div key={idx} style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
						<img
							src={feature.src}
							alt={feature.label}
							style={{
								width: '90%',
								maxWidth: '500px',
								borderRadius: '16px',
								boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
								margin: '0 auto',
								display: 'block',
							}}
						/>
						<div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: darkMode ? '#eee' : '#444', textAlign: 'center', marginTop: '0.5rem' }}>{feature.label}</div>
						<div style={{ fontSize: '1.05rem', color: darkMode ? '#bbb' : '#888', textAlign: 'center', marginBottom: '1rem' }}>{feature.desc}</div>
					</div>
				))}
			</div>
			<div style={{ width: '100%', textAlign: 'center', margin: '2rem 0', position: 'relative', zIndex: 2 }}>
				<MainButton dark={darkMode} style={{ fontSize: '1.25rem', padding: '1rem 2.5rem', borderRadius: '8px' }}>
					Join Free
				</MainButton>
			</div>
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
	 			left: 'calc(50% - 32px)',
	 			bottom: '32px',
	 			transform: 'translateX(-50px)',
	 			background: dark ? '#111' : '#fff',
	 			color: dark ? '#fff' : '#111',
	 			border: `2px solid ${dark ? '#fff' : '#111'}`,
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
			<WelcomeText dark={darkMode} />
			<GallerySection />
			<Footer />
			<DownArrow visible={showArrow} onClick={handleArrowClick} dark={darkMode} />
		</div>
	);
};

export default LandingPage;
