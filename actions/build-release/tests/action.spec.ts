import rewire = require('rewire');
import { spy, stub } from 'sinon';
import * as core from '@actions/core';
import * as spawk from 'spawk';
import * as childProcss from 'child_process';

import { expect } from './lib/chai';

const sampleBuildLog = `
[32m[Success][39m  Successfully uploaded images
[2K
[36m[Info][39m     Built on arm06
[2K
[32m[Success][39m  Release successfully created!
[2K
[36m[Info][39m     Release: [34m97a2dff8f9b40fb14570fb3938c06afb[39m (id: [32m1825486[39m)
[2K
[36m[Info][39m     [90m┌─────────[39m[90m┬────────────[39m[90m┬────────────┐[39m
[2K
[36m[Info][39m     [90m│[39m [1mService[22m [90m│[39m [1mImage Size[22m [90m│[39m [1mBuild Time[22m [90m│[39m
[2K
[36m[Info][39m     [90m├─────────[39m[90m┼────────────[39m[90m┼────────────┤[39m
[2K
[36m[Info][39m     [90m│[39m main    [90m│[39m 209.29 MB  [90m│[39m 37 seconds [90m│[39m
[2K
[36m[Info][39m     [90m└─────────[39m[90m┴────────────[39m[90m┴────────────┘[39m
`;

// Rewire the module so we can access private variables
const action = rewire('../src/action');

describe('build-release action', async () => {
	const setOutputSpy = spy(core, 'setOutput');
	const application = 'hello-world';
	const workspace = '/dev/null';

	before(() => {
		process.env['INPUT_APPLICATION'] = application;
		process.env['GITHUB_WORKSPACE'] = workspace;
		spawk
			.spawn(`balena`, [`push`, application, '--source', workspace], {
				stdio: 'pipe',
			})
			.exit(0)
			.stdout(sampleBuildLog);
	});

	beforeEach(() => {
		setOutputSpy.resetHistory();
	});

	after(() => {
		setOutputSpy.restore();
		spawk.clean();
	});

	it('uses correct inputs', async () => {
		const spawnStub = stub(childProcss, 'spawn');
		spawnStub.throws('noop');
		// Run action
		try {
			await action.__get__('run')();
		} catch (e) {
			// just throw so we can check was params were passed and not the entire action
		}
		// Check correct inputs were used
		expect(spawnStub.args[0][0]).to.equal('balena');
		expect(spawnStub.args[0][1]).to.deep.equal([
			'push',
			'hello-world',
			'--source',
			'/dev/null',
		]);
		spawnStub.restore();
	});

	it('outputs required variables', async () => {
		// Run action
		await action.__get__('run')();
		// Check for expected outputs to have been set via core.setOutput
		expect(setOutputSpy.callCount).to.equal(1);
		expect(setOutputSpy.getCall(0).args).to.have.all.members([
			'release_id',
			'1825486',
		]);
	});
});
