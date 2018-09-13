const ArgumentType = require('./base');
const { disambiguation } = require('../util');
const { escapeMarkdown } = require('discord.js');

class CommandArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'command');
	}

	validate(value) {
		const commands = this.client.registry.findCommands(value);
		if(commands.length === 1) return true;
		if(commands.length === 0) return false;
		return commands.length <= 15 ?
			`${disambiguation(commands.map(cmd => escapeMarkdown(cmd.name)), 'commands', null)}\n` :
			'Birden çok komut bulundu. Lütfen biraz daha açıklayıcı olabilir misiniz?';
	}

	parse(value) {
		return this.client.registry.findCommands(value)[0];
	}
}

module.exports = CommandArgumentType;
