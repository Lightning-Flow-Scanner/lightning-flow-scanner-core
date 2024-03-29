import Flow from '../models/Flow';
import RuleResult from '../models/RuleResult';

export default interface IRuleDefinition {
  name: string;
  label: string;
  description: string;
  supportedTypes: string[];
  type: string;
  docRefs: { label: string, path: string }[];
  isConfigurable: boolean;
  uri?: string;
  severity?: string;

  execute(flow: Flow, ruleOptions?: {}): RuleResult;
}