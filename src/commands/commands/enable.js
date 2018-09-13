const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class EnableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'enable',
			aliases: ['enable-command', 'cmd-on', 'command-on', 'etkinleştir'],
			group: 'commands',
			memberName: 'enable',
			description: 'Bir komutu veya komut grubunu etkinleştirir.',
			details: oneLine`
				Argüman komutun veya komut grubunun adı / ID 'si (kısmi yada bütün) olmak zorundadır.
				Sadece botun yapımcıları bu komutu kullanabilir.
			`,
			examples: ['enable [komut]', 'enable [grup]', 'enable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Hangi komutu veya komut grubunu etkinleştirmek istersiniz?',
					type: 'group|command'
				}
			]
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg, args) {
		const group = args.cmdOrGrp.group;
		if(args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
			return msg.reply(
				oneLine`\`${args.cmdOrGrp.name}\` adlı ${args.cmdOrGrp.group ? 'komut' : 'komut grubu'} zaten etkinleştirilmiş${
					group && !group.enabled ? `, fakat \`${group.name}\` adlı grup devre dışı,
					bu yüzden komut hala kullanılamaz` : ''
				}.`
			);
		}
		args.cmdOrGrp.setEnabledIn(msg.guild, true);
		return msg.reply(
			oneLine`\`${args.cmdOrGrp.name}\` adlı ${group ? 'komut' : 'komut grubu'} etkinleştirildi${
				group && !group.enabled ? `, fakat \`${group.name}\` adlı grup devre dışı,
				bu yüzden komut hala kullanılamaz` : ''
			}.`
		);
	}
};
