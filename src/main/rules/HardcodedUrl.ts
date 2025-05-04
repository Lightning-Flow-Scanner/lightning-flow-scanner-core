import {
  IRuleDefinition,
  RuleCommon,
  RuleResult,
  Flow,
  FlowType,
  ResultDetails,
  AutoFixable,
} from "../internals/internals";

export class HardcodedUrl extends RuleCommon implements IRuleDefinition, AutoFixable {
  constructor() {
    super(
      {
        name: "HardcodedUrl",
        label: "Hardcoded URL",
        description:
          "Avoid hard-coding URLs as they are org-specific. Instead, use a $API formula (preferred) or you can use an environment-specific such as custom labels, custom metadata, or custom settings.",
        supportedTypes: FlowType.allTypes(),
        docRefs: [
          {
            label: "The Ultimate Guide to Salesforce Flow Best Practices",
            path: "https://admin.salesforce.com/blog/2021/the-ultimate-guide-to-flow-best-practices-and-standards",
          },
          {
            label: "Why You Should Avoid Hard Coding and Three Alternative Solutions",
            path: "https://admin.salesforce.com/blog/2021/why-you-should-avoid-hard-coding-and-three-alternative-solutions",
          },
        ],
        isConfigurable: false,
        autoFixable: true,
      },
      {
        severity: "warning",
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute(flow: Flow): RuleResult {
    const results: ResultDetails[] = [];

    return new RuleResult(this, results);
  }

  public fix(flow: Flow): Flow {
    return flow;
  }
}
