import { RuleCommon } from "../models/RuleCommon";
import * as core from "../internals/internals";

export class InactiveFlow extends RuleCommon implements core.IRuleDefinition {
  constructor() {
    super({
      name: "InactiveFlow",
      label: "Inactive Flow",
      description:
        "Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble, like accidentally deleting records during testing, or being activated as subflows within parent flows.",
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: false,
      autoFixable: false,
    });
  }

  public execute(flow: core.Flow): core.RuleResult {
    const inactiveFlows: core.FlowElement[] = [];
    flow.elements?.forEach((node) => {
      const nodeElementString = JSON.stringify(node.element);
      if (node.subtype === "status" && nodeElementString !== '"Active"') {
        inactiveFlows.push(node);
      }
    });
    const results: core.ResultDetails[] = [];
    for (const det of inactiveFlows) {
      results.push(
        new core.ResultDetails(
          new core.FlowAttribute(JSON.stringify(det.element), det.subtype, "!= Active")
        )
      );
    }
    return new core.RuleResult(this, results);
  }
}
