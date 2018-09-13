const ArgumentType = require('./base');

class IntegerArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'integer');
	}

	validate(value, msg, arg) {
		const int = Number.parseInt(value);
		if(Number.isNaN(int)) return false;
		if(arg.oneOf && !arg.oneOf.includes(int)) return false;
		if(arg.min !== null && typeof arg.min !== 'undefined' && int < arg.min) {
			return `Lütfen daha üstte bir değer girin yada tam ${arg.min} değerini girin.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && int > arg.max) {
			return `Lütfen daha altta bir değer girin yada tam ${arg.max} değerini girin.`;
		}
		return true;
	}

	parse(value) {
		return Number.parseInt(value);
	}
}

module.exports = IntegerArgumentType;
