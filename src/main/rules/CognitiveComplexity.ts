import { Flow, IRuleDefinition, RuleResult, FlowType } from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";

export class CognitiveComplexity extends RuleCommon implements IRuleDefinition {
  constructor() {
    super({
      name: "CognitiveComplexity",
      label: "Cognitive Complexity",
      description: `
        Much like code, a flows can be hard to understand and maintain. 
        A flow's cognitive complexity is based on a few simple rules: 
        1) Flow is considered more complex for each "break in the linear program flow"
        2) Flow is considered more complex when "program flow breaking structures are nested"
        `,
      supportedTypes: [...FlowType.backEndTypes],
      docRefs: [],
      isConfigurable: false,
      autoFixable: false,
    });
  }

  public execute(flow: Flow, ruleOptions?: object = {}): RuleResult {}
}
