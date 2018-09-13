function disambiguation(items, label, property = 'name') {
	const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
	return `Birden çok ${label} bulundu, lütfen biraz daha açıklayıcı olabilir misiniz: ${itemList}`;
}

function paginate(items, page = 1, pageLength = 10) {
	const maxPage = Math.ceil(items.length / pageLength);
	if(page < 1) page = 1;
	if(page > maxPage) page = maxPage;
	const startIndex = (page - 1) * pageLength;
	return {
		items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
		page,
		maxPage,
		pageLength
	};
}

const permissions = {
	ADMINISTRATOR: 'Yönetici',
	VIEW_AUDIT_LOG: 'Denetim günlüğünü görüntüle',
	MANAGE_GUILD: 'Sunucuyu yönet',
	MANAGE_ROLES: 'Rolleri yönet',
	MANAGE_CHANNELS: 'Kanalları yönet',
	KICK_MEMBERS: 'Kullanıcıları at',
	BAN_MEMBERS: 'Kullanıcıları yasakla',
	CREATE_INSTANT_INVITE: 'Anlık davet oluştur',
	CHANGE_NICKNAME: 'Kullanıcı adı değiştir',
	MANAGE_NICKNAMES: 'Kullanıcı adlarını yönet',
	MANAGE_EMOJIS: 'Emojileri yönet',
	MANAGE_WEBHOOKS: 'Webkhookları yönet',
	VIEW_CHANNEL: 'Yazı kanallarını oku ve sesli kanalları gör',
	SEND_MESSAGES: 'Mesaj gönder',
	SEND_TTS_MESSAGES: 'TTS mesajı gönder',
	MANAGE_MESSAGES: 'Mesajları yönet',
	EMBED_LINKS: 'Gömülü bağlantılar',
	ATTACH_FILES: 'Dosyaları ekle',
	READ_MESSAGE_HISTORY: 'Mesaj geçmişini gör',
	MENTION_EVERYONE: 'Herkesi etiketle',
	USE_EXTERNAL_EMOJIS: 'Dış kaynaklardan emoji kullan',
	ADD_REACTIONS: 'Tepki ekle',
	CONNECT: 'Bağlan',
	SPEAK: 'Konuş',
	MUTE_MEMBERS: 'Kullanıcıları sustur',
	DEAFEN_MEMBERS: 'Kullanıcıları sağırlaştır',
	MOVE_MEMBERS: 'Kullanıcıları taşı',
	USE_VAD: 'Ses aktivitesini kullan'
};

module.exports = {
	disambiguation,
	paginate,
	permissions
};
