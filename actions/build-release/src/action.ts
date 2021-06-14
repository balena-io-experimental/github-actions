import * as core from '@actions/core';
import { spawn } from 'child_process';

export async function run(): Promise<void> {
	const application = core.getInput('application');
	const src = process.env.GITHUB_WORKSPACE;
	if (!src) {
		throw new Error('GITHUB_WORKSPACE must be set to find build source.');
	}
	// Log command being ran
	core.debug(`exec balena push ${application} --source ${src}`);
	// Execute command
	return new Promise((resolve, reject) => {
		let releaseId: string;
		const buildProcess = spawn(
			'balena',
			[`push`, application, '--source', src],
			{
				stdio: 'pipe',
			},
		);
		buildProcess.stdout.setEncoding('utf8');
		buildProcess.stdout.on('data', (data) => {
			const msg = data.toString();
			// TO-DO: make a regex to get release Id rather then this string processing..
			if (msg.includes('Release:')) {
				// There are a bunch of escape codes for displaying color in terminals so find Id this way
				const idIndex = msg.indexOf('id: ');
				releaseId = msg.substr(idIndex).match(/\d{7}/)[0];
			}
			console.log(data); // Output to stdout of this action
		});

		buildProcess.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});

		buildProcess.on('close', () => {
			buildProcess.kill('SIGTERM');
		});

		buildProcess.on('exit', () => {
			if (releaseId) {
				// Output build releaseId
				core.setOutput('releaseId', releaseId);
				resolve();
			} else {
				reject('Was unable to find release ID from the build process.');
			}
		});
	});
}
