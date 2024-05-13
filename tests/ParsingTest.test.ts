import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'

describe('Parsing Flows', () => {
  let flow: core.Flow;

  it(' should have a result ', async () => {
    const flows = await core.parse(['/Users/rubenhalman/Projects/lightning-flow-scanner-core/tests/xmlfiles/Unused_Variable_Fixed.flow-meta.xml']);

    expect(flows[0].name).to.equal("Unused_Variable_Fixed");
  });

});
