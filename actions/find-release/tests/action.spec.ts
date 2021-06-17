import * as path from 'path';
// Set GITHUB_EVENT_PATH right away so @actions modules will initilize correctly
process.env['GITHUB_EVENT_PATH'] = path.resolve('./tests/sample_event.json');
import rewire = require('rewire');
import { spy, stub } from 'sinon';
import * as core from '@actions/core';
import * as github from '@actions/github';

import { expect } from './lib/chai';

// Rewire the module so we can access private variables
const action = rewire('../src/action');

describe('find-release action', async () => {
	const octoStub = stub(github, 'getOctokit');
	const setOutputSpy = spy(core, 'setOutput');
	const targetName = 'build release';
	const githubToken = 'gh123';
	const repoOwner = 'Codertocat';
	const repoName = 'Hello-World';
	const pullRequestSha = 'ec26c3e57ca3a959ca5aad62de7213c562f8c821';

	before(() => {
		process.env['INPUT_TARGET_NAME'] = targetName;
		process.env['INPUT_GITHUB_TOKEN'] = githubToken;
	});

	beforeEach(() => {
		octoStub.resetHistory();
		setOutputSpy.resetHistory();
	});

	after(() => {
		octoStub.restore();
		setOutputSpy.restore();
	});

	it('uses correct inputs', async () => {
		const getTargetCheckStub = stub().resolves({
			name: 'build release',
			output: {
				title: 'Build release',
				summary: 'Succssfully built a new release!',
				text: '1810396',
			},
		});
		const getTargetCheckRestore = action.__set__(
			'getTargetCheck',
			getTargetCheckStub,
		);
		// Run action
		await action.__get__('run')();
		// Check correct inputs were used
		expect(octoStub.args[0][0]).to.equal(githubToken);
		expect(getTargetCheckStub.args[0]).to.have.members([
			repoOwner,
			repoName,
			pullRequestSha,
			'build release',
		]);
		// Restore
		getTargetCheckRestore();
	});

	it('gets target check run', async () => {
		const getCheckRunsRestore = action.__set__(
			'getCheckRuns',
			stub().resolves({
				check_runs: [
					{
						name: 'another workflow',
						output: {
							title: '',
							summary: '',
							text: '',
						},
					},
					{
						name: 'build release',
						output: {
							title: '',
							summary: '',
							text: '',
						},
					},
				],
			}),
		);
		// Check correct run is returned
		await expect(
			action.__get__('getTargetCheck')(
				repoOwner,
				repoName,
				pullRequestSha,
				targetName,
			),
		).to.eventually.deep.equal({
			name: 'build release',
			output: {
				title: '',
				summary: '',
				text: '',
			},
		});
		// Restore
		getCheckRunsRestore();
	});

	it('outputs required variables', async () => {
		const getTargetCheckStub = stub().resolves({
			name: 'build release',
			output: {
				title: 'Build release',
				summary: 'Succssfully built a new release!',
				text: '1810396',
			},
		});
		const getTargetCheckRestore = action.__set__(
			'getTargetCheck',
			getTargetCheckStub,
		);
		// Run action
		await action.__get__('run')();
		// Check correct outputs were set
		expect(setOutputSpy.args[0][0]).to.equal('release_id');
		expect(setOutputSpy.args[0][1]).to.equal('1810396');
		// Restore
		getTargetCheckRestore();
	});
});
