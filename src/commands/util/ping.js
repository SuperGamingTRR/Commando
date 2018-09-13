const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Botun Discord sunucularına karşı pingini kontrol eder.',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(msg) {
		if(!msg.editable) {
			const pingMsg = await msg.reply('Ping ölçülüyor...');
			return pingMsg.edit(oneLine`
				${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
				Pong! Mesajın geliş-gidiş pingi ${pingMsg.createdTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `Botun ana pingi ise ${Math.round(this.client.ping)}ms.` : ''}
			`);
		} else {
			await msg.edit('Ping ölçülüyor...');
			return msg.edit(oneLine`
				Pong! Mesajın geliş-gidiş pingi ${msg.editedTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `Botun ana pingi ise ${Math.round(this.client.ping)}ms.` : ''}
			`);
		}
	}
};
