import { IEquation, Expression, Operand, Operator } from '../components/Equation/interfaces/IEquation';

const TestData = [
	new IEquation([
		new Expression('exp 0', [
			new Operand('1', 'num 1'),
			new Operator('+'),
			new Operand('2', 'num 2')
		])
	]),
	new IEquation([
		new Expression('exp 1', [
			new Operand('1', 'num 1'),
			new Operator('-'),
			new Operand('2', 'num 2')
		], true),
		new Operator('+'),
		new Expression('exp 2', [
			new Operand('3', 'num 3'),
			new Operator('*'),
			new Operand('3', 'num 4')
		], true)
	])
]

export default TestData;