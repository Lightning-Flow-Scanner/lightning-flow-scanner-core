import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class TriggerOrder extends AdvancedRule {
  protected qualifiedRecordTriggerTypes: Set<string> = new Set<string>(["Create", "Update"]);

  constructor() {
    super(
      {
        autoFixable: false,
        description:
          "With flow trigger ordering, introduced in Spring '22, admins can now assign a priority value to their flows and guarantee their execution order. This priority value is not an absolute value, so the values need not be sequentially numbered as 1, 2, 3, and so on.",
        docRefs: [
          {
            label: "Learn more about flow ordering orchestration",
            path: "https://architect.salesforce.com/decision-guides/trigger-automation#Ordering___Orchestration",
          },
        ],
        isConfigurable: false,
        label: "Trigger Order",
        name: "TriggerOrder",
        supportedTypes: [core.FlowType.autolaunchedType],
      },
      { severity: "note" }
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const results: core.ResultDetails[] = [];

    if (!("object" in flow.start)) {
      return new core.RuleResult(this, results);
    }

    if (!flow.triggerOrder) {
      results.push(
        new core.ResultDetails(
          new core.FlowAttribute("TriggerOrder", "TriggerOrder", "10, 20, 30 ...")
        )
      );
    }

    return new core.RuleResult(this, results);
  }
}
