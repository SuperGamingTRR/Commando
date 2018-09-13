const ArgumentType = require('./base');

class StringArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'string');
	}

	validate(value, msg, arg) {
		if(arg.oneOf && !arg.oneOf.includes(value.toLowerCase())) return false;
		if(arg.min !== null && typeof arg.min !== 'undefined' && value.length < arg.min) {
			return `Lütfen istenen \`${arg.label}\` değerini yukarıda veya tam olarak ${arg.min} karakterde tutun.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && value.length > arg.max) {
			return `Lütfen istenen \`${arg.label}\` değerini altında veya tam olarak ${arg.max} karakterde tutun.`;
		}
		return true;
	}

	parse(value) {
		return value;
	}
}

module.exports = StringArgumentType;
