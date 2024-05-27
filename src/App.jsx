// REACT
import { useState } from 'react'
// STYLES
import './App.css'
// COMPONENTS
import DragDrop from './components/DragDrop/DragDrop';
// INTERFACES
import { IEquation } from './components/Equation/interfaces/IEquation';
// TESTING
import TestData from './data/TestData';
import Equation from './components/Equation/Equation';

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

	function handleDragStart(event) {
		event.dataTransfer.clearData();
		event.dataTransfer.setData('text', event.target.id)
	}

	function handleDragOver(event) {
		event.preventDefault();

	}

	function handleDrop(event) {
		event.preventDefault();
		if (!event.target.droppable) return
		const data = event.dataTransfer.getData('text');
		event.target.appendChild(document.getElementById(data))
	}

	console.log('TestData: ', TestData);
	console.log('equations: ', equations);

	/** App.jsx's return statement */
	return (
		<>
			{
				equations.map((eq, index) => {
					return (
						<div key={index}>
							<hr />
							<Equation
								id={index}
								equation={eq}
							/>
						</div>
					)
				})
			}

			{/* <EquationList
				equations={equations}
			/> */}
		</>
	)
}

export default App
