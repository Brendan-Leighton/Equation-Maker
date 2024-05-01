import { TYPES, IEquation, IEquationPiece, Expression, Operand, Operator } from '../components/Equation/interfaces/IEquation';

const TestData = [
	new IEquation([
		new Expression('exp 0', [
			new Operand('1', 'num 1'),
			new Operator('+'),
			new Operand('1', 'num 2')
		])
	]),
	new IEquation([
		new Expression('exp 1', [
			new Operand('1', 'num 1'),
			new Operator('+'),
			new Operand('1', 'num 2')
		]),
		new Operator('+'),
		new Expression('exp 2', [
			new Operand('1', 'num 3'),
			new Operator('+'),
			new Operand('1', 'num 4')
		])
	])
]

export default TestData;