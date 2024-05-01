export const isNumber = (value) => {
	console.log('isNumber? ', !isNaN(value));
	return !isNaN(value);
}

export const isOperator = (str) => {
	return (str === '+' || str === '-' || str === '*' || str === '/');
}

export const isParenthesis = (str) => {
	return str === '(' || str === ')';
}