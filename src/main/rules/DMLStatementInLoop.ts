import { FlowType } from "../internals/internals";
import { LoopRuleCommon } from "../models/LoopRuleCommon";

export class DMLStatementInLoop extends LoopRuleCommon {
  constructor() {
    super({
      autoFixable: false,
      description:
        "To prevent exceeding Apex governor limits, it is advisable to consolidate all your database operations, including record creation, updates, or deletions, at the conclusion of the flow.",
      docRefs: [
        {
          label: "Flow Best Practices",
          path: "https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5",
        },
      ],
      isConfigurable: false,
      label: "DML Statement In A Loop",
      name: "DMLStatementInLoop",
      supportedTypes: FlowType.backEndTypes,
    });
  }

  protected getStatementTypes(): string[] {
    return ["recordDeletes", "recordUpdates", "recordCreates"];
  }
}
