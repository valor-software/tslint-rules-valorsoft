import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'ng-on-changes-interface',
    type: 'functionality',
    description: 'Use appropriate type \'SimpleChanges\' for ngOnChanges.',
    rationale: 'Ban to use type any for ngOnChanges.',
    options: null,
    optionsDescription: 'Not configurable.',
    typescriptOnly: true
  };

  public static FAILURE_STRING = "Use appropriate type 'SimpleChanges' for ngOnChanges, not any.";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.MethodDeclaration) {
      const method = node as ts.MethodDeclaration;
      const methodName = (method.name as ts.StringLiteral).text;

      if (methodName === 'ngOnChanges') {
        for (const parameter of method.parameters) {
          if (!parameter.type || parameter.type.kind === ts.SyntaxKind.AnyKeyword) {
            return ctx.addFailure(method.getStart(), method.getWidth(), Rule.FAILURE_STRING);
          }
        }
      }
    }

    return ts.forEachChild(node, cb);
  });
}
