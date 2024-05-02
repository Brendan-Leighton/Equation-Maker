// REACT
import { useState } from 'react'
// STYLES
import './App.css'
// COMPONENTS
import Equation from './components/Equation/Equation'
import EquationList from './components/Equation/EquationList';
// INTERFACES
import { TYPES, IEquation, IEquationPiece, Operator, Operand, Expression } from './components/Equation/interfaces/IEquation';
// TESTING
import TestData from './data/TestData';

function App() {

	//
	// STATE
	//

	/** Holds all equations that have been created */
	const [equations, setEquations] = useState(TestData)

	/**
	 * Handles adding a new Equation object to the equations state
	 */
	const handleAddNewEquation = () => {
		console.log('handleAddNewEquation() -> fired');
		const num1 = document.getElementById('num1').value;
		const num2 = document.getElementById('num2').value;

		console.log(`num1: ${num1}, num2: ${num2}`);

		setEquations(e => [...e, new IEquation([num1, '+', num2])])
	}

	/** App.jsx's return statement */
	return (
		<>
			<EquationList
				equations={equations}
			/>
		</>
	)
}

export default App
