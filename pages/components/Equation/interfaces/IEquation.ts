
import { evaluate } from 'mathjs'

/**
 * Custome Types for Equations and it's parts.
 */
export const TYPES = {
	OPERATOR: 'OPERATOR',
	OPERAND: 'OPERAND',
	CONSTANT: 'CONSTANT',
	VARIABLE: 'VARIABLE',
	EXPRESSION: 'EXPRESSION',
	PARENTHESIS: 'PARENTHESIS',
	PARENTHESIS_OPEN: 'PAREN_OPEN',
	PARENTHESIS_CLOSED: 'PAREN_CLOSED'
}

export function validateNewValue(partType: string, newValue: number | string): boolean {
	switch (partType) {
		case TYPES.OPERATOR:
			return validateOperator(newValue as string)
		case TYPES.OPERAND:
			return validateOperand(newValue)
		default:
			return false
	}
}

function validateOperator(value: string): boolean {
	return (value === '+' || value === '-' || value === '*' || value === '/')
}

function validateOperand(value: number | string): boolean {
	// console.log(`validateOperand(${value})`);
	const isValid = (typeof (value) === 'number' && !isNaN(value)) || (typeof (value) === "string" && value.trim() !== '')
	// console.log(value + ' isValid: ', isValid);
	return isValid
}

function validateVariable(value: number | string): boolean {
	return validateOperand(value)
}

function generateId(part1: string, part2: string, part3: string | number) {
	return `${part1}_${part2}_${part3}_${Date.now()}`
}

export class Piece {
	id: string
	type: string
	name: string
	value: number | string
	isEditable: boolean
	isEditMode: boolean

	constructor (type: string, value: number | string = '', name: string = '', isEditable: boolean = true) {
		this.id = generateId(type, name, value)
		this.type = type
		this.name = name
		this.setValue(value)
		this.isEditable = isEditable
	}

	setValue(newValue: number | string) {
		// set value if valid value/type combo
		if (this.isValidValue(newValue)) {
			this.value = newValue
			return true
		}
		// return false if invalid value/type combo
		else return false
	}

	isValidValue(value: any): boolean {
		if (value === '') return true

		switch (this.type) {
			case TYPES.OPERATOR:
				return validateOperator(value)
			case TYPES.OPERAND:
				return validateOperand(value)
			case TYPES.CONSTANT:
			case TYPES.VARIABLE:
				return validateVariable(value)
			case TYPES.PARENTHESIS_OPEN:
				return (value === '(')
			case TYPES.PARENTHESIS_CLOSED:
				return (value === ')')
			default:
				return false
		}
	}
}

export class Operator extends Piece {
	constructor (value: string = '+') {
		super(TYPES.OPERATOR, value)
	}
}

export class Operand extends Piece {
	constructor (value: number | string, name: string = '') {
		if (validateOperand(value)) {

		}
		super(TYPES.OPERAND, value, name)
	}
}

export class Constant extends Piece {
	constructor (value: number | string = 0, name: string = 'constant') {
		if (validateOperand(value)) {
			super(TYPES.CONSTANT, value, name)
		}
	}
}

export class Variable extends Piece {
	constructor (value: number | string = 0, name: string = 'variable') {
		if (!validateOperand(value)) value = 0
		super(TYPES.VARIABLE, value, name)

	}

	updateValue(value: number | string) {
		const isValid = validateOperand(value)
		if (isValid) this.value = value
		return isValid
	}
}

export class Parenthesis extends Piece {
	constructor (isOpen: boolean) {
		const parenType = isOpen ? TYPES.PARENTHESIS_OPEN : TYPES.PARENTHESIS_CLOSED
		const parenValue = isOpen ? '(' : ')'
		// const [parenType, parenValue] = isOpen ? [TYPES.PARENTHESIS_OPEN, '('] : [TYPES.PARENTHESIS_CLOSED, ')'];
		super(parenType, parenValue, '', false)
	}
}

export class IEquation {
	id: string
	type: string = TYPES.EXPRESSION
	name: string
	pieces: Piece[]
	piecesString: string
	hasNamedPiece: boolean

	/**
	 * 
	 * @param {Piece[]} pieces 
	 * @param {string} name 
	 */
	constructor (pieces: Piece[] = [], name: string = '') {
		this.name = name
		this.pieces = pieces
		this.convertPiecesArrayToString(pieces)
	}

	/**
	 * Convert a Piece[]'s value's into a string.
	 * @param {Piece[]} pieces 
	 */
	convertPiecesArrayToString(pieces: Piece[]) {
		this.piecesString = ''
		pieces.length > 0 && pieces.forEach(piece => {
			if (piece.type === TYPES.CONSTANT || piece.type === TYPES.VARIABLE) {
				if (!this.hasNamedPiece) this.hasNamedPiece = true
				this.piecesString += piece.name
			}
			else this.piecesString += piece.value
			this.piecesString += ' '
		})
	}

	/**
	 * Determines if this IEquation can be solved, and solves it.
	 * @param {string} eqStr the string representation of an equation
	 * @returns {[boolean, string]} Whether this equation is runnable
	 */
	isSolvable(): [boolean, string] {
		console.log('isSolvable')
		const result: [boolean, string] = [false, '']

		let eqStr = ''
		this.pieces.forEach(piece => {
			eqStr += piece.value
		})
		console.log('equation to solve: ', eqStr)

		try {
			result[1] = evaluate(eqStr)
			console.log(`expression: ${eqStr} = ${result[1]}`)
			result[0] = true
			return result
		} catch (error) {
			console.log(`Couldn't run expression: ${eqStr}`)
			console.log('result: ', result)
			return result
		}
	}

	toString() {
		return `
Equation
    name: ${this.name}
    pieces: ${this.piecesString}
    hasNamedPiece: ${this.hasNamedPiece} `
	}
}