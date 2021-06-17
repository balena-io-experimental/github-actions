// import rewire = require('rewire');
// import { spy, stub } from 'sinon';
// import * as core from '@actions/core';
// import * as spawk from 'spawk';

// import { expect } from './lib/chai';

// // Rewire the module so we can access private variables
// const action = rewire('../src/action');

// describe('action', async () => {
// 	const setOutputSpy = spy(core, 'setOutput');
// 	const application = 'hello-world';
// 	const workspace = '/dev/null';

// 	before(() => {
// 		process.env['INPUT_APPLICATION'] = application;
// 		process.env['GITHUB_WORKSPACE'] = workspace;
// 		spawk
// 			.spawn(`balena`, [`push`, application, '--source', workspace], {
// 				stdio: 'pipe',
// 			})
// 			.exit(0)
// 			.stdout(sampleBuildLog);
// 	});

// 	beforeEach(() => {
// 		setOutputSpy.resetHistory();
// 	});

// 	after(() => {
// 		setOutputSpy.restore();
// 		spawk.clean();
// 	});

// 	it('uses correct inputs', async () => {
// 		const spawnStub = stub(childProcss, 'spawn');
// 		spawnStub.throws('noop');
// 		// Run action
// 		try {
// 			await action.__get__('run')();
// 		} catch (e) {
// 			// just throw so we can check was params were passed and not the entire action
// 		}
// 		// Check correct inputs were used
// 		expect(spawnStub.args[0][0]).to.equal('balena');
// 		expect(spawnStub.args[0][1]).to.deep.equal([
// 			'push',
// 			'hello-world',
// 			'--source',
// 			'/dev/null',
// 		]);
// 		spawnStub.restore();
// 	});

// 	it('outputs required variables', async () => {
// 		// Run action
// 		await action.__get__('run')();
// 		// Check for expected outputs to have been set via core.setOutput
// 		expect(setOutputSpy.callCount).to.equal(1);
// 		expect(setOutputSpy.getCall(0).args).to.have.all.members([
// 			'releaseId',
// 			'1825486',
// 		]);
// 	});
// });
