import React, { useContext } from 'react';
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
	// Example in-use screenshots (replace with your own later)
	'https://user-images.githubusercontent.com/25181517/221352926-2b7c3a92-2c7e-4c3c-9a3c-7c6e8b2b8a8c.png',
	'https://user-images.githubusercontent.com/25181517/221352928-7b2c7e7e-2c7e-4c3c-9a3c-7c6e8b2b8a8c.png',
	'https://user-images.githubusercontent.com/25181517/221352929-8c2c7e7e-2c7e-4c3c-9a3c-7c6e8b2b8a8c.png',
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
		<Title dark={dark}>Monochrome Todo</Title>
		<Subtitle dark={dark}>
			Professional, minimalist productivity app for creators. Organize your tasks, track your progress, and stay focused.
		</Subtitle>
		<ButtonGroup>
			<MainButton dark={dark}>Sign In</MainButton>
			<MainButton dark={dark}>Sign Up</MainButton>
		</ButtonGroup>
	</LandingWrapper>
);

const GallerySection = () => (
	<section style={{ width: '100vw', maxWidth: '100vw', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'transparent', margin: '0 auto', padding: '4rem 0' }}>
		<ImageGallery />
		<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', margin: '4rem 0' }}>
			{featureImages.map((src, idx) => (
				<img
					key={idx}
					src={src}
					alt={`Feature ${idx + 1}`}
					style={{
						width: '90%',
						maxWidth: '500px',
						borderRadius: '16px',
						boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
						margin: '0 auto',
						display: 'block',
					}}
				/>
			))}
		</div>
			<div style={{ width: '100%', textAlign: 'center', margin: '2rem 0' }}>
				<MainButton dark={useContext(ThemeContext).darkMode} style={{ fontSize: '1.25rem', padding: '1rem 2.5rem', borderRadius: '8px' }}>
					Join Free
				</MainButton>
			</div>
	</section>
);

const LandingPage = () => {
	const { darkMode } = useContext(ThemeContext);
	const bgColor = darkMode ? '#111' : '#fff';
	const textColor = darkMode ? '#eee' : '#222';
	return (
		<div style={{ position: 'relative', minHeight: '100vh', width: '100vw', maxWidth: '100vw', overflowX: 'hidden', background: bgColor, color: textColor, margin: 0, padding: 0, transition: 'background 0.3s, color 0.3s' }}>
			<ThemeToggle />
			<BubblesBackground />
			<WelcomeText dark={darkMode} />
			<GallerySection />
			<Footer />
		</div>
	);
};

export default LandingPage;
