import * as core from "../internals/internals";
import { AdvancedRule } from "../models/AdvancedRule";

export class APIVersion extends AdvancedRule {
  constructor() {
    super({
      autoFixable: false,
      description:
        "Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.",
      docRefs: [],
      isConfigurable: true,
      label: "Outdated API Version",
      name: "APIVersion",
      supportedTypes: core.FlowType.allTypes(),
    });
  }

  public execute(flow: core.Flow, options?: { expression: string }): core.RuleResult {
    let flowAPIVersionNumber: null | number = null;
    if (flow.xmldata.apiVersion) {
      const flowAPIVersion = flow.xmldata.apiVersion;
      flowAPIVersionNumber = +flowAPIVersion;
    }
    const results: core.ResultDetails[] = [];
    if (!flowAPIVersionNumber) {
      results.push(
        new core.ResultDetails(new core.FlowAttribute("API Version <49", "apiVersion", "<49"))
      );

      return new core.RuleResult(this, results);
    }
    if (options && options.expression) {
      // eslint-disable-next-line sonarjs/code-eval
      const isApiNumberMoreThanConfiguredExpression = new Function(
        `return ${flowAPIVersionNumber}${options.expression};`
      );
      if (!isApiNumberMoreThanConfiguredExpression()) {
        results.push(
          new core.ResultDetails(
            new core.FlowAttribute(`${flowAPIVersionNumber}`, "apiVersion", options.expression)
          )
        );
      }
    }

    return new core.RuleResult(this, results);
  }
}
