const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class UnloadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unload',
			aliases: ['unload-command', 'devredençıkart'],
			group: 'commands',
			memberName: 'unload',
			description: 'Bir komutu devreden çıkarır.',
			details: oneLine`
				Argüman komutun adı/ID'si (kısmi yada bütün) olmak zorundadır.
				Sadece botun yapımcıları bu komutu kullanabilir.
			`,
			examples: ['unload [komut adı]', 'unload prefix'],
			ownerOnly: true,
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Hangi komutu devreden çıkarmak istiyorsunuz?',
					type: 'command'
				}
			]
		});
	}

	async run(msg, args) {
		args.command.unload();

		if(this.client.shard) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) this.registry.commands.get('${args.command.name}').unload();
				`);
			} catch(err) {
				this.client.emit('warn', `Komutu devreden çıkarma isteği tüm shardlara gönderilirken bir hatayla sonuçlandı.`);
				this.client.emit('error', err);
				await msg.reply(oneLine`\`${args.command.name}\` komutu devreden çıkarıldı,
				fakat diğer shardlarda devreden çıkarma işlemi hatayla sonuçlandı.`);
				return null;
			}
		}

		await msg.reply(oneLine`\`${args.command.name}\` komutu${this.client.shard ? ' tüm shardlarda' : ''}
		başarıyla devreden çıkarıldı.`);
		return null;
	}
};
