import rewire = require('rewire');
import { spy, stub } from 'sinon';
import * as core from '@actions/core';

import { expect } from './lib/chai';

// Rewire the module so we can access private variables
const action = rewire('../src/action');

describe('action', async () => {
	const setOutputSpy = spy(core, 'setOutput');

	beforeEach(() => {
		setOutputSpy.resetHistory();
	});

	after(() => {
		setOutputSpy.restore();
	});

	it('outputs required variables', async () => {
		// Stub the ChildProcess which gets executed
		const restoreExec = action.__set__(
			'exec',
			stub().resolves({
				stdout: `== ACCOUNT INFORMATION
				USERNAME: user123
				EMAIL:    user@balena.io
				URL:      balena-cloud.com
				`,
				stderr: '',
			}),
		);
		// Run action
		await action.__get__('run')();
		// Check for expected outputs to have been set via core.setOutput
		expect(setOutputSpy.callCount).to.equal(2);
		expect(setOutputSpy.getCall(0).args).to.have.all.members([
			'username',
			'user123',
		]);
		expect(setOutputSpy.getCall(1).args).to.have.all.members([
			'email',
			'user@balena.io',
		]);
		// Clear stb
		restoreExec();
	});
});
