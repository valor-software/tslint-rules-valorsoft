# tslint-rules-valorsoft

[![Greenkeeper badge](https://badges.greenkeeper.io/valor-software/tslint-rules-valorsoft.svg)](https://greenkeeper.io/)

## Install

Install the package using NPM:

    npm install tslint-rules-valorsoft --save-dev

Update your `tslint.json` file to extend this package:

```json
{
  "rulesDirectory": [
    "tslint-rules-valorsoft"
  ],
  "rules": {
    "no-cross-dependencies": [true, "path/to/module"]
  }
}
```

### Rules

The package includes the following rules:

| Rule | Description | Options |
| --- | --- | --- |
| `no-cross-dependencies` | Disallows import of data from these modules to that module directly via `import` or `require`. <br/> Instead only internal may be imported from that module. | See below |


### Options

#### `no-cross-dependencies`

The `no-cross-dependencies` rule takes an array of paths. This is the path of the module - relative to the root of the project.

For example:

```json
"rules": {
  "no-cross-dependencies": [true, "path/to/module1", "path/to/module2"]
}
```

## Development

```sh
# lint
npm run lint

# build
npm run build

# test
npm run test
```
