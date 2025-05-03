// import { ParsedFlow } from "../src/main/models/ParsedFlow";
// import { RuleResult, Flow, scan, ScanResult } from "../src";
import { GetRecordAllFields } from "../src/main/rules/GetRecordAllFields";

import { describe, it, expect } from "@jest/globals";

describe("GetRecordAllFields", () => {
  it("should be defined", () => {
    expect(GetRecordAllFields).toBeDefined();
  });
});
