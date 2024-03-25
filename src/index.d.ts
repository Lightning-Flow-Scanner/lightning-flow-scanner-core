// index.d.ts
import {FlowAttribute,
  FlowElement,
  FlowNode,
  FlowType,
  FlowVariable,
  Flow,
  Compiler,
  ScanResult,
  RuleResult,
  ResultDetails,
  IRuleDefinition,
  IRulesConfig} from './main/internals';

// Export functions
export declare function getRules(ruleNames?: string[]): IRuleDefinition[];
export declare function scan(flows: Flow[], ruleOptions?: IRulesConfig): ScanResult[];
export declare function fix(flows: Flow[]): ScanResult[];

// Export models and interfaces
export {
  FlowAttribute,
  FlowElement,
  FlowNode,
  FlowType,
  FlowVariable,
  Flow,
  Compiler,
  ScanResult,
  RuleResult,
  ResultDetails,
  IRuleDefinition,
  IRulesConfig
};
