const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class ReloadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			aliases: ['reload-command', 'yenidenyükle', 'tekraryükle'],
			group: 'commands',
			memberName: 'reload',
			description: 'Bir komutu veya komut grubunu yeniden yükler.',
			details: oneLine`
				Argüman komutun adı/ID'si (kısmi yada bütün) olmak zorundadır.
				Bir komut grubu belirtmek o gruptaki tüm komutları yeniden yükler.
				Sadece botun yapımcıları bu komutu kullanabilir.
			`,
			examples: ['reload [komut adı]', 'reload [grup adı]', 'reload prefix', 'reload Utility'],
			ownerOnly: true,
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Hangi komutu veya komut grubunu yeniden yüklemek istersiniz?',
					type: 'group|command'
				}
			]
		});
	}

	async run(msg, args) {
		const { cmdOrGrp } = args;
		const isCmd = Boolean(cmdOrGrp.groupID);
		cmdOrGrp.reload();

		if(this.client.shard) {
			try {
				await this.client.shard.broadcastEval(`
					if(this.shard.id !== ${this.client.shard.id}) {
						this.registry.${isCmd ? 'commands' : 'groups'}.get('${isCmd ? cmdOrGrp.name : cmdOrGrp.id}').reload();
					}
				`);
			} catch(err) {
				this.client.emit('warn', `Komut yeniden yükleme isteği diğer shardlara yayınlanırken bir hata oluştu.`);
				this.client.emit('error', err);
				if(isCmd) {
					await msg.reply(oneLine`\`${cmdOrGrp.name}\` komutu yeniden yüklendi,
					fakat diğer shardlarda yeniden yüklenirken bir hata oluştu.`);
				} else {
					await msg.reply(
						oneLine`\`${cmdOrGrp.name}\` grubundaki tüm komutlar yeniden yüklendi,
						fakat diğer shardlarda yeniden yüklenirken bir hatayla karşılaşıldı..`
					);
				}
				return null;
			}
		}

		if(isCmd) {
			await msg.reply(oneLine`\`${cmdOrGrp.name}\` adlı komut${this.client.shard ? ' tüm shardlarda' : ''}
			başarıyla yeniden yüklendi.`);
		} else {
			await msg.reply(
				oneLine`\`${cmdOrGrp.name}\` grubundaki tüm komutlar${this.client.shard ? ' tüm shardlarda' : ''}
				başarıyla yeniden yüklendi.`
			);
		}
		return null;
	}
};
