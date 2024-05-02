/**
 * Custome Types for Equations and it's parts.
 */

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
	console.log(`validateOperand(${value})`);
	const isValid = (typeof (value) === 'number' || typeof (value) === "string" && value.trim() !== '') && !isNaN(value)
	console.log(value + ' isValid: ', isValid);
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

	/**
	 * Determines if this IEquation can be evaluated. Based on whether the Operands and Operators alternate appropriatly 
	 * @returns {boolean} Whether this equation is runnable
	 */
	isRunnable() {
		console.log('IEquation.isRunnable');

		let prevType;

		// loop EXPRESSIONS[]
		for (let expressionIndex = 0; expressionIndex < this.expressions.length; expressionIndex++) {

			const item = this.expressions[expressionIndex];

			// if EXPRESSION{} else OPERATOR{}
			if (item.type === TYPES.EXPRESSION) {
				// loop PARTS[] of an EXPRESSION{}
				for (let partIndex = 0; partIndex < item.parts.length; partIndex++) {
					const part = item.parts[partIndex];

					// compare vs prevValue
					if (part.type === prevType) return false;
					prevType = part.type;
				}
			}
			// else OPERATOR{}
			else {
				// compare vs prevValue
				if (prevType === TYPES.OPERATOR) return false;
				prevType = TYPES.OPERATOR;
			}
		}

		return true;
	}
}