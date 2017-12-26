import * as Lint from 'tslint';
import { findImports, ImportKind } from 'tsutils';
import * as ts from 'typescript';
import { resolve } from 'path';

export class Rule extends Lint.Rules.AbstractRule {
  /* tslint:disable:object-literal-sort-keys */
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-cross-dependencies',
    description: Lint.Utils.dedent`
            Disallows import of data from these modules to that module directly via \`import\` or \`require\`.
            Instead only internal may be imported from that module.`,
    rationale: Lint.Utils.dedent`
            Prepare to modularization.
            This is good practice as it avoids cross dependencies.`,
    optionsDescription: 'A list of unresolved cross dependencies between modules.',
    options: {
      type: 'array',
      items: {
        type: 'string',
      },
      minLength: 1
    },
    optionExamples: [true, [true, 'src/app/modules/module', 'src/app/modules/module2']],
    type: 'functionality',
    typescriptOnly: false
  };

  public static FAILURE_STRING = 'This import create cross dependencies, import an internal instead';

  public isEnabled(): boolean {
    return super.isEnabled() && this.ruleArguments.length > 0;
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk, this.ruleArguments);
  }
}

function walk(ctx: Lint.WalkContext<string[]>) {
  const modules: string[] = ctx.options.map(module => resolve(module));
  const currentFile: string = ctx.sourceFile.fileName;

  const currentModule = modules.find((moduleDir: string) => currentFile.includes(moduleDir));

  if (typeof currentModule === 'undefined') {
    return;
  }

  for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
    const importFileName: string = name.text;

    if (isImportFromNPMPackage(importFileName)) {
      continue;
    }

    const currentDir: string = currentFile.split('/').slice(0, -1).join('/');
    const resolvedModulePath: string = resolve(currentDir, name.text);

    if (!resolvedModulePath.includes(currentModule)) {
      ctx.addFailure(name.getStart(ctx.sourceFile) + 1, name.end - 1, Rule.FAILURE_STRING);
    }
  }
}

function isImportFromNPMPackage(filename: string): boolean {
  return !(filename.startsWith('.') || filename.startsWith('/') || filename.startsWith('~'));
}
