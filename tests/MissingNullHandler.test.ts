import { assert, expect } from 'chai';
import 'mocha';
import * as core from '../src'
import CreateANewAccountWithChild from './testfiles/MissingNullHandler.json';
import Subflow_MissingNullHandler from './testfiles/Subflow_MissingNullHandler.json';

describe('The MissingNullHandler Rule', () => {
    let flow: core.Flow;

    it('Should have a result when missing', () => {
        const ruleConfig = {
            rules:
            {
                MissingNullHandler:
                {
                    severity: 'error',
                },
            }
        };
        flow = new core.Flow({
            path: './testfiles/tc.flow-meta.xml',
            xmldata: CreateANewAccountWithChild,
        });
        const results: core.ScanResult[] = core.scan([flow], ruleConfig);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler')
        expect(results[0].ruleResults[0].occurs).to.equal(true);
    });

    it('Should have no result for subflow output variables ', () => {
        const ruleConfig = {
            rules:
            {
                MissingNullHandler:
                {
                    severity: 'error',
                },
            }
        };
        flow = new core.Flow({
            path: './testfiles/Subflow_MissingNullHandler.flow-meta.xml',
            xmldata: Subflow_MissingNullHandler,
        });
        const results: core.ScanResult[] = core.scan([flow], ruleConfig);
        expect(results[0].ruleResults[0].ruleName).to.equal('MissingNullHandler')
        expect(results[0].ruleResults[0].occurs).to.equal(true);
        expect(results[0].ruleResults[0].details.length).to.equal(1);
    });
});
