import { FlowMetadata } from "../models/FlowMetadata";
import { FlowVariable } from "../models/FlowVariable";
import { FlowNode } from "../models/FlowNode";
import { FlowResource } from "../models/FlowResource";
import { Flow } from "../models/Flow";

const flowVariables = ["choices", "constants", "dynamicChoiceSets", "formulas", "variables"];
const flowResources = ["textTemplates", "stages"];
const flowMetadata = [
  "description",
  "apiVersion",
  "processMetadataValues",
  "processType",
  "interviewLabel",
  "label",
  "status",
  "runInMode",
  "startElementReference",
  "isTemplate",
  "fullName",
  "timeZoneSidKey",
  "isAdditionalPermissionRequiredToRun",
  "migratedFromWorkflowRuleName",
  "triggerOrder",
  "environments",
  "segment",
];
const flowNodes = [
  "actionCalls",
  "apexPluginCalls",
  "assignments",
  "collectionProcessors",
  "decisions",
  "loops",
  "orchestratedStages",
  "recordCreates",
  "recordDeletes",
  "recordLookups",
  "recordUpdates",
  "recordRollbacks",
  "screens",
  "start",
  "steps",
  "subflows",
  "waits",
];

const extractNodes = (flow: Flow): (FlowVariable | FlowNode | FlowMetadata)[] => {
  const allNodes: (FlowVariable | FlowNode | FlowMetadata)[] = [];
  for (const nodeType in flow.xmldata) {
    const data = flow.xmldata[nodeType];
    if (flowMetadata.includes(nodeType)) {
      if (Array.isArray(data)) {
        for (const node of data) {
          allNodes.push(new FlowMetadata(nodeType, node));
        }
      } else {
        allNodes.push(new FlowMetadata(nodeType, data));
      }
    } else if (flowVariables.includes(nodeType)) {
      if (Array.isArray(data)) {
        for (const node of data) {
          allNodes.push(new FlowVariable(node.name, nodeType, node));
        }
      } else {
        allNodes.push(new FlowVariable(data.name, nodeType, data));
      }
    } else if (flowNodes.includes(nodeType)) {
      if (Array.isArray(data)) {
        for (const node of data) {
          allNodes.push(new FlowNode(node.name, nodeType, node));
        }
      } else {
        allNodes.push(new FlowNode(data.name, nodeType, data));
      }
    } else if (flowResources.includes(nodeType)) {
      if (Array.isArray(data)) {
        for (const node of data) {
          allNodes.push(new FlowResource(node.name, nodeType, node));
        }
      } else {
        allNodes.push(new FlowResource(data.name, nodeType, data));
      }
    }
  }
  return allNodes;
};

export { extractNodes };
