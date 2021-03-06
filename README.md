# tslint-rules-valorsoft

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
    "no-cross-dependencies": [true, "path/to/module"],
    "ng-on-changes-interface": true,
    "no-empty-spec": true,
    "no-input-string-binding": true
  }
}
```

### Rules

The package includes the following rules:

| Rule | Description | Options |
| --- | --- | --- |
| `no-cross-dependencies` | Disallows import of data from these modules to that module directly via `import` or `require`. <br/> Instead only internal may be imported from that module. | [See below](#no-cross-dependencies) |
| `ng-on-changes-interface` | Use appropriate type `SimpleChanges` for `ngOnChanges`. | None |
| `no-empty-spec` | Disallows empty spec blocks. | None |
| `no-input-string-binding` | Do not use Input string binding. | None |



### Options
<a name="no-cross-dependencies"></a>
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
