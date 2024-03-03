import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccountWithChild from './testfiles/errornotconst.json';

describe('error not constructor test', () => {

  let flow: core.Flow;

  before('arrange', () => {
    flow = new core.Flow({
      path: './testfiles/CreateANewAccountWithChild.flow-meta.xml',
      xmldata: CreateANewAccountWithChild,
    });
  });

  it('shouldnt happen', () => {

    const results: core.ScanResult[] = core.scan([flow], undefined);
    expect(results[0].ruleResults.length).to.equal(12);
  });
});