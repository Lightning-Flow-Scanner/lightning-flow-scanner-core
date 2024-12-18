import "mocha";

import { ParsedFlow } from "../src/main/models/ParsedFlow";
import { SameRecordFieldUpdates } from "../src/main/rules/SameRecordFieldUpdates";
import { RuleResult, Flow, parse, scan, ScanResult } from "../src";
import * as path from "path-browserify";

describe("SameRecordFieldUpdates", () => {
  let expect;
  let rule;
  before(async () => {
    expect = (await import("chai")).expect;
    rule = new SameRecordFieldUpdates();
  });

  it("should flag same record updates on before context flows", async () => {
    const testData: ParsedFlow = {
      flow: {
        start: {
          locationX: "50",
          locationY: "0",
          connector: { targetReference: "Update_triggering_records" },
          object: "Account",
          recordTriggerType: "Create",
          triggerType: "RecordBeforeSave",
        },
        elements: [
          {
            element: {
              description: "test",
              name: "Update_triggering_records",
              label: "Update triggering records",
              locationX: "176",
              locationY: "287",
              inputAssignments: { field: "Active__c", value: { stringValue: "Yes" } },
              inputReference: "$Record",
            },
            subtype: "recordUpdates",
            metaType: "node",
            connectors: [],
            name: "Update_triggering_records",
            locationX: "176",
            locationY: "287",
          },
          {
            element: {
              locationX: "50",
              locationY: "0",
              connector: { targetReference: "Update_triggering_records" },
              object: "Account",
              recordTriggerType: "Create",
              triggerType: "RecordBeforeSave",
            },
            subtype: "start",
            metaType: "node",
            connectors: [
              {
                element: { targetReference: "Update_triggering_records" },
                processed: false,
                type: "connector",
                reference: "Update_triggering_records",
              },
            ],
            name: "flowstart",
            locationX: "50",
            locationY: "0",
          },
        ],
      },
    } as {} as ParsedFlow;

    const ruleResult: RuleResult = rule.execute(testData.flow as Flow);

    expect(ruleResult.occurs).to.be.true;
  });

  it("should not flag same record updates on after context flows", async () => {
    const testData: ParsedFlow = {
      flow: {
        start: {
          locationX: "50",
          locationY: "0",
          connector: { targetReference: "Update_triggering_records" },
          object: "Account",
          recordTriggerType: "Create",
          triggerType: "RecordAfterSave",
        },
        elements: [
          {
            element: {
              description: "test",
              name: "Update_triggering_records",
              label: "Update triggering records",
              locationX: "176",
              locationY: "287",
              inputAssignments: { field: "Active__c", value: { stringValue: "Yes" } },
              inputReference: "$Record",
            },
            subtype: "recordUpdates",
            metaType: "node",
            connectors: [],
            name: "Update_triggering_records",
            locationX: "176",
            locationY: "287",
          },
          {
            element: {
              locationX: "50",
              locationY: "0",
              connector: { targetReference: "Update_triggering_records" },
              object: "Account",
              recordTriggerType: "Create",
              triggerType: "RecordAfterSave",
            },
            subtype: "start",
            metaType: "node",
            connectors: [
              {
                element: { targetReference: "Update_triggering_records" },
                processed: false,
                type: "connector",
                reference: "Update_triggering_records",
              },
            ],
            name: "flowstart",
            locationX: "50",
            locationY: "0",
          },
        ],
      },
    } as {} as ParsedFlow;

    const ruleResult: RuleResult = rule.execute(testData.flow as Flow);

    expect(ruleResult.occurs).to.be.false;
  });

  it("should not trigger from default configuration on store", async () => {
    let example_uri1 = path.join(__dirname, "./xmlfiles/Same_Record_Field_Updates.flow-meta.xml");
    let flows = await parse([example_uri1]);
    const ruleConfig = {
      rules: {},
      exceptions: {},
    };
    const results: ScanResult[] = scan(flows, ruleConfig);
    const scanResults = results.pop();

    scanResults?.ruleResults.forEach((rule) => {
      expect(rule.occurs).to.be.false;
    });
  });

  it("should trigger when opt-in configuration", async () => {
    let example_uri1 = path.join(__dirname, "./xmlfiles/Same_Record_Field_Updates.flow-meta.xml");
    let flows = await parse([example_uri1]);
    const ruleConfig = {
      rules: {
        SameRecordFieldUpdates: {
          severity: "error",
        },
      },
      exceptions: {},
    };
    const results: ScanResult[] = scan(flows, ruleConfig);
    const scanResults = results.pop();

    const expectedRule = scanResults?.ruleResults.find(
      (rule) => rule.ruleName === "SameRecordFieldUpdates"
    );
    expect(expectedRule).to.be.ok;
    expect(expectedRule?.occurs).to.be.true;
  });

  it("should not error when start element is not existing", async () => {
    const testData: ParsedFlow = {
      flow: {
        elements: [
          {
            element: {
              description: "test",
              name: "Update_triggering_records",
              label: "Update triggering records",
              locationX: "176",
              locationY: "287",
              inputAssignments: { field: "Active__c", value: { stringValue: "Yes" } },
              inputReference: "$Record",
            },
            subtype: "recordUpdates",
            metaType: "node",
            connectors: [],
            name: "Update_triggering_records",
            locationX: "176",
            locationY: "287",
          },
          {
            element: {
              locationX: "50",
              locationY: "0",
              connector: { targetReference: "Update_triggering_records" },
              object: "Account",
              recordTriggerType: "Create",
              triggerType: "RecordBeforeSave",
            },
            subtype: "start",
            metaType: "node",
            connectors: [
              {
                element: { targetReference: "Update_triggering_records" },
                processed: false,
                type: "connector",
                reference: "Update_triggering_records",
              },
            ],
            name: "flowstart",
            locationX: "50",
            locationY: "0",
          },
        ],
      },
    } as {} as ParsedFlow;

    const ruleResult: RuleResult = rule.execute(testData.flow as Flow);

    expect(ruleResult.occurs).to.be.false;
  });

  it("should not error when elements are missing", async () => {
    const testData: ParsedFlow = {
      flow: {
        start: {
          locationX: "50",
          locationY: "0",
          connector: { targetReference: "Update_triggering_records" },
          object: "Account",
          recordTriggerType: "Create",
          triggerType: "RecordBeforeSave",
        },
      },
    } as {} as ParsedFlow;

    const ruleResult: RuleResult = rule.execute(testData.flow as Flow);

    expect(ruleResult.occurs).to.be.false;
  });
});
