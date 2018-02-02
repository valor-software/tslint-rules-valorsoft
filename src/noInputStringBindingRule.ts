import * as Lint from 'tslint';
import * as ts from 'typescript';
import { NgWalker } from 'codelyzer/angular/ngWalker';
import { BasicTemplateAstVisitor } from 'codelyzer/angular/templates/basicTemplateAstVisitor';
import { BoundElementPropertyAst } from '@angular/compiler/src/template_parser/template_ast';

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-input-string-binding',
    type: 'functionality',
    description: 'Do not use Input string binding.',
    rationale: 'Do not use Input string binding it is considered as not the best practice.',
    options: null,
    optionsDescription: 'Not configurable.',
    typescriptOnly: true
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NgWalker(sourceFile,
        this.getOptions(), {
          templateVisitorCtrl: InputTemplateVisitor,
        }));
  }
}

const inputExpressionRe = new RegExp(/(\[)(.*)(\])/);
const inputRe = new RegExp(/(\[)(.*)(\])\s*=\s*(?:'|")((?:'|")(.*)(?:'|"))(?:'|")/);

class InputCheckTemplateVisitor extends BasicTemplateAstVisitor {
  static Error = 'Use Input string without binding.';

  visitElementProperty(prop: BoundElementPropertyAst, context: BasicTemplateAstVisitor): any {
    if (prop.sourceSpan) {
      const directive = (<any>prop.sourceSpan).toString();

      const directiveMatch = directive.match(inputExpressionRe);
      const expr = directiveMatch.input;

      if (expr && inputRe.test(expr)) {
        const span = prop.sourceSpan;

        context.addFailure(
          context.createFailure(span.start.offset, span.end.offset - span.start.offset, InputCheckTemplateVisitor.Error)
        );
      }
    }
    super.visitElementProperty(prop, context);
  }
}


class InputTemplateVisitor extends BasicTemplateAstVisitor {
  private visitors: (BasicTemplateAstVisitor)[] = [
    new InputCheckTemplateVisitor(this.getSourceFile(), this.getOptions(), this.context, this.templateStart)
  ];

  visitElementProperty(prop: BoundElementPropertyAst, context: any): any {
    this.visitors
      .map(v => v.visitElementProperty(prop, this))
      .filter(f => !!f)
      .forEach(f => this.addFailure(f));
    super.visitElementProperty(prop, context);
  }

}
