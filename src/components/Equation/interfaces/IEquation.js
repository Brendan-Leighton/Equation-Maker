import { isInteger } from "mathjs";

export const TYPES = {
	OPERATOR: 'OPERATOR',
	OPERAND: 'OPERAND',
	VARIABLE: 'VARIABLE',
	EXPRESSION: 'EXPRESSION',
	PARENTHESIS: {
		OPEN: 'OPEN',
		CLOSED: 'CLOSED'
	}
}

export function validateNewValue(partType, newValue) {
	switch (partType) {
		case TYPES.OPERATOR:
			return validateOperator(newValue);
		case TYPES.OPERAND:
			return validateOperand(newValue);
		default:
			break;
	}
}

function validateOperator(value) {
	return (value === '+' || value === '-' || value === '*' || value === '/');
}

function validateOperand(value) {
	const isValid = (typeof (value) === 'number' || typeof (value) === "string" && value.trim() !== '') && !isNaN(value)
	console.log('isValid: ',);
	console.log(`validateOperand(${value})`);
	return isValid;
}

export class Operator {
	type = TYPES.OPERATOR;
	value; // + - * /
	name = '';

	constructor(value = '+') {
		const isValidValue = this.validate(value);
		if (isValidValue) {
			this.value = value;
		}
		return isValidValue;
	}

	validate(value) {
		return validateOperator(value);
	}
}

export class Operand {
	type = TYPES.OPERAND;
	value; // number
	name; // string

	constructor(value, name = '') {
		const isValidValue = this.validate(value)
		if (isValidValue) {
			this.value = value;
			this.name = name;
		}

		return isValidValue;
	}

	validate(value) {
		return validateOperand(value);
	}

	updateValue(value) {
		const isValid = this.validate(value)
		isValid && (this.value = value);
		return isValid;
	}
}

export class Expression {
	type = TYPES.EXPRESSION;
	name; // string
	parts; // Operand/Operator[]
	hasParenthesis;

	constructor(name, parts, hasParenthesis = false) {
		this.name = name;
		this.parts = parts;
		this.hasParenthesis = hasParenthesis;
	}
}

export class IEquation {
	name = ''; // string
	expressions = []; // Expression[]

	constructor(expressions) {
		this.expressions = expressions;
	}

	addPart(part) {
		this.parts.push(part)
	}
}

export class IEquationPiece {
	type;
	value;
	isEditable;

	constructor(type, value, isEditable = true) {
		this.type = type;
		this.value = value;
		this.isEditable = isEditable;
	}
}