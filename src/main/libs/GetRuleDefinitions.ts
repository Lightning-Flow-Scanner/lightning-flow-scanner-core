import { IRuleDefinition } from "../interfaces/IRuleDefinition";
import { DefaultRuleStore } from "../store/DefaultRuleStore";
import { DynamicRule } from "./DynamicRule";

export function GetRuleDefinitions(
  ruleConfig?: Map<string, {}>
): IRuleDefinition[] {
  const selectedRules: any[] = [];
  if (ruleConfig && ruleConfig instanceof Map) {
    for (const ruleName of ruleConfig.keys()) {
      let severity = "error";
      try {
        const configuredSeverity = ruleConfig.get(ruleName)["severity"];
        if (
          configuredSeverity &&
          (configuredSeverity === "error" ||
            configuredSeverity === "warning" ||
            configuredSeverity === "note")
        ) {
          severity = configuredSeverity;
        }
        const matchedRule = new DynamicRule(ruleName);
        matchedRule["severity"] = severity;
        selectedRules.push(matchedRule);
      } catch (error) {
        console.log(error.message);
      }
    }
  } else {
    // tslint:disable-next-line:forin
    for (const rule in DefaultRuleStore) {
      const matchedRule = new DynamicRule(rule);
      matchedRule["severity"] = "error";
      selectedRules.push(matchedRule);
    }
  }

  return selectedRules;
}
