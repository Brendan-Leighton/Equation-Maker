import React, { useState } from 'react'
import { evaluate } from 'mathjs'
import styles from './Equation.module.css'
import { TYPES, validateNewValue } from './interfaces/IEquation'

export default function Equation(props) {

	// STATE
	const [isEditMode, setIsEditMode] = useState(false);
	const [equation, setEquation] = useState(props.equation)

	function handleToggleEditMode() {
		setIsEditMode(!isEditMode)
	}

	function handleRunEquation(equation) {
		let eqStr = ''

		equation.expressions.forEach(item => {

			if (item.type === TYPES.OPERATOR) {
				eqStr += item.value;
			}
			else {
				item.parts.forEach(part => {
					eqStr += part.value
				})
			}

		})

		console.log(`expression: ${eqStr} = ${evaluate(eqStr)}`);
	}

	function handleOperandChange(part, expressionIndex, expressionPartIndex, e) {
		const isValid = validateNewValue(part.type, e.target.value);
		console.log(`handleOperandChange(\n\tpart: ${JSON.stringify(part)}, \n\tkey: ${expressionPartIndex}, \n\te.value: ${e.target.value})\n\tisValid: ${isValid}`);
		isValid && updateExpression(expressionIndex, expressionPartIndex, e.target.value);
	}

	function handleOperatorChange(part, expressionIndex, expressionPartIndex, e) {
		const isValid = validateNewValue(part.type, e.target.value);
		console.log(`handleOperatorChange(\n\tpart: ${JSON.stringify(part)}, \n\tkey: ${expressionPartIndex}, \n\te.value: ${e.target.value})\n\tisValid: ${isValid}`);
		isValid && updateExpression(expressionIndex, expressionPartIndex, e.target.value);
	}

	/**
	 * @param {number} expressionIndex Index of the expression in the equation.expressions[index]
	 * @param {number} expressionPartIndex Index of the part in expression.parts[index]
	 * @param {number | string} newValue new value for an Operand (number) or Operator (string)
	 */
	function updateExpression(expressionIndex, expressionPartIndex, newValue) {
		const updatedEquation = equation;
		updatedEquation.expressions[expressionIndex].parts[expressionPartIndex].value = newValue;
		setEquation(updatedEquation);
	}

	function renderPart_edit(part, expressionIndex, expressionPartIndex) {
		return (
			<>
				{
					part.type === TYPES.OPERATOR ?
						(
							<select
								name="operators"
								id="operators"
								defaultValue={part.value}
								onChange={e => handleOperatorChange(part, expressionIndex, expressionPartIndex, e)}
							>
								<option>+</option>
								<option>-</option>
								<option>*</option>
								<option>/</option>
							</select>
						) :
						(
							<>
								<label
									htmlFor={`${part.name}-${expressionPartIndex}`}
								>{part.name}</label>
								<input
									type='number'
									defaultValue={part.value}
									onChange={e => handleOperandChange(part, expressionIndex, expressionPartIndex, e)}
									id={`${part.name}-${expressionPartIndex}`}
								/>
							</>
						)
				}
			</>
		)
	}

	function renderPart_display(part) {
		return (
			<>
				<div className={styles.name}>{part.name}</div>
				<div className={styles.value}>{part.value}</div>
			</>
		)
	}

	function renderPart(part, expressionIndex, expressionPartIndex) {
		return (
			<>
				<div className={styles.part_container} key={expressionPartIndex}>
					{isEditMode ? renderPart_edit(part, expressionIndex, expressionPartIndex) : renderPart_display(part)}
				</div>
			</>
		)
	}

	function handleAddNumber() {
		console.log('adding number');
	}

	return (
		<li key={props.nthEquation}>
			{
				isEditMode &&
				<div className={styles.add_buttons_container}>
					<h2>Add:</h2>
					<button onClick={handleAddNumber}>Number</button>
					<button>Operator</button>
				</div>
			}

			<div className={styles.equation_container}>
				{
					// loop expressions/operators in the equation
					equation.expressions.map((item, expressionIndex) => {
						// operator between expressions
						if (item.type === TYPES.OPERATOR) {
							return renderPart(item, expressionIndex)
						}
						// loop the parts of the expression
						return item.parts.map((part, expressionPartIndex) => {
							return renderPart(part, expressionIndex, expressionPartIndex)
						})
					})
				}
			</div>

			<div className={styles.main_buttons_container}>
				<button onClick={handleToggleEditMode}>{isEditMode ? 'DONE' : 'EDIT'}</button>
				<button onClick={e => handleRunEquation(equation)}>RUN</button>
			</div>
		</li>
	)
}
