const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class DisableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disable',
			aliases: ['disable-command', 'cmd-off', 'command-off', 'devredışı', 'devredışıbırak'],
			group: 'commands',
			memberName: 'disable',
			description: 'Bir komutu veya komut grubunu devre dışı bırakır.',
			details: oneLine`
				Argüman komutun veya komut grubunun adı/ID'si (kısmi yada bütün) olmak zorundadır.
				Sadece botun yapımcıları bu komutu kullanabilir.
			`,
			examples: ['disable [komut]', 'disable [grup]', 'disable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Hangi komutu veya komut grubunu devre dışı bırakmak istiyorsunuz?',
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
		if(!args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
			return msg.reply(
				`\`${args.cmdOrGrp.name}\` adlı ${args.cmdOrGrp.group ? 'komut' : 'komut grubu'} zaten devre dışı bırakılmış.`
			);
		}
		if(args.cmdOrGrp.guarded) {
			return msg.reply(
				`\`${args.cmdOrGrp.name}\` adlı ${args.cmdOrGrp.group ? 'komutu' : 'komut grubunu'} devre dışı bırakamazsınız.`
			);
		}
		args.cmdOrGrp.setEnabledIn(msg.guild, false);
		return msg.reply(oneLine`
		\`${args.cmdOrGrp.name}\` adlı ${args.cmdOrGrp.group ? 'komut' : 'komut grubu'} başarıyla devre dışı bırakıldı.
		`);
	}
};
