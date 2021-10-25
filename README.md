# Balena Github Actions

> NOTE: This repository is not actively developed. For a Github Action to deploy your balenaCloud releases see [balena-ci](https://github.com/balena-io/balena-ci).

Collection of github actions which allow you to integrate balena-cli into your project's workflow.

## Available actions

| Action                                    | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| [whoami](/actions/whoami)                 | Will log the username of the authenticate user.               |
| [build-release](/actions/build-release)   | Sends source to balena builders and creates a release.        |
| [deploy-release](/actions/deploy-release) | Marks the given release as final.                             |
| [find-release](/actions/find-release)     | Finds a releaseId from a build-release action on that commit. |
| [attach-release](/actions/attach-release) | Attachs a releaseId to a commits workflow output.             |

