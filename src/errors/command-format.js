const FriendlyError = require('./friendly');

/**
 * Has a descriptive message for a command not having proper format
 * @extends {FriendlyError}
 */
class CommandFormatError extends FriendlyError {
	/**
	 * @param {CommandMessage} msg - The command message the error is for
	 */
	constructor(msg) {
		super(
			`Geçersiz komut kullanımı. \`${msg.command.name}\` adlı komutun kabul ettiği format: ${msg.usage(
				msg.command.format,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)}. ${msg.anyUsage(
				`yardım ${msg.command.name}`,
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)} kullanarak detaylı bilgi alabilirsiniz.`
		);
		this.name = 'CommandFormatError';
	}
}

module.exports = CommandFormatError;
