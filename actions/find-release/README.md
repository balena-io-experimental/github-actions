# Find a release

This action will locate the release ID from a check run.

```
on: [push]

jobs:
  attach_release:
    runs-on: ubuntu-latest
    name: Build application release and attach the release ID to workflow
    steps:
      - uses: actions/checkout@v2
      - uses: balena-io-playground/github-actions/actions/build-release@master
        name: build release
        id: build
        with:
          balena_token: ${{ secrets.BALENA_TOKEN }}
          application: hello-node
      - uses: balena-io-playground/github-actions/actions/attach-release@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          release_id: ${{ steps.build.outputs.release_id }}
      - uses: balena-io-playground/github-actions/actions/find-release@master
        id: found
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
      - run: echo "Found release ID ${{ steps.found.outputs.release_id }}"
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

### Packaging a release

To avoid checking in the `node_modules` folder into this repository but still having the dependancies available for the action to run, you must install ncc globally so you can compile a final distribution file.

```
npm i -g @vercel/ncc

npm run all
```