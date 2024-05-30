/**
 * Configuration options for a specific rule.
 * Allows specifying severity and path for a rule.
 */
export interface IRuleConfig {
  // Severity level for the rule (error, warning, or note)
  severity?: string;
  // Path to the custom TypeScript file defining the rule (optional)
  path?: string;
}
