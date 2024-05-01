// REACT
import { useState } from 'react'
// STYLES
import './App.css'
// COMPONENTS
import Equation from './components/Equation/Equation'
import EquationList from './components/Equation/EquationList';
import EquationEditing from './components/Equation/EquationEditing';
// INTERFACES
import { TYPES, IEquation, IEquationPiece, Operator, Operand, Expression } from './components/Equation/interfaces/IEquation';
// TESTING
import TestData from './data/TestData';

function App() {
	/**
	 * Holds the equation in an array [num, operator, num, operator, etc.]
	 */
	const [currEquation, setCurrEquation] = useState(TestData[0]);


	/**
	 * Holds all equations that have been created
	 */
	const [equations, setEquations] = useState(TestData)

	const handleAddNewEquation = () => {
		console.log('handleAddNewEquation() -> fired');
		const num1 = document.getElementById('num1').value;
		const num2 = document.getElementById('num2').value;

		console.log(`num1: ${num1}, num2: ${num2}`);

		setEquations(e => [...e, new IEquation([num1, '+', num2])])
	}

	return (
		<>
			<ul className='list-of-equations'>
				{
					equations.map((equation, index) => {
						return (
							<Equation
								equation={equation}
								nthEquation={index}
							/>
						)
					})
				}
			</ul>
		</>
	)
}

export default App
