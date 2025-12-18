import { useState } from 'react';
import Turnstile from 'react-turnstile';
import './App.css';
function App() {
	const [_isVerified, setIsVerified] = useState(false);
	const [token, setToken] = useState('');

	return (
		<>
			<Turnstile
				sitekey="0x4AAAAAACHWD8GD0z7k1dXg"
				language="en"
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

			<button onClick={() => console.log(token)}>Register</button>
		</>
	);
}

export default App;
