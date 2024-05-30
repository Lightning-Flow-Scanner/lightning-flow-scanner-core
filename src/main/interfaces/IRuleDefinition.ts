import { Flow } from '../models/Flow';
import { RuleResult } from '../models/RuleResult';

/**
 * Interface defining the structure of a rule definition.
 */
export interface IRuleDefinition {
  // Unique name of the rule
  name: string;
  // User-friendly label of the rule
  label: string;
  // Description of what the rule does
  description: string;
  // Types of flows this rule applies to
  supportedTypes: string[];
  // References to online documentation for best practices and guidelines
  docRefs: { label: string, path: string }[];
  // Indicates if the rule has configurable options
  isConfigurable: boolean;
  // Indicates if the rule can be auto-fixed
  autoFixable: boolean;
  // Link to additional information about the rule (optional)
  uri?: string;
  // Default severity level of the rule (optional)
  severity?: string;

  /**
   * Executes the rule on the provided flow to produce a rule result.
   * @param flow The flow to be evaluated by the rule.
   * @param ruleOptions (Optional) Additional options for executing the rule.
   * @returns A RuleResult object containing the evaluation result.
   */
  execute(flow: Flow, ruleOptions?: {}): RuleResult;
}
