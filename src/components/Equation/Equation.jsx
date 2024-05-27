import React, { useState } from 'react'
import { evaluate } from 'mathjs'
import styles from './Equation.module.css'
import { IEquation, Operand, Operator, TYPES, validateNewValue } from './interfaces/IEquation'
// import Droppable from '../DragDrop/Droppable';
// import Draggable from '../DragDrop/Draggable';
import DragDrop from '../DragDrop/DragDrop'
import { useEffect } from 'react'

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
	] = useState(new IEquation)
	/** Tracks whether we display editing controls or not */
	const [isEditMode, setIsEditMode] = useState(false);

	useEffect(() => {
		setEquation(props.equation)
	}, [props.equation])

	//
	// STATE FUNCTIONS - functions for more involved state handling
	//

	/**
	 * @param {number} expressionIndex Index of the expression in the equation.expressions[index]
	 * @param {number} expressionPartIndex Index of the part in expression.parts[index]
	 * @param {number | string} newValue new value for an Operand (number) or Operator (string)
	 */
	function updateExpression(oldIndex, newIndex) {
		if (oldIndex === undefined || newIndex === undefined) return;

		console.log('equation BEFORE: ', equation);
		let updatedEquation = equation;
		const movingObject = updatedEquation.pieces.slice(oldIndex, oldIndex + 1)[0]
		updatedEquation.pieces = updatedEquation.pieces.toSpliced(oldIndex, 1);
		updatedEquation.pieces.splice(newIndex, 0, movingObject)

		console.log('updatedEquation.pieces: ', updatedEquation.pieces);

		// CODE FOR SWAPPING - future functionality

		// const newIndexObject = updatedEquation.pieces[newIndex];
		// updatedEquation.pieces[newIndex] = updatedEquation.pieces[oldIndex];
		// updatedEquation.pieces[oldIndex] = newIndexObject;

		// [updatedEquation[oldIndex], updatedEquation[newIndex]] = [updatedEquation[newIndex], updatedEquation[oldIndex]]
		setEquation(new IEquation(updatedEquation.pieces));
		console.log('equation AFTER: ', equation);
		console.log('updatedEquation: ', updatedEquation);
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

		const [isSolvable, solution] = equation.isSolvable();

		console.log(`isSolvable: ${isSolvable}\nsolution: ${solution}`);

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
	function renderPiecesForDisplay(equation) {
		return (
			<div className='display-pieces' id={'pieces_' + equation.name} key={'display_pieces_' + equation.name}>
				{
					equation.pieces.map((piece, index) => {
						return (
							<div className='piece' key={`pieces_${equation.name}_piece_${index}`}>
								<div className={styles.name}>{piece.name}</div>
								<div className={styles.value}>{piece.value}</div>
							</div>
						)
					})
				}
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

	function renderablePieces() {
		const components = [];

		equation.pieces.forEach((p, index) => {
			components.push(
				<div className='equation-piece' data-piece-index={index}>
					<div className='equation-piece-value'>{p.value}</div>
					<div className='equation-piece-name'>{p.name === '' ? " " : p.name}</div>
				</div>
			)
		})

		return components;
	}

	/** Equation.jsx's return-statement */
	return (
		<div key={'eq_' + props.id} className={styles.main}>

			{/* NON-EDIT DISPLAY */
				// !isEditMode &&
				renderPiecesForDisplay(equation)
			}

			<div className={styles.controls}>
				{/* EQUATION CONTROLS */}
				<div className={styles.main_buttons_container}>
					<button onClick={handleToggleEditMode}>{isEditMode ? 'DONE' : 'EDIT'}</button>
					<button onClick={() => handleRunEquation(equation)}>RUN</button>
				</div>

				{/* EDIT CONTROLS */
					isEditMode &&
					<div className={styles.add_buttons_container}>
						<h2>Add:</h2>
						<button onClick={handleAddNumber}>Number</button>
						<button>Operator</button>
					</div>
				}
			</div>

			{/* EDIT DISPLAY */
				isEditMode &&
				<DragDrop
					id={props.id}
					draggableContent={renderablePieces}
					onDrop={updateExpression}
				/>
			}
		</div>
	)
}
