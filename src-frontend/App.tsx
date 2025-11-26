import { useState } from 'react';
import './App.css';
function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>Hello world!</div>
			<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
		</>
	);
}

export default App;
