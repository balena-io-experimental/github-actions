# whoami

This action will output the results of the whoami command.

```
on: [push]

jobs:
  whoami:
    runs-on: ubuntu-latest
    name: Log who I am
    steps:
      - uses: balena-io-playground/github-actions/actions/whoami@master
        id: whoami
        with:
          balena_token: ${{ secrets.BALENA_TOKEN }}
      - name: Log output from CLI
        run: echo "You are authneitcated as ${{ steps.whoami.outputs.username }}"
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

To actually run the action on your machine ensure your local CLI is authenticated. This step is performed in the [entrypoint.sh](entrypoint.sh) when the action is executed but you will just be running the JS code.

Then run:

```
npm run action
```
