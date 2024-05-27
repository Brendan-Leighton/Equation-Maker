import { IEquation, Operand, Operator, Parenthesis } from '../components/Equation/interfaces/IEquation';

const TestData = []

function createData() {
	const eq1_values = [new Parenthesis(true), new Operand('1'), new Operator('+'), new Operand('2'), new Parenthesis(false), new Operator('*'), new Parenthesis(true), new Operand('3'), new Operator('-'), new Operand('1'), new Parenthesis(false)];
	const eq2_values = [new Parenthesis(true), new Operand('4'), new Operator('*'), new Operand('3'), new Parenthesis(false), new Operator('/'), new Parenthesis(true), new Operand('2'), new Operator('+'), new Operand('1'), new Parenthesis(false)];
	const eq3_values = [new Parenthesis(true), new Operand('10'), new Operator('/'), new Operand('2'), new Parenthesis(false), new Operator('+'), new Parenthesis(true), new Operand('33'), new Operator('/'), new Operand('10'), new Parenthesis(false)];

	TestData.push(new IEquation(eq1_values, 'eq_1'));
	TestData.push(new IEquation(eq2_values, 'eq_2'));
	TestData.push(new IEquation(eq3_values, 'eq_3'));
}

createData();

export default TestData;