import { isCallExpression, isIdentifier, isPropertyAccessExpression } from 'tsutils';
import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-empty-spec',
    type: 'typescript',
    description: 'Disallows empty spec blocks.',
    rationale: 'Empty blocks are often indicators of missing tests.',
    options: null,
    optionsDescription: 'Not configurable.',
    optionExamples: [true],
    typescriptOnly: true,
  };

  public static FAILURE_STRING(cbText: string): string {
    return `Need to add at least '${cbText}'.`;
  }

  public static NO_EMPTY_BLOCKS = ['describe', 'it'];
  public static BLOCK_EXPECT = {
    describe: 'xit|it',
    it: 'expect'
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    if (
      isCallExpression(node) &&
      isIdentifier(node.expression) &&
      checkFunctionsThatCanBeEmpty(node.expression)) {
      const text = node.expression.text;
      const expectFunction = Rule.BLOCK_EXPECT[text];
      const contentOfExpression = node.getFullText(ctx.sourceFile);

      if (!RegExp('\\b' + expectFunction + '\\b').test(contentOfExpression)) {
        const start = node.getStart(ctx.sourceFile);

        return ctx.addFailure(start, node.end, Rule.FAILURE_STRING(expectFunction));
      }
    }

    return ts.forEachChild(node, cb);
  });
}

function checkFunctionsThatCanBeEmpty(name: ts.Identifier) {
  const {text} = name;

  return Rule.NO_EMPTY_BLOCKS.indexOf(text) !== -1;
}
