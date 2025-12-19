import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Turnstile from 'react-turnstile';
import './App.css';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function App() {
	const [_isVerified, setIsVerified] = useState(false);
	const [token, setToken] = useState('');
	const { t, i18n } = useTranslation();

	return (
		<div style={{ padding: '2rem' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
				<h1>{t('common.welcome')}</h1>
				<LanguageSwitcher />
			</div>

			<div style={{ maxWidth: '400px', margin: '0 auto' }}>
				<h2>{t('auth.signUp')}</h2>

				<div style={{ marginBottom: '1rem' }}>
					<label>{t('auth.fullName')}</label>
					<input type="text" placeholder={t('auth.fullName')} style={{ width: '100%', padding: '0.5rem' }} />
				</div>

				<div style={{ marginBottom: '1rem' }}>
					<label>{t('auth.email')}</label>
					<input type="email" placeholder={t('auth.email')} style={{ width: '100%', padding: '0.5rem' }} />
				</div>

				<div style={{ marginBottom: '1rem' }}>
					<label>{t('auth.password')}</label>
					<input type="password" placeholder={t('auth.password')} style={{ width: '100%', padding: '0.5rem' }} />
				</div>

				<div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
					<Turnstile
						sitekey="0x4AAAAAACHWD8GD0z7k1dXg"
						language={i18n.language}
						onVerify={(token) => {
							setToken(token);
							setIsVerified(true);
						}}
						theme="dark"
						retry="auto"
						retryInterval={1000}
						onError={() => {
							console.log('error');
						}}
					/>
				</div>

				<button
					onClick={() => console.log(token)}
					style={{
						width: '100%',
						padding: '0.75rem',
						backgroundColor: '#3b82f6',
						color: 'white',
						border: 'none',
						borderRadius: '0.375rem',
						cursor: 'pointer',
					}}
				>
					{t('common.register')}
				</button>

				<p style={{ marginTop: '1rem', textAlign: 'center' }}>
					{t('auth.alreadyHaveAccount')} <a href="#">{t('auth.signIn')}</a>
				</p>
			</div>
		</div>
	);
}

export default App;
