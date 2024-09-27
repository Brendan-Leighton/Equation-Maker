// REACT
import React, { useState, useEffect } from 'react'
// REACT ICONS
import { IconContext } from 'react-icons'
import { FaSave, FaRunning, FaArrowLeft } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
// STYLESHEETS
import styles from './Equation.module.css'
// PROJECT'S
import { Constant, IEquation, Operator, TYPES, Variable, Piece } from './interfaces/IEquation'
import { EditableEquation } from './components/EditableEquation'

/**
 *
 * @param {*} props
 * @returns
 */
export default function Equation(props: { equation: IEquation; id: string }) {

	//
	// STATE
	//

	const [
		/** @type {IEquation} equation */
		equation,
		setEquation
	] = useState(new IEquation)
	/** toggle edit mode */
	const [isEditMode, setIsEditMode] = useState(false)
	/** toggle run mode */
	const [isRunMode, setIsRunMode] = useState(false)
	/** holds the solution after solving it */
	const [solution, setSolution] = useState('solution goes here')
	/** Holds the variable's values, if this equation has any pieces of TYPES.VARIABLES */
	const [variableValues, setVariableValues] = useState({})

	/** Title/Name of this equation */
	const [equationTitle, setEquationTitle] = useState('')

	// EDIT MODE STATE
	const [addPieceType, setAddPieceType] = useState(TYPES.CONSTANT)
	const [newPieceName, setNewPieceName] = useState('')
	const [newPieceValue, setNewPieceValue] = useState('')

	/**
	 * Set States
	 */
	useEffect(() => {
		setEquation(props.equation)
		setEquationTitle(props.equation.name)
	}, [props.equation])

	/**
	 * Stop scroll on <body/> when an equation is in edit-mode
	 */
	useEffect(() => {
		const bodyEl = document.getElementsByTagName('body')[0]
		if (bodyEl !== undefined || bodyEl !== null) {
			isEditMode && bodyEl.classList.add('no-scroll')
			!isEditMode && bodyEl.classList.remove('no-scroll')
		}
	}, [isEditMode])

	//
	// STATE FUNCTIONS - functions for more involved state handling
	//

	/**
	 * @param {number} expressionIndex Index of the expression in the equation.expressions[index]
	 * @param {number} expressionPartIndex Index of the part in expression.parts[index]
	 * @param {number | string} newValue new value for an Operand (number) or Operator (string)
	 */
	function updateExpression(oldIndex, newIndex) {
		if (oldIndex === undefined || newIndex === undefined) return

		// console.log('equation BEFORE: ', equation);
		let updatedEquation = equation
		const movingObject = updatedEquation.pieces.slice(oldIndex, oldIndex + 1)[0]
		updatedEquation.pieces = updatedEquation.pieces.splice(oldIndex, 1)
		updatedEquation.pieces.splice(newIndex, 0, movingObject)

		// CODE FOR SWAPPING - future functionality
		// [updatedEquation[oldIndex], updatedEquation[newIndex]] = [updatedEquation[newIndex], updatedEquation[oldIndex]]

		setEquation(new IEquation(updatedEquation.pieces))
	}

	//
	// "HANDLE" FUNCTIONS - functions that handle onClick, onChange, etc
	//

	/** Handles toggling edit mode. Keeping this for possible future development. */
	function handleClick_toggleEditMode(): void {
		setIsEditMode(!isEditMode)
	}

	/**
	 * Handles the onClick for the 'RUN' button
	 */
	function handleClick_runEquation(): void {
		setIsRunMode(true)
	}


	/**
	 * Handles the onClick for the 'SOLVE' button in the RUN-modal
	 */
	function handleClick_solveEquation(): void {
		const eqToSolve = equation
		eqToSolve.pieces.forEach((piece: Piece) => {
			if (variableValues[piece.id]) {
				piece.value = variableValues[piece.id]
			}
		})
		runEquation(eqToSolve)
	}

	function runEquation(equation: IEquation): void {
		const [isSolvable, newSolution] = equation.isSolvable()
		console.log(`isSolvable: ${isSolvable}, newSolution: ${newSolution}`)
		setSolution(newSolution)
	}

	function handleClick_EditPiece(index: number): void {
		const newEquation = new IEquation(equation.pieces, equation.name)
		newEquation.pieces[index].isEditMode = !newEquation.pieces[index].isEditMode
		setEquation(newEquation)
	}

	function handleChange_PieceValue(e: React.ChangeEvent<HTMLInputElement>, index: number): void {
		const newEquation = new IEquation(equation.pieces, equation.name)
		newEquation.pieces[index].value = e.target.value
		setEquation(newEquation)
	}

	function handleChange_PieceName(e: React.ChangeEvent<HTMLInputElement>, index: number): void {
		const newEquation = new IEquation(equation.pieces, equation.name)
		newEquation.pieces[index].name = e.target.value
		setEquation(newEquation)
	}

	function handleChange_selectPieceTypeToAdd(e: React.ChangeEvent<HTMLSelectElement>): void {
		console.log('handleChange_selectPieceTypeToAdd: e.target.value: ', e.target.value)
		setAddPieceType(e.target.value.toUpperCase())
	}

	function handleClick_AddPiece(): void {
		console.log(`handleClick_AddPiece\n\tType: ${addPieceType}\n\tValue: ${newPieceValue}\n\tName: ${newPieceName}`)
		let newPiece
		switch (addPieceType) {
			case TYPES.CONSTANT:
				newPiece = new Constant(+newPieceValue, newPieceName)
				break
			case TYPES.VARIABLE:
				try {
					newPiece = new Variable(+newPieceValue, newPieceName)
				} catch (error) {
					console.error(`ERROR: handleClick_AddPiece -> ${addPieceType} -> ${error}`)
				}
				break
			case TYPES.OPERATOR:
				if (newPieceValue === undefined || newPieceValue === null || newPieceValue === '') newPiece = new Operator('+')
				else newPiece = new Operator(newPieceValue)
				break

			default:
				return
		}

		console.log('new piece: ', newPiece)
		equation.pieces.push(newPiece)
		setEquation(new IEquation(equation.pieces, equation.name))
	}

	/**
	 * 
	 * @param {string} typeAsString 
	 */
	function formatTypeCamelCase(typeAsString: string): string {
		const letters = typeAsString.toLowerCase().split('')
		// getting first letter as CAPITALIZED
		let result = letters.slice(0, 1)[0].toUpperCase()
		// adding remaining letters as lowercase
		for (let index = 1; index < letters.length; index++) {
			result += letters[index]
		}
		return result
	}

	function handleChange_title(e: React.ChangeEvent<HTMLInputElement>): void {
		setEquationTitle(e.target.value)
	}

	function handleClick_saveUpdatedEquation(): void {
		handleClick_toggleEditMode()
	}

	function handleChange_variableValue(piece: Variable, event: React.ChangeEvent<HTMLInputElement>): void {
		const varVals = variableValues
		varVals[piece.id] = event.target.value
		setVariableValues(varVals)
	}
	console.log(equation.toString())
	console.log('variableValues: ', variableValues)

	function renderNamedPieces() {
		return equation.pieces.map((piece: any, index: number) => {
			if (piece.type === TYPES.VARIABLE) {
				return (
					<>
						<label htmlFor={`var_${index}`}>{piece.name}</label>
						<input onChange={e => handleChange_variableValue(piece, e)} id={`var_${index}`} type="number" />
					</>
				)
			}
		})
	}

	function renderFontAwesomeIcon(iconName: string): React.ReactNode {

		let iconElement

		switch (iconName) {
			case "ArrowLeft":
				iconElement = <FaArrowLeft />
				break
			// case "ArrowLeft":
			//     iconElement = <FaArrowLeft />
			//     break;
			// case "ArrowLeft":
			//     iconElement = <FaArrowLeft />
			//     break;
			default:
				console.warn(`renderFontAwesomeIcon(${iconName}) -> invalid icon name passed in`)
				break
		}
		return (
			<IconContext.Provider value={{ style: { margin: 'auto' } }}>
				{/* 
					TODO: add a tooltip to each icon.  
					Do we need the div?
				*/}
				<div>
					{iconElement}
				</div>
			</IconContext.Provider>
		)
	}

	/** Equation.jsx's return-statement */
	return (
		<div className={styles.Equation}>

			{/* LIST VIEW */}
			<div className={styles.equation_listView}>
				<h2 className={styles.title}>{equationTitle}</h2>
				<p className={styles.equation_string}>{equation.piecesString}</p>
				<button onClick={handleClick_toggleEditMode} className={styles.edit_button}>
					<MdEdit />
				</button>
				<button onClick={handleClick_runEquation} className={styles.run_button}>
					RUN <FaRunning />
				</button>
			</div>

			{ /* EDIT OVERLAY */
				isEditMode &&
				// div.equation_editView is the backdrop behind the modal,
				<div className={styles.equation_editView}>
					{/* div.container is the modal */}
					<div className={styles.container}>

						{/* CANCEL BUTTON */}
						<button className={styles.back_button} onClick={handleClick_toggleEditMode}>
							{renderFontAwesomeIcon("ArrowLeft")}
						</button>

						{/* SAVE BUTTON */}
						<button className={styles.save_button} onClick={handleClick_saveUpdatedEquation}>
							<FaSave />
						</button>

						{/* UPDATE TITLE */}
						<div className={styles.new_title}>
							<label htmlFor={`title_${equation.id}`}>Name</label>
							<input
								onChange={e => handleChange_title(e)}
								placeholder={equationTitle}
								type="text"
								id={`title_${equation.id}`}
							/>
						</div>

						{/* EQUATION STRING */}
						<p className={styles.equation_string}>
							{equation.piecesString}
						</p>

						{/* EDITABLE EQUATION - DRAG/DROP */}
						<EditableEquation
							id={props.id}
							equation={equation}
							handleChange_PieceValue={handleChange_PieceValue}
							handleChange_PieceName={handleChange_PieceName}
							handleClick_EditPiece={handleClick_EditPiece}
							updateExpression={updateExpression}
						/>

						{/* CONTROLS */}
						<div className={styles.add_piece_container}>

							<h2>Add a New Piece</h2>

							{/* SELECT NEW PIECE TYPE */}
							<div className={styles.piece_selection}>
								<label htmlFor="">Piece Type </label>
								<select
									name="piece-type"
									id="piece-type"
									className={styles.piece_type}
									onChange={e => handleChange_selectPieceTypeToAdd(e)}
								>
									<option>{formatTypeCamelCase(TYPES.CONSTANT)}</option>
									<option>{formatTypeCamelCase(TYPES.VARIABLE)}</option>
									<option>{formatTypeCamelCase(TYPES.OPERATOR)}</option>
									<option>{formatTypeCamelCase(TYPES.PARENTHESIS)}</option>
								</select>
							</div>

							{/* NEW PIECE FORM - DYNAMIC BASED ON THE TYPE CHOSEN ABOVE */}
							<div className={styles.new_piece_form}>

								{ // TYPE: CONSTANT or VARIABLE
									(addPieceType === TYPES.CONSTANT || addPieceType === TYPES.
										VARIABLE) &&
									<div className={styles.constant_and_variable_fields}>
										<div className={styles.new_name}>
											<label htmlFor='new-name'>Name</label>
											<input onChange={e => setNewPieceName(e.target.value)} id=
												{'new-name'} type='text' />
										</div>
										<div className={styles.new_value}>
											<label htmlFor='new-value'>Value</label>
											<input onChange={e => setNewPieceValue(e.target.value)} id=
												{'new-value'} type='number' />
										</div>
									</div>
								}

								{ // TYPE: OPERATOR
									addPieceType === TYPES.OPERATOR &&
									<div className={styles.operator_fields}>
										<select
											name="operators"
											id="operators"
											onChange={e => setNewPieceValue(e.target.value)}
										>
											<option>+</option>
											<option>-</option>
											<option>*</option>
											<option>/</option>
										</select>
									</div>
								}
								<button onClick={handleClick_AddPiece}>Add</button>
							</div>
						</div>

						{/* RUN BUTTON */}
						<button
							onClick={handleClick_runEquation}
							className={styles.run_button}
						> RUN <FaRunning />
						</button>

						{/* END OF className=styles.container */}
					</div>

					{/* END OF className=equation_editView */}
				</div>
			}

			{ /* RUN MODAL */
				isRunMode &&
				<div className={styles.run_modal}>
					<button onClick={() => setIsRunMode(false)}><FaArrowLeft /></button>

					{
						<p>{equation.piecesString} = <span className={styles.solution}>{solution}</span></p>
					}
					{
						equation.hasNamedPiece &&
						renderNamedPieces()
					}
					<button onClick={handleClick_solveEquation} className={styles.solve}>Solve</button>
				</div>
			}

			{/* END OF className=styles.Equation */}
		</div>
	)
}
