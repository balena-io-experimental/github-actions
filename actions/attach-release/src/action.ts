import * as core from '@actions/core';
import * as github from '@actions/github';
import { WebhookPayload } from '@actions/github/lib/interfaces';
import { Octokit } from '@octokit/core';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';

let octokit: Octokit & Api & { paginate: PaginateInterface };

export async function run(): Promise<void> {
	const releaseId = core.getInput('release_id', { required: true });
	const token = core.getInput('github_token', { required: true });
	octokit = github.getOctokit(token);
	// Parse info from the github context
	const sha = getSha(github.context.payload);
	const owner = getOwner(github.context.payload);
	const repo = getRepo(github.context.payload);
	// Get the checks for this commit
	const checks = await getCheckRuns(owner, repo, sha);
	// Find build check
	const target = checks.check_runs.filter(
		(c) => c.name === core.getInput('target_name', { required: true }),
	)[0];
	// Add the releaseId to the build check
	await updateRun(target.id, owner, repo, releaseId);
}

async function updateRun(
	runId: number,
	owner: string,
	repo: string,
	releaseId: string,
) {
	await octokit.request(
		'PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}',
		{
			owner,
			repo,
			check_run_id: runId,
			output: {
				title: 'Build release',
				summary: 'Succssfully built a new release!',
				text: releaseId,
			},
		},
	);
}

async function getCheckRuns(owner: string, repo: string, sha: string) {
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

function getSha(payload: WebhookPayload): string {
	if (!payload.pull_request) {
		throw new Error(`Unable to parse sha from webhook payload: ${context}`);
	}
	const url = payload.pull_request._links.statuses.href.split('/');
	return url[url.length - 1];
}

function getOwner(payload: WebhookPayload): string {
	if (!payload.pull_request) {
		throw new Error(`Unable to parse owner from webhook payload: ${context}`);
	}
	const url = payload.pull_request.base.repo.url;
	return new URL(url).pathname.split('/')[2];
}

function getRepo(payload: WebhookPayload): string {
	if (!payload.pull_request) {
		throw new Error(`Unable to parse repo from webhook payload: ${context}`);
	}
	const url = payload.pull_request.base.repo.url;
	return new URL(url).pathname.split('/')[3];
}
