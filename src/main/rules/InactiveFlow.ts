import * as IdPrefixes from '../data/IdPrefixes.json';
import { RuleCommon } from '../models/RuleCommon';
import * as core from '../internals/internals';

export class InactiveFlow extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'InactiveFlow',
      label: 'Inactive Flow',
      description: 'Avoid having inactive flows in your org.',
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: true, 
      autoFixable: false
    },
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const inactiveFlows = [];
    console.log(flow.name);
    for (const node of flow.elements) {
        const nodeElementString = JSON.stringify(node.element);
        if (node.subtype == "status" && nodeElementString != '\"Active\"') {
            inactiveFlows.push(node);
        }
    }
    let results = [];
    for (const det of inactiveFlows) {
      results.push(new core.ResultDetails(det));
    }
    return new core.RuleResult(this, results);
  }
}