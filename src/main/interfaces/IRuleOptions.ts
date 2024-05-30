import { IRuleConfig } from "./IRuleConfig";

/**
 * Options for configuring individual rules.
 * Each rule can have specific configurations like severity and path.
 */
export interface IRuleOptions {
  // Key-value pairs where the key is the rule name and the value is the configuration for that rule
  [ruleName: string]: IRuleConfig;
}
