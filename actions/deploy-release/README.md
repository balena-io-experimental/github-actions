# Deploy a release

This action will mark a release as final.

```
on: [push]

jobs:
  deploy_release:
    runs-on: ubuntu-latest
    name: Build application release
    steps:
      - uses: balena-io-playground/github-actions/actions/find-release@master
        id: found
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
      - run: echo "Found release ID ${{ steps.found.outputs.release_id }}"
      - uses: balena-io-playground/github-actions/actions/deploy-release@master
        id: build
        with:
          balena_token: ${{ secrets.BALENA_TOKEN }}
          application: hello-node
          release_id: ${{ steps.found.outputs.release_id }}
```

### Development

Ensure you have [balena-cli](https://github.com/balena-io/balena-cli/) installed on your machine. The CLI will be called if you decide to actually run the action however tests do not invoke the real CLI.

Install the depenedencies:

```
npm ci
```

Tests can be ran with:

```
npm run test
```

To actually run the action on your machine using the installed CLI make a `.env` copy from [env.example](env.example) and replace the values with the correct ones.

Now you can run the action with the following command which will source the .env file.

```
npm run action
```
