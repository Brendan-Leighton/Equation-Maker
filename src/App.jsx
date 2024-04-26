import { useState } from 'react'
import './App.css'
import { evaluate, isInteger } from 'mathjs'

const TYPES = {
	OPERATOR: 'OPERATOR',
	OPERAND: 'OPERAND',
	VARIABLE: 'VARIABLE',
	PARENTHESIS: {
		OPEN: 'OPEN',
		CLOSED: 'CLOSED'
	}
}

class EquationPiece {
	type;
	value;
	isEditable;

	constructor(type, value, isEditable = true) {
		this.type = type;
		this.value = value;
		this.isEditable = isEditable;
	}
}

class Equation {
	parts = [];

	constructor(equationPieces) {
		this.parts = equationPieces;
	}

	addPart(part) {
		this.parts.push(part)
	}
}

const defaultData = [
	new Equation([
		new EquationPiece(TYPES.OPERAND, '10'),
		new EquationPiece(TYPES.OPERATOR, '-'),
		new EquationPiece(TYPES.OPERAND, '5'),
	]),
	new Equation([
		new EquationPiece(TYPES.OPERAND, '20'),
		new EquationPiece(TYPES.OPERATOR, '+'),
		new EquationPiece(TYPES.OPERAND, '30'),
		new EquationPiece(TYPES.OPERATOR, '-'),
		new EquationPiece(TYPES.OPERAND, '40'),
	]),
]

function App() {
	/**
	 * Holds the equation in an array [num, operator, num, operator, etc.]
	 */
	const [currEquation, setCurrEquation] = useState(new Equation([
		new EquationPiece(TYPES.OPERAND, '1'),
		new EquationPiece(TYPES.OPERATOR, '+'),
		new EquationPiece(TYPES.OPERAND, '2'),
	]));

	/**
	 * 
	 */
	const [currEquationChangingPart, setCurrEquationChangingPart] = useState('');

	const [editablePieces, setEditablePieces] = useState([false, false, false])

	/**
	 * Holds all equations that have been created
	 */
	const [equations, setEquations] = useState(defaultData)

	const handleAddNewEquation = () => {
		console.log('handleAddNewEquation() -> fired');
		const num1 = document.getElementById('num1').value;
		const num2 = document.getElementById('num2').value;

		console.log(`num1: ${num1}, num2: ${num2}`);

		setEquations(e => [...e, new Equation([num1, '+', num2])])
	}

	const handleRunEquation = (equation) => {
		let eqStr = ''

		equation.parts.forEach(part => {
			eqStr += part.value
		})

		console.log(`expression: ${eqStr} = ${evaluate(eqStr)}`);
	}

	/**
	 * Return HTML to display an equation
	 * 
	 * @param {Equation} equation
	 */
	const markupEquation = (equation) => {

		return (
			<>
				{
					equation.parts.map((part, index) => {
						return <span key={index}>{part.value}</span>
					})
				}
				<button onClick={e => handleRunEquation(equation)}>RUN</button>
			</>
		)
	}

	/**
	 * Return an HTML form for editing an equation's pieces
	 * 
	 * @param {Equation} equation
	 */
	const markupEquationForm = (equation) => {

		return equation.parts.map((part, index) => {
			return (
				<input
					onChange={event => handleEquationPartChange(event, index)}
					key={index}
					defaultValue={part.value}
					size={5}
				/>
			)
		})
	}

	const handleAddNumber = () => {
		// return if previous part is not an operator
		if (currEquation.parts[currEquation.parts.length - 1].type !== TYPES.OPERATOR) {
			console.log("can't add number because last part isn't an operator");
			return
		}

		// get new value if not empty string else 0
		const newValue = document.getElementById('new-number').value;
		const newNumber = newValue === '' ? '0' : newValue;

		// set state
		setCurrEquation(e => {
			return new Equation([...currEquation.parts, new EquationPiece(TYPES.OPERAND, newNumber)])
		})
	}

	const handleAddOperator = () => {
		// return if previous part is also an operator
		if (currEquation.parts[currEquation.parts.length - 1].type === TYPES.OPERATOR) {
			console.log("can't add operator because last part is an operator");
			return
		}

		// get new operator value
		const newOperator = document.getElementById('select-operator').value;

		// set state
		setCurrEquation(e => {
			return new Equation([...currEquation.parts, new EquationPiece(TYPES.OPERATOR, newOperator)])
		})
	}

	const toggleEditMode = (newValue, index) => {
		console.log('toggleEditMode');

		// when switching from edit mode to display mode, we verify the type of the new value matches the previous value
		// if (editablePieces[index]) {
		// 	console.log('newValue: ', newValue);
		// 	console.log(`editablePieces[${index}], newValue: ${newValue}`);
		// 	handleEquationPartChange(newValue, currEquation[index])
		// }

		// toggle bool for editablePiece w/passed in index
		const newEditablePieces = editablePieces
		newEditablePieces[index] = !editablePieces[index]
		setEditablePieces([...newEditablePieces])

		console.log(editablePieces);
	}

	const isNumber = (value) => {
		console.log('isNumber? ', !isNaN(value));

		return !isNaN(value);

	}

	const isOperator = (str) => {
		return (str === '+' || str === '-' || str === '*' || str === '/');
	}

	const isParenthesis = (str) => {
		return str === '(' || str === ')';
	}

	const handleEquationPartChange = (newValue, currPart, partIndex) => {
		if (newValue === '') return
		const currValue = currPart.value;
		const currValueType = currPart.type;

		console.log(`checking changing equation part: \nnewValue: ${newValue} \ncurrValue: ${currValue} \ncurrValueType: ${currValueType}`);

		// don't update value if newValue isn't the same type as currValue
		switch (currValueType) {
			case TYPES.OPERAND: {
				let isNum = isNumber(newValue)
				console.log(isNum);
				if (!isNum) return
				break;
			}
			case TYPES.OPERATOR:
				if (!isOperator(newValue)) return
				break;
			case TYPES.PARENTHESIS:
				if (!isParenthesis(newValue)) return
				break;
			default:
				return
			// break;
		}

		console.log('checking changing equation part: passed switch-statement');

		const updatedEquation = currEquation;
		console.log('updatedEquation - before change: ', updatedEquation);
		updatedEquation.parts[partIndex].value = newValue;
		console.log('updatedEquation - after change: ', updatedEquation);

		setCurrEquation(updatedEquation)
	}

	const markupCurrentEquation = () => {

		return (
			<>
				<div className='curr-equation-container'>
					{
						currEquation.parts.map((part, index) => {
							return (
								<div className='curr-equation-piece' key={index}>
									{
										editablePieces[index] ?
											<input
												onChange={event => handleEquationPartChange(event.target.value, part, index)}
												key={index}
												defaultValue={part.value}
												className='curr-equation-value'
												type='number'
											/> :
											<div className="curr-equation-value">{part.value}</div>
									}
									<div className="curr-equation-buttons">
										<button className="edit-curr-equation-value" onClick={e => toggleEditMode(e.target.value, index)}>e</button>
										<button className="move-curr-equation-value">m</button>
									</div>
								</div>
							)
						})
					}
				</div>
			</>
		)
	}

	return (
		<>
			{markupCurrentEquation(currEquation)}

			<p>Add Part:</p>
			<label htmlFor="new-number">Number:
				<input id='new-number' type="number" defaultValue={0} />
			</label>
			<button onClick={handleAddNumber}>Add Number</button>

			<br />
			<select name="operators" id="select-operator">
				<option value="+">+</option>
				<option value="-">-</option>
				<option value="*">*</option>
				<option value="/">/</option>
			</select>
			<button onClick={handleAddOperator}>Add Operator</button>

			<p>Equation: {markupEquation(currEquation)}
			</p>

			<h2>Equations:</h2>

			<ul>
				{
					equations.map((equation, index) => {
						return (
							<li key={index}>{markupEquation(equation)}</li>
						)
					})
				}
			</ul>
		</>
	)
}

export default App
