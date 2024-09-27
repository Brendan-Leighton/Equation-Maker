import React from 'react'
import styles from './EditablePiece.module.css'
import { IEquation, TYPES } from '../interfaces/IEquation'

export function EditablePiece({
	p,
	index,
	handleClick_EditPiece,
	handleChange_PieceValue,
	handleChange_PieceName
}) {


	// function handleClick_EditPiece(index) {
	//     const newEquation = new IEquation(equation.pieces, equation.name)
	//     newEquation.pieces[index].isEditMode = !newEquation.pieces[index].isEditMode;
	//     setEquation(newEquation)
	// }

	// function handleChange_PieceValue(e, index) {
	//     const newEquation = new IEquation(equation.pieces, equation.name)
	//     newEquation.pieces[index].value = e.target.value;
	//     setEquation(newEquation)
	// }

	return (
		<>
			{
				<div className={styles.EditablePiece} data-piece-index={index} key={index}>
					<div className={styles.equation_piece_controls}>
						<button onClick={handleClick_EditPiece} className={styles.equation_piece_control_edit}>edit</button>
					</div>
					<div className={styles.equation_piece_name}> {p.name === '' ? ` ` : p.name} </div>
					{
						p.isEditMode ?
							(p.type === TYPES.OPERATOR &&
								<select
									name="operators"
									id="operators"
									defaultValue={p.value}
									onChange={handleChange_PieceValue}
								>
									<option>+</option>
									<option>-</option>
									<option>*</option>
									<option>/</option>
								</select>
							)
							||
							((p.type === TYPES.CONSTANT || p.type === TYPES.VARIABLE) &&
								<>
									{/* <label
                                        htmlFor={`${p.name}-${index}`}
                                    >{p.name}</label> */}
									<input
										type='text'
										defaultValue={p.name === '' ? 'name' : p.name}
										onChange={handleChange_PieceName}
										id={`${p.name}-name-${index}`}
									/>
									<input
										type='number'
										defaultValue={p.value}
										onChange={handleChange_PieceValue}
										id={`${p.name}-value-${index}`}
									/>
								</>
							)
							: <div className={styles.equation_piece_value}>{p.value}</div>
					}
				</div>
			}
		</>
	)
}