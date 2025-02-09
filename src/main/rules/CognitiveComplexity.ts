import {
  Flow,
  IRuleDefinition,
  RuleResult,
  FlowType,
  ResultDetails,
  FlowAttribute,
} from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";

import { toTreeStackPath } from "../models/TreeNode";

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
      isConfigurable: true,
      autoFixable: false,
    });
  }
  private defaultMaxCognitiveCount: number = 5;

  public execute(flow: Flow, ruleOptions?: { max: number }): RuleResult {
    const results: ResultDetails[] = [];
    const maxCognitiveCount: number = ruleOptions?.max ?? this.defaultMaxCognitiveCount;
    const stackPath: string[] = toTreeStackPath(flow["flowElementConnection"]);
    const flowCognitiveCount: number = stackPath.length;
    if (flowCognitiveCount > maxCognitiveCount) {
      results.push(
        new ResultDetails(
          new FlowAttribute(this.name, "Flow Overall Logic", "Too many decision branches")
        )
      );
    }
    return new RuleResult(this, results);
  }
}
