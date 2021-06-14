# Build a release

This action allows you to send some source up to the Balena builders and make your release.

```
on: [push]

jobs:
  build_release:
    runs-on: ubuntu-latest
    name: Build application release
    steps:
      - uses: actions/checkout@v2
      - uses: balena-io-playground/github-actions/actions/build-release@master
        id: build
        with:
          api_token: ${{ secrets.BALENA_API_TOKEN }}
          application: hello-node
      - name: Log release ID built
        run: echo "Built release ID ${{ steps.build.outputs.releaseId }}"
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
