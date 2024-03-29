import { RuleCommon } from '../models/RuleCommon';
import * as core from '../../index';

export class FlowDescription extends RuleCommon implements core.IRuleDefinition {

  constructor() {
    super({
      name: 'FlowDescription',
      label: 'Missing Flow Description',
      description: "Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose.",
      type: 'flow',
      supportedTypes: core.FlowType.allTypes(),
      docRefs: [],
      isConfigurable: false
    });
  }

  public execute(flow: core.Flow): core.RuleResult {
    if (flow.type[0] === 'Survey') {
      return new core.RuleResult(this, []);
    }
    const missingFlowDescription = !flow.xmldata.description;
    return (missingFlowDescription ? 
      new core.RuleResult(this, [new core.ResultDetails(new core.FlowAttribute('undefined', "description", "!==null"))]) :
      new core.RuleResult(this, []));
  }
}