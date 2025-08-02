import { AdvancedRule } from "../models/AdvancedRule";
import { BetaRuleStore, DefaultRuleStore } from "../store/DefaultRuleStore";
import { DynamicRule } from "./DynamicRule";
import { RuleLoader } from "./RuleLoader";

export function getBetaRules(): AdvancedRule[] {
  return getBetaDefinition();
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function GetRuleDefinitions(ruleConfig?: Map<string, unknown>): AdvancedRule[] {
  const selectedRules: AdvancedRule[] = [];
  if (ruleConfig && ruleConfig instanceof Map) {
    for (const ruleName of ruleConfig.keys()) {
      let severity = "error";
      try {
        const configuredPath = ruleConfig.get(ruleName)?.["path"];
        const configuredSeverity = ruleConfig.get(ruleName)?.["severity"];
        if (
          configuredSeverity &&
          (configuredSeverity === "error" ||
            configuredSeverity === "warning" ||
            configuredSeverity === "note")
        ) {
          severity = configuredSeverity;
        }
        if (configuredPath) {
          const customRule = RuleLoader.loadCustomRule(ruleName, configuredPath) as AdvancedRule;
          if (configuredSeverity) {
            customRule.severity = severity;
          }
          selectedRules.push(customRule);
        } else {
          const matchedRule = new DynamicRule(ruleName) as AdvancedRule;
          if (configuredSeverity) {
            matchedRule.severity = severity;
          }
          selectedRules.push(matchedRule);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  } else {
    for (const rule in DefaultRuleStore) {
      const matchedRule = new DynamicRule(rule) as AdvancedRule;
      selectedRules.push(matchedRule);
    }
  }

  return selectedRules;
}

export function getRules(ruleNames?: string[]): AdvancedRule[] {
  if (ruleNames && ruleNames.length > 0) {
    const ruleSeverityMap = new Map<string, string>(ruleNames.map((name) => [name, "error"]));
    return GetRuleDefinitions(ruleSeverityMap);
  } else {
    return GetRuleDefinitions();
  }
}

function getBetaDefinition(): AdvancedRule[] {
  return Object.values(BetaRuleStore).map((rule) => new rule() as AdvancedRule);
}
