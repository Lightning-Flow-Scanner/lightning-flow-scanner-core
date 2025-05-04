import { describe, it, expect } from "@jest/globals";
import { HardcodedUrl } from "../src/main/rules/HardcodedUrl";
import { Flow, ParsedFlow, ScanResult } from "../src/main/internals/internals";
import { scan } from "../src";

describe("HardcodedUrl", () => {
  it("should be defined", () => {
    expect(HardcodedUrl).toBeDefined();
  });

  let rule: HardcodedUrl;

  beforeEach(() => {
    rule = new HardcodedUrl();
  });

  describe("e2e", () => {
    it("should scan for hardcoded urls", () => {
      const config = {
        rules: {
          HardcodedUrl: {
            severity: "error",
          },
        },
      };

      const parsedFlows: ParsedFlow[] = [
        {
          flow: {
            type: "AutoLaunchedFlow",
            elements: [
              {
                name: "hardcodedUrl",
                subtype: "formulas",
                metaType: "variable",
                element: {
                  name: "hardcodedUrl",
                  dataType: "String",
                  expression:
                    "&quot;https://mydomain.sandbox.my.salesforce.com/&quot;&amp;{!$User.Id}",
                },
              },
            ],
          },
        } as Partial<ParsedFlow> as ParsedFlow,
      ];

      const results: ScanResult[] = scan(parsedFlows, config);
      const scanResults = results.pop();
      const ruleResults = scanResults?.ruleResults.filter((rule) => {
        return rule.ruleDefinition.name === "HardcodedUrl" && rule.occurs;
      });
      expect(ruleResults).toBeTruthy();
      expect(ruleResults).toHaveLength(1);
    });
  });

  describe("empty unit", () => {
    it("should return empty results when flow has no elements", () => {
      const flow = {
        type: "AutoLaunchedFlow",
        elements: [],
      } as Partial<Flow> as Flow;

      const result = rule.execute(flow);
      expect(result).toBeDefined();
      expect(result.occurs).toBe(false);
    });
  });

  describe("error unit", () => {});
});
