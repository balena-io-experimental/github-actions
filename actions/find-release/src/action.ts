import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/core';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';

let octokit: Octokit & Api & { paginate: PaginateInterface };

type CheckRun = {
	name: string;
	output: {
		title: string;
		summary: string;
		text: string;
	};
};

export async function run(): Promise<void> {
	// Check that context contains required data
	if (!github.context.payload.pull_request) {
		throw new Error('Context is missing pull_request data.');
	} else if (!github.context.payload.repository) {
		throw new Error('Context is missing repository data.');
	}
	// Get configured client for making requests to GH
	const token = core.getInput('github_token', { required: true });
	octokit = github.getOctokit(token);
	// Find target check
	const target = await getTargetCheck(
		github.context.payload.repository.owner.login,
		github.context.payload.repository.name,
		github.context.payload.pull_request.head.sha,
		core.getInput('target_name', { required: true }),
	);
	// Check if the output has a text value
	if (!target.output.text && target.output.text.length < 1) {
		throw new Error('Failed to find release text from target output.');
	}
	// Set the output text as this is suppose to be the release_id
	core.setOutput('release_id', target.output.text);
}

async function getTargetCheck(
	owner: string,
	repo: string,
	sha: string,
	target: string,
): Promise<CheckRun> {
	// Get the checks for this commit
	const checks = await getCheckRuns(owner, repo, sha);
	// Find run where name matches target
	const check = checks.check_runs.filter((c: CheckRun) => c.name === target)[0];
	if (!check) {
		throw new Error(
			`Unable to find target ${target} in checks ran on commit ${sha}.`,
		);
	}
	return check;
}

async function getCheckRuns(
	owner: string,
	repo: string,
	sha: string,
): Promise<any> {
	return (
		await octokit.request(
			'GET /repos/{owner}/{repo}/commits/{ref}/check-runs',
			{
				owner,
				repo,
				ref: sha,
			},
		)
	).data;
}
