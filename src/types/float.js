const ArgumentType = require('./base');

class FloatArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'float');
	}

	validate(value, msg, arg) {
		const float = Number.parseFloat(value);
		if(Number.isNaN(float)) return false;
		if(arg.oneOf && !arg.oneOf.includes(float)) return false;
		if(arg.min !== null && typeof arg.min !== 'undefined' && float < arg.min) {
			return `Lütfen daha üstte bir değer girin yada tam ${arg.min} değerini girin.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && float > arg.max) {
			return `Lütfen daha altta bir değer girin yada tam ${arg.max} değerini girin.`;
		}
		return true;
	}

	parse(value) {
		return Number.parseFloat(value);
	}
}

module.exports = FloatArgumentType;
