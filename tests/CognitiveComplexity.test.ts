import { describe, it, expect } from "@jest/globals";

import { Flow, ParsedFlow, scan, ScanResult } from "../src";
import { CognitiveComplexity } from "../src/main/rules/CognitiveComplexity";

describe("Cognitive Complexity ", () => {
  it("should trigger when opt-in configuration e2e", () => {
    const flows: ParsedFlow[] = [
      {
        flow: {
          type: "AutoLaunchedFlow",
          flowElementConnection: {
            start: { value: { name: "start" }, children: [{ value: { name: "a" } }] },
            a: {
              value: { name: "a" },
              children: [{ value: { name: "ab" } }, { value: { name: "b" } }],
            },
            ab: { value: { name: "ab" } },
            b: { value: { name: "b" } },
          },
        },
      } as unknown as ParsedFlow,
    ];

    const ruleConfig = {
      rules: {
        CognitiveComplexity: {
          severity: "error",
          max: 1,
        },
      },
    };
    const results: ScanResult[] = scan(flows, ruleConfig);
    const scanResults = results.pop();
    debugger;
    expect(scanResults).toBeTruthy();

    const expectedRule = scanResults?.ruleResults.find(
      (rule) => rule.ruleName === "CognitiveComplexity"
    );
    expect(expectedRule).toBeTruthy();
    expect(expectedRule?.occurs).toBe(true);
  });

  it("should occur when call stack is 10 using default configuration", () => {
    const rule = new CognitiveComplexity();
    const given = {
      flowElementConnection: {
        start: {
          value: { name: "start" },
          children: [{ value: { name: "a" } }],
        },
        a: {
          value: { name: "a" },
          children: [
            { value: { name: "aa" } },
            { value: { name: "ab" } },
            { value: { name: "ac" } },
            { value: { name: "ad" } },
            { value: { name: "ae" } },
            { value: { name: "af" } },
            { value: { name: "ag" } },
            { value: { name: "ah" } },
            { value: { name: "ai" } },
          ],
        },
        aa: { value: { name: "aa" } },
        ab: { value: { name: "ab" } },
        ac: { value: { name: "ac" } },
        ad: { value: { name: "ad" } },
        ae: { value: { name: "ae" } },
        af: {
          value: { name: "af" },
          children: [{ value: { name: "afa" } }, { value: { name: "afb" } }],
        },
        ag: { value: { name: "ag" } },
        ah: { value: { name: "ah" } },
        ai: { value: { name: "ai" } },
        afa: { value: { name: "afa" } },
        afb: { value: { name: "afb" } },
      },
    } as Partial<Flow>;
    const result = rule.execute(given as Flow);
    expect(result.occurs).toBe(true);
  });

  it("should not occur when call stack is 1 using default configuration", () => {
    const rule = new CognitiveComplexity();
    const given = {
      flowElementConnection: {
        start: { value: { name: "start" }, children: [{ value: { name: "a" } }] },
        a: { value: { name: "a" }, children: [{ value: { name: "ab" } }] },
        ab: { value: { name: "ab" }, children: [{ value: { name: "abc" } }] },
        abc: { value: { name: "abc" }, children: [{ value: { name: "abcd" } }] },
        abcd: { value: { name: "abcd" }, children: [] },
      },
    } as Partial<Flow>;
    const result = rule.execute(given as Flow);
    expect(result.occurs).toBe(false);
  });

  it("should occur when call stack is 2 configured stack is 1", () => {
    const rule = new CognitiveComplexity();
    const given = {
      flowElementConnection: {
        start: { value: { name: "start" }, children: [{ value: { name: "a" } }] },
        a: {
          value: { name: "a" },
          children: [{ value: { name: "ab" } }, { value: { name: "b" } }],
        },
        ab: { value: { name: "ab" }, children: [{ value: { name: "abc" } }] },
        abc: { value: { name: "abc" }, children: [{ value: { name: "abcd" } }] },
        abcd: { value: { name: "abcd" }, children: [] },
        b: { value: { name: "b" }, children: [] },
      },
    } as Partial<Flow>;
    const result = rule.execute(given as Flow, { max: 1 });
    expect(result.occurs).toBe(true);
  });

  it("should not occur when call stack is 1 configured stack is 2", () => {
    const rule = new CognitiveComplexity();
    const given = {
      flowElementConnection: {
        start: { value: { name: "start" }, children: [{ value: { name: "a" } }] },
        a: { value: { name: "a" }, children: [{ value: { name: "ab" } }] },
        ab: { value: { name: "ab" }, children: [{ value: { name: "abc" } }] },
        abc: { value: { name: "abc" }, children: [{ value: { name: "abcd" } }] },
        abcd: { value: { name: "abcd" }, children: [] },
      },
    } as Partial<Flow>;
    const result = rule.execute(given as Flow, { max: 2 });
    expect(result.occurs).toBe(false);
  });
});
