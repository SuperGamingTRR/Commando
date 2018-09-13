const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'util',
			memberName: 'prefix',
			aliases: ['önek'],
			description: 'Komut önekini gösterir veya değiştirir.',
			format: '[önek/"normal"/"hiçbiri"]',
			details: oneLine`
				Eğer bir önek belirtilmezse geçerli önek gösterilecektir.
				Eğer önek "normal" olarak belirtilirse önek botun belirtilen normal önekine döndürülecektir.
				Eğer önek "hiçbiri" olarak belirtilirse önek tamamen kaldırılır,
				sadece botu etiketleyerek komut kullanabilirsiniz.
				Sadece sunucu yöneticileri bu komutu kullanabilir.
			`,
			examples: ['prefix', 'prefix -', 'prefix örnek!', 'prefix normal', 'prefix hiçbiri'],

			args: [
				{
					key: 'prefix',
					prompt: 'Botun önekinin ne olmasını istersiniz?',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		// Just output the prefix
		if(!args.prefix) {
			const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
			return msg.reply(stripIndents`
				${prefix ? `Şu an geçerli komut öneki \`${prefix}\`.` : 'Önek kullanılmıyor (etiketleme sistemi aktif).'}
				Komut kullanmak için, ${msg.anyUsage('[komut]')} kullanın.
			`);
		}

		// Check the user's permission before changing anything
		if(msg.guild) {
			if(!msg.member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
				return msg.reply('Sadece sunucu yöneticileri öneki değiştirebilir.');
			}
		} else if(!this.client.isOwner(msg.author)) {
			return msg.reply('Sadece botun yapımcıları global öneki değiştirebilir.');
		}

		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'hiçbiri' ? '' : args.prefix;
		let response;
		if(lowercase === 'normal') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'önek kullanılmıyor';
			response = `Komut öneki normal öneke döndürüldü (şu anda ${current}).`;
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
			response = prefix ? `Komut öneki ayarlandı: \`${args.prefix}\`` : 'Önek sistemi artık devre dışı.';
		}

		await msg.reply(`${response} Komut kullanmak için, ${msg.anyUsage('[komut]')} kullanın.`);
		return null;
	}
};
