import { evaluate } from 'mathjs';

export default function Equate(equation) {

	let eqStr = ''

	equation.expressions.forEach(part => {
		eqStr += part.value
	})

	const result = evaluate(eqStr)
	console.log(`expression: ${eqStr} = ${result}`);

	return result;
}