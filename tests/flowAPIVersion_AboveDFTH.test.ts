import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src';
import Hidenav from './testfiles/api58test.json';

describe('A flow with the API version attribute', () => {
  let flow: core.Flow;
  
  before('arrange', () => {
    flow = new core.Flow({
      path: './testfiles/api58test.flow-meta.xml',
      xmldata: Hidenav,
    });
  });

  it('should have a result', () => {
    const ruleConfig = {
      rules: 
        { 
          APIVersion: 
                {
                    severity: 'error'
                },
        }
    };

    const results: core.ScanResult[] = core.scan([flow], ruleConfig);
    expect(results[0].ruleResults.length).to.equal(1);
    expect(results[0].ruleResults[0].ruleName).to.equal('APIVersion');
    expect(results[0].ruleResults[0].occurs).to.equal(false);
  });
});
