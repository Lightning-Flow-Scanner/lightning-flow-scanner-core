import { expect } from 'chai';
import 'mocha';
import * as core from '../src'
import SendEmailFlow from './testfiles/SendEmailFlow.json';


describe('UnusedVariable Rule', () => {
  let flow: core.Flow;
  
  it('there should be no result for variables used in text elements', () => {
    const ruleConfig = {
        rules:
        {
            UnusedVariable:
            {
                severity: 'error',
            },
        }
    };
    flow = new core.Flow({
      path: './testfiles/SendEmailFlow.flow',
      xmldata: SendEmailFlow,
    });
    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    const occurringResults = results[0].ruleResults.filter((rule) => rule.occurs);
    expect(occurringResults.length).to.equal(0);
  });

});

