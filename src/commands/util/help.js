const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { disambiguation } = require('../../util');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['yardım', 'komutlar'],
			description: 'Tüm komutları listeler veya bir komut hakkında detaylı bilgi verir.',
			details: oneLine`
				Belirtilen komut bir komutun tam adı veya bir komutun adının bir kısmı olabilir.
				Eğer komut belirtilmezse tüm komutlar listelenecektir.
			`,
			examples: ['yardım', 'yardım prefix'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Hangi komut hakkında bilgi almak istersiniz?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'tümü';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__**${commands[0].name}** komutu:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Sadece sunucularda kullanılabilir)' : ''}
						${commands[0].nsfw ? ' (NSFW komutu)' : ''}
					`}

					**Format:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Diğer kullanımlar:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Grup:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Detaylar:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Örnek:**\n${commands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') messages.push(await msg.reply('Sana DM ile birlikte tüm bilgileri gönderdim.'));
				} catch(err) {
					messages.push(await msg.reply(oneLine`Sana DM gönderemiyorum.
					Muhtemelen başkalarından gelen DM'leri devre dışı bırakmışsındır.
					Ayarlarını kontrol etmeni tavsiye ederim.`));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Birden çok komut buldum. Lütfen biraz daha açıklayabilir misiniz?');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'komutlar'));
			} else {
				return msg.reply(
					`Komut tanımlanamıyor. \`${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)}\` kullanarak tüm komutlar hakkında yardım alabilirsin.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						${msg.guild ? `${msg.guild.name} adlı sunucuda` : 'Herhangi bir sunucuda'} komut kullanmak için,
						${Command.usage('[komut]', msg.guild ? msg.guild.commandPrefix : null, this.client.user)} kullanın.
						Örneğin, ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					Bu DM'de komut kullanmak için, sadece ${Command.usage('[komut]', null, null)}
					şeklinde önek kullanmadan yapabilirsiniz.

					${this.usage('[komut]', null, null)} şeklinde kullanarak bir komut hakkında detaylı bilgi alabilirsiniz.
					${this.usage('tümü', null, null)} şeklinde kullanırsanız *tüm* komutlar hakkında yardım alabilirsiniz, 
					sadece kullanılabilir olanlar değil.

					__**${showAll ? 'Tüm komutlar' : `${msg.guild || 'Bu DM'}
					kanalında/sunucusunda kullanılabilir olan komutlar`}**__

					${(showAll ? groups : groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${(showAll ? grp.commands : grp.commands.filter(cmd => cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW komutu)' : ''}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') {
					messages.push(await msg.reply('Sana bilgilendirme ile birlikte bir DM gönderdim, DM\'lerini kontrol et.'));
				}
			} catch(err) {
				messages.push(await msg.reply(oneLine`Sana yardım DM'ini gönderemiyorum.
				Muhtemelen başkalarından gelen DM'leri devre dışı bırakmışsındır.
				Ayarlarını kontrol etmeni tavsiye ederim.`));
			}
			return messages;
		}
	}
};
