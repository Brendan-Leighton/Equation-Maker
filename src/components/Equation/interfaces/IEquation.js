
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
    // console.log(`validateOperand(${value})`);
    const isValid = (typeof (value) === 'number' || typeof (value) === "string" && value.trim() !== '') && !isNaN(value)
    // console.log(value + ' isValid: ', isValid);
    return isValid;
}

function validateVariable(value) {
    return validateOperand(value);
}

function generateId(part1, part2, part3) {
    return `${part1}_${part2}_${part3}_${Date.now()}`
}

export class Piece {
    id;
    type;
    name;
    value;
    isEditable;
    isEditMode = false;

    constructor(type, value = '', name = '', isEditable = true) {
        this.id = generateId(type, name, value);
        this.type = type;
        this.name = name;
        this.setValue(value);
        this.isEditable = isEditable;
    }

    setValue(newValue) {
        // BASE CASE - we don't set the following values so return immediately.
        // if (this.type === TYPES.PARENTHESIS_CLOSED || this.type === TYPES.PARENTHESIS_OPEN) return false;

        // set value if valid value/type combo
        if (this.isValidValue(newValue)) {
            this.value = newValue;
            return true
        }
        // return false if invalid value/type combo
        else return false;
    }

    isValidValue(value) {
        if (value === '') return true

        switch (this.type) {
            case TYPES.OPERATOR:
                return validateOperator(value);
            case TYPES.OPERAND:
                return validateOperand(value);
            case TYPES.CONSTANT:
            case TYPES.VARIABLE:
                return validateVariable(value);
            case TYPES.PARENTHESIS_OPEN:
                return (value === '(')
            case TYPES.PARENTHESIS_CLOSED:
                return (value === ')')
            default:
                return false;
        }
    }
}

export class Operator extends Piece {
    constructor(value = '+') {
        super(TYPES.OPERATOR, value)
    }
}

export class Operand extends Piece {
    constructor(value, name = '') {
        if (validateOperand(value)) {
            super(TYPES.OPERAND, value, name)
        }
    }
}

export class Constant extends Piece {
    constructor(value = 0, name = 'constant') {
        if (validateOperand(value)) {
            super(TYPES.CONSTANT, value, name)
        }
    }
}

export class Variable extends Piece {
    constructor(value = 0, name = 'variable') {
        if (!validateOperand(value)) value = 0
        super(TYPES.VARIABLE, value, name)

    }

    updateValue(value) {
        const isValid = this.validate(value)
        isValid && (this.value = value);
        return isValid;
    }
}

export class Parenthesis extends Piece {
    constructor(isOpen) {
        const parenType = isOpen ? TYPES.PARENTHESIS_OPEN : TYPES.PARENTHESIS_CLOSED;
        const parenValue = isOpen ? '(' : ')';
        // const [parenType, parenValue] = isOpen ? [TYPES.PARENTHESIS_OPEN, '('] : [TYPES.PARENTHESIS_CLOSED, ')'];
        super(parenType, parenValue, '', false)
    }
}

export class IEquation {
    type = TYPES.EXPRESSION;
    name; // string
    pieces; // Piece[]
    piecesString;
    hasNamedPiece = false;

    /**
     * 
     * @param {Piece[]} pieces 
     * @param {string} name 
     */
    constructor(pieces = [], name = '') {
        this.name = name;
        this.pieces = pieces;
        this.convertPiecesArrayToString(pieces);
    }

    /**
     * Convert a Piece[]'s value's into a string.
     * @param {Piece[]} pieces 
     */
    convertPiecesArrayToString(pieces) {
        this.piecesString = '';
        pieces.length > 0 && pieces.forEach(piece => {
            if (piece.type === TYPES.CONSTANT || piece.type === TYPES.VARIABLE) {
                if (!this.hasNamedPiece) this.hasNamedPiece = true;
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
    isSolvable() {
        console.log('isSolvable');
        let result = [false, ''];

        let eqStr = ''
        this.pieces.forEach(piece => {
            eqStr += piece.value;
        })
        console.log('equation to solve: ', eqStr);

        try {
            result[1] = evaluate(eqStr)
            console.log(`expression: ${eqStr} = ${result[1]}`);
            result[0] = true;
            return result;
        } catch (error) {
            console.log(`Couldn't run expression: ${eqStr}`);
            console.log('result: ', result);
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