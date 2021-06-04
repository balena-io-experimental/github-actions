import * as core from '@actions/core';
import { exec as execAsync } from 'child_process';
import { promisify } from 'util';

function exec(execString: string) {
	return promisify(execAsync)(execString);
}

interface WhoAmI {
	username: string;
	email: string;
	url: string;
}

export async function run(): Promise<void> {
	// Log command being ran
	core.debug(`exec balena whoami`);
	// Execute command
	const response = await exec('balena whoami');
	if (response.stderr.length > 0) {
		throw new Error(
			`CLI command: balena whoami returned data on stderr:\n ${response.stderr}`,
		);
	}
	// Parse exec stdout lines
	const lines = response.stdout.replace(/\t/g, '').split('\n');
	const authenticatedUser = lines
		.slice(1)
		.reduce((parsed: WhoAmI, line: string) => {
			const [KEY, VALUE] = line.split(':');
			if (KEY.length === 0) {
				return parsed;
			}
			switch (KEY.trim().toLowerCase()) {
				case 'username':
					parsed['username'] = VALUE.trim().toLowerCase();
					break;
				case 'email':
					parsed['email'] = VALUE.trim().toLowerCase();
					break;
				case 'url':
					parsed['url'] = VALUE.trim().toLowerCase();
					break;
				default:
					throw new Error(
						`Unknown key: ${KEY} found when parsing: ${response}`,
					);
			}
			return parsed;
		}, {} as WhoAmI);

	core.setOutput('username', authenticatedUser.username);
	core.setOutput('email', authenticatedUser.email);
}
