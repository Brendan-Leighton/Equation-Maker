// REACT
import React, { useState } from 'react'

// INTERFACES
import { TYPES, IEquationPiece } from './interfaces/IEquation';

// UTILS
import { isNumber, isOperator, isParenthesis } from './utils/PartValidation';
import Equate from './utils/Equate';

export default function EquationEditing({ equation }) {


	let initialEditablePieces = [];
	equation.expressions.forEach(expression => {
		let expressionParts = [];

		expression.parts.forEach(() => {
			expressionParts.push[false];
		})

		initialEditablePieces.push(expressionParts);
	})

	/**
		 * Holds the equation in an array [num, operator, num, operator, etc.]
		 */
	const [currEquation, setCurrEquation] = useState(equation);
	const [editablePieces, setEditablePieces] = useState(initialEditablePieces)
	const [evalutatedEquation, setEvaluatedEquation] = useState(Equate(currEquation))

	const toggleEditMode = (newValue, index) => {
		console.log('toggleEditMode');

		// toggle bool for editablePiece w/passed in index
		const newEditablePieces = editablePieces
		newEditablePieces[index] = !editablePieces[index]
		setEditablePieces([...newEditablePieces])

		console.log(editablePieces);
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

	const handleAddNumber = () => {
		// return if previous part is not an operator
		if (currEquation.parts[currEquation.parts.length - 1].type !== TYPES.OPERATOR) {
			console.log("can't add number because last part isn't an operator");
			return
		}

		// empty string becomes a 0
		const newValue = document.getElementById('new-number').value;
		const newNumber = newValue === '' ? '0' : newValue;

		// set state
		setCurrEquation(e => {
			return new IEquation([...currEquation.parts, new IEquationPiece(TYPES.OPERAND, newNumber)])
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
			return new IEquation([...currEquation.parts, new IEquationPiece(TYPES.OPERATOR, newOperator)])
		})
	}

	return (
		<>
			<div className='curr-equation-container'>
				{
					currEquation.map((expression, index) => {
						return expression.map((part, index) => {
							return (
								<div className='curr-equation-piece' key={index}>
									{
										editablePieces[index] ?
											<input
												onChange={event => handleEquationPartChange(event.target.value, part, index)}
												key={index}
												defaultValue={part.value}
												className='curr-equation-value'
												type={part.type === TYPES.OPERAND ? 'number' : 'text'}
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

					})
				}
				<button type='button' onClick={() => setEvaluatedEquation(Equate(currEquation))}>RUN</button>
				<span className="evalutated-equation">result: {evalutatedEquation}</span>
			</div>


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
		</>
	)
}
