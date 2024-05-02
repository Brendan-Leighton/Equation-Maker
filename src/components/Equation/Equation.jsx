import React, { useState } from 'react'
import { evaluate } from 'mathjs'
import styles from './Equation.module.css'
import { IEquation, Expression, Operand, Operator, TYPES, validateNewValue } from './interfaces/IEquation'

/**
 * 
 * @param {*} props 
 * @returns 
 */
export default function Equation(props) {

	//
	// STATE
	//

	const [
		/** @type {IEquation} equation */
		equation,
		setEquation
	] = useState(props.equation)
	/** Tracks whether we display editing controls or not */
	const [isEditMode, setIsEditMode] = useState(false);

	//
	// STATE FUNCTIONS - functions for more involved state handling
	//

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

	/**
	 * 
	 * @param {Operand | Operator} newPart New part to apend to the end of the expression
	 */
	function addToEquation(newPart) {
		console.log(`addToEquation(${JSON.stringify(newPart)})`);
		const updatedEquation = equation;
		// add operand to end of last expression
		if (newPart.type === TYPES.OPERAND) {
			console.log('TYPE === OPERAND');
			updatedEquation.expressions[updatedEquation.expressions.length - 1].parts.push(newPart);
		}
		// add operator to end of equation, outside of last expression
		else {
			console.log('TYPE === OPERATOR');
			updatedEquation.expressions.push(newPart)
		}
		setEquation(new IEquation(updatedEquation.expressions));
	}

	// 
	// "HANDLE" FUNCTIONS - functions that handle onClick, onChange, etc
	//

	/** Handles toggling edit mode. Keeping this for possible future development. */
	function handleToggleEditMode() {
		setIsEditMode(!isEditMode)
	}

	/**
	 * Handles the onClick for the 'RUN' button
	 * @param {IEquation} equation equation to run
	 */
	function handleRunEquation(equation) {
		const isRunnable = equation.isRunnable();
		console.log('isRunnable? ', isRunnable);
		if (!isRunnable) {
			window.alert("Equation isn't runnable")
			return;
		}
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

	/**
	 * Handles the change of an Operand via an onChange()
	 * @param {Operand} part 
	 * @param {number} expressionIndex Index for the expression that's in the equation rendered by this component
	 * @param {number} expressionPartIndex Index for the part inside the expression mentioned in expressionIndex
	 * @param {Event} e Event passed from the onChange
	 */
	function handleOperandChange(part, expressionIndex, expressionPartIndex, e) {
		const isValid = validateNewValue(part.type, e.target.value);
		console.log(`handleOperandChange(\n\tpart: ${JSON.stringify(part)}, \n\tkey: ${expressionPartIndex}, \n\te.value: ${e.target.value})\n\tisValid: ${isValid}`);
		isValid && updateExpression(expressionIndex, expressionPartIndex, e.target.value);
	}

	/**
	 * Handles the change of an Operator via an onChange()
	 * @param {Operator} part The Operator being updated
	 * @param {number} expressionIndex Index for the expression that's in the equation rendered by this component
	 * @param {number} expressionPartIndex Index for the part inside the expression mentioned in expressionIndex
	 * @param {Event} e Event passed from the onChange
	 */
	function handleOperatorChange(part, expressionIndex, expressionPartIndex, e) {
		const isValid = validateNewValue(part.type, e.target.value);
		console.log(`handleOperatorChange(\n\tpart: ${JSON.stringify(part)}, \n\tkey: ${expressionPartIndex}, \n\te.value: ${e.target.value})\n\tisValid: ${isValid}`);
		isValid && updateExpression(expressionIndex, expressionPartIndex, e.target.value);
	}

	/**
	 * Handles adding a new Operand opbject to the Equation
	 */
	function handleAddNumber() {
		addToEquation(new Operand(0, 'name'))
	}

	// 
	// "RENDER" FUNCTIONS - functions that return HTML
	//

	/**
	 * Renders an Operator or Operand in Edit mode
	 * @param {Operator | Operand} part 
	 * @param {number} expressionIndex Index of the expression in the equation.expressions[index]
	 * @param {number} expressionPartIndex Index of the part in expression.parts[index]
	 * @returns {React.JSX.Element} Component for editing the respective data
	 */
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

	/**
	 * Renders an Operator or Operand in it's display (non-editing) state
	 * @param {Operand | Operator} part Part to render
	 * @returns {React.JSX.Element} HTML for viewing the part
	 */
	function renderPart_display(part) {
		return (
			<>
				<div className={styles.name}>{part.name}</div>
				<div className={styles.value}>{part.value}</div>
			</>
		)
	}

	/**
	 * Renders an Operand or Operator in display mode or edit mode, depending on state variable 'isEditMode'
	 * @param {Operand | Operator} part Part to render markup for
	 * @param {number} expressionIndex Index of the expression in the equation.expressions[index]
	 * @param {number} expressionPartIndex Index of the part in expression.parts[index]
	 * @returns {React.JSX.Element} HTML for displaying or editing
	 */
	function renderPart(part, expressionIndex, expressionPartIndex) {
		return (
			<div className={styles.part_container} key={expressionPartIndex}>
				{isEditMode ? renderPart_edit(part, expressionIndex, expressionPartIndex) : renderPart_display(part)}
			</div>
		)
	}

	/**
	 * Renders HTML controls for editing the current Equation
	 * @returns {React.JSX.Element} 
	 */
	function renderEditControls() {
		return (
			<div className={styles.add_buttons_container}>
				<h2>Add:</h2>
				<button onClick={handleAddNumber}>Number</button>
				<button>Operator</button>
			</div>
		)
	}

	/**
	 * Renders a given expression. 
	 * @param {Expression} expression Expression to render 
	 * @param {number} expressionIndex Index of the expression in the equation.expressions[index]
	 * @returns {React.JSX.Element}
	 */
	function renderExpression(expression, expressionIndex) {
		// loop the parts of the expression
		return (
			expression.parts.map((part, expressionPartIndex) => {
				return (
					<div key={expressionPartIndex}>
						{
							renderPart(part, expressionIndex, expressionPartIndex)
						}
					</div>
				)
			})
		)
	}

	/** Equation.jsx's return-statement */
	return (
		<>
			{isEditMode && renderEditControls()}

			<div className={styles.equation_container}>
				{
					// loop expressions/operators in the equation
					equation.expressions.map((item, expressionIndex) => {
						console.log(`Mapping Expressions in Equation\n\texpressionIndex: ${expressionIndex}\n\titem: ${JSON.stringify(item)}`);

						return item.type === TYPES.OPERATOR ?
							renderPart(item, expressionIndex, expressionIndex) :
							renderExpression(item, expressionIndex)
					})
				}
			</div>

			<div className={styles.main_buttons_container}>
				<button onClick={handleToggleEditMode}>{isEditMode ? 'DONE' : 'EDIT'}</button>
				<button onClick={() => handleRunEquation(equation)}>RUN</button>
			</div>
		</>
	)
}
