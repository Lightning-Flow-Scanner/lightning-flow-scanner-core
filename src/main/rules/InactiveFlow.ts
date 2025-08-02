import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class InactiveFlow extends AdvancedRule {
  constructor() {
    super({
      autoFixable: false,
      description:
        "Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble, like accidentally deleting records during testing, or being activated as subflows within parent flows.",
      docRefs: [],
      isConfigurable: false,
      label: "Inactive Flow",
      name: "InactiveFlow",
      supportedTypes: core.FlowType.allTypes(),
    });
  }

  public execute(flow: core.Flow): core.RuleResult {
    const results: core.ResultDetails[] = [];
    if (flow.status !== "Active") {
      results.push(
        new core.ResultDetails(new core.FlowAttribute(flow.status, "status", "!= Active"))
      );
    }
    return new core.RuleResult(this, results);
  }
}
