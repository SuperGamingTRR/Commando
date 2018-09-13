const { stripIndents } = require('common-tags');
const Command = require('../base');

module.exports = class ListGroupsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'groups',
			aliases: ['list-groups', 'show-groups', 'gruplar'],
			group: 'commands',
			memberName: 'groups',
			description: 'Bütün komut gruplarını listeler.',
			details: 'Sadece botun yapımcıları bu komutu kullanabilir.',
			guarded: true
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg) {
		return msg.reply(stripIndents`
			__**Tüm Kayıtlı Komut Grupları**__
			${this.client.registry.groups.map(grp =>
				`**${grp.name}:** ${grp.isEnabledIn(msg.guild) ? 'Etkin' : 'Devre Dışı'}`
			).join('\n')}
		`);
	}
};
