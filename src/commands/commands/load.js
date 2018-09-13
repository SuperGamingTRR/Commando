const fs = require('fs');
const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class LoadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'load',
			aliases: ['load-command', 'yükle', 'komutyükle'],
			group: 'commands',
			memberName: 'load',
			description: 'Yeni komut yükler.',
			details: oneLine`
				Argüman komutun tam adıyla birlikte \`[komut]:[grup adı]\` biçiminde olmalıdır.
				Sadece botun yapımcıları bu komutu kullanabilir..
			`,
			examples: ['load prefix:util'],
			ownerOnly: true,
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Hangi komutu yüklemek istersiniz?',
					validate: val => new Promise(resolve => {
						if(!val) return resolve(false);
						const split = val.split(':');
						if(split.length !== 2) return resolve(false);
						if(this.client.registry.findCommands(val).length > 0) {
							return resolve('Bu komut zaten veritabanına kaydedilmiş.');
						}
						const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
						fs.access(cmdPath, fs.constants.R_OK, err => err ? resolve(false) : resolve(true));
						return null;
					}),
					parse: val => {
						const split = val.split(':');
						const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
						delete require.cache[cmdPath];
						return require(cmdPath);
					}
				}
			]
		});
	}

	async run(msg, args) {
		this.client.registry.registerCommand(args.command);
		const command = this.client.registry.commands.last();

		if(this.client.shard) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) {
						const cmdPath = this.registry.resolveCommandPath('${command.groupID}', '${command.name}');
						delete require.cache[cmdPath];
						this.registry.registerCommand(require(cmdPath));
					}
				`);
			} catch(err) {
				this.client.emit('warn', `Komut yüklü diğer shardlara yayınlanırken bir hata oluştu.`);
				this.client.emit('error', err);
				await msg.reply(`\`${command.name}\` adlı komut yüklendi, fakat diğer shardlarda yüklenirken bir hata oluştu.`);
				return null;
			}
		}

		await msg.reply(`\`${command.name}\` komutu${this.client.shard ? ' tüm shardlarda' : ''} başarıyla yüklendi.`);
		return null;
	}
};
