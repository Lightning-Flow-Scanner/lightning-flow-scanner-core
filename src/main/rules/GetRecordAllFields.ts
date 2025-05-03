import * as core from "../internals/internals";
import { RuleCommon } from "../models/RuleCommon";

export class GetRecordAllFields extends RuleCommon implements core.IRuleDefinition {
  constructor() {
    super(
      {
        name: "GetRecordAllFields",
        label: "Get Record All Fields",
        description:
          "Following the principle of least privilege, avoid using Get Records with 'All Fields' unless necessary.",
        supportedTypes: [...core.FlowType.visualTypes, ...core.FlowType.backEndTypes],
        docRefs: [
          {
            label: "SOQL and SOSL | Best Practices for Deployments with Large Data Volumes",
            path: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_best_practices_soql_and_sosl.htm",
          },
          {
            label: "Indexes | Best Practices",
            path: "https://developer.salesforce.com/docs/atlas.en-us.salesforce_large_data_volumes_bp.meta/salesforce_large_data_volumes_bp/ldv_deployments_infrastructure_indexes.htm",
          },
        ],
        isConfigurable: false,
        autoFixable: false,
      },
      { severity: "warning" }
    );
  }

  public execute(flow: core.Flow): core.RuleResult {
    const results: core.ResultDetails[] = [];
    const getElementNodes = flow.elements?.filter((element) => element.subtype === "recordLookup");
    if (getElementNodes?.length === 0) {
      return new core.RuleResult(this, results);
    }
    return new core.RuleResult(this, results);
  }
}
