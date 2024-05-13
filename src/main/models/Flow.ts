import {FlowNode} from './FlowNode';
import { FlowMetadata } from './FlowMetadata';
import {FlowElement} from './FlowElement';
import {FlowVariable} from './FlowVariable';
import p from "path-browserify";
import { FlowResource } from './FlowResource';

export class Flow {

  public label: string;
  public xmldata;
  public name?: string;
  public interviewLabel?: string;
  public processType?;
  public processMetadataValues?;
  public type?;
  public start?;
  public startElementReference?;
  public status?;
  public fsPath;
  public root?;
  public elements?: FlowElement[];
  public startReference;

  private flowVariables = [
    'choices',
    'constants',
    'dynamicChoiceSets',
    'formulas',
    'variables'
  ];
  private flowResources = ['textTemplates', 'stages'];
  private flowMetadata = [
    'description',
    'apiVersion',
    'processMetadataValues',
    'processType',
    'interviewLabel',
    'label',
    'status',
    'runInMode',
    'startElementReference',
    'isTemplate',
    'fullName',
    'timeZoneSidKey',
    'isAdditionalPermissionRequiredToRun',
    'migratedFromWorkflowRuleName',
    'triggerOrder',
    'environments',
    'segment'
  ];
  private flowNodes = [
    'actionCalls',
    'apexPluginCalls',
    'assignments',
    'collectionProcessors',
    'decisions',
    'loops',
    'orchestratedStages',
    'recordCreates',
    'recordDeletes',
    'recordLookups',
    'recordUpdates',
    'recordRollbacks',
    'screens',
    'start',
    'steps',
    'subflows',
    'waits'
  ];

  constructor(args :{path: string, xmldata: any}) {
    this.fsPath = p.resolve(args.path);
    let flowName = p.basename(p.basename(this.fsPath), p.extname(this.fsPath));
    if (flowName.includes('.')) {
      flowName = flowName.split('.')[0]
    }
    this.name = flowName;

    // todo fix
    if(args.xmldata && args.xmldata.Flow){
      this.xmldata = args.xmldata.Flow;
    } else if(args.xmldata){
      this.xmldata = args.xmldata;
    }
    this.preProcessNodes();
  }

  public preProcessNodes() {

    this.label = this.xmldata.label;
    this.interviewLabel = this.xmldata.interviewLabel;
    this.processType = this.xmldata.processType;
    this.processMetadataValues = this.xmldata.processMetadataValues;
    this.startElementReference = this.xmldata.startElementReference;
    this.start = this.xmldata.start;
    this.status = this.xmldata.status;
    this.type = this.xmldata.processType;
    const allNodes: (FlowVariable | FlowNode | FlowMetadata)[] = [];
    for (const nodeType in this.xmldata) {
      // skip xmlns url
      // if (nodeType == "@xmlns") {
      //   continue;
      // }
      if (this.flowMetadata.includes(nodeType)) {
        let data = this.xmldata[nodeType];
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowMetadata(nodeType, data[node]));
          }
        } else {
          allNodes.push(new FlowMetadata(
            nodeType,
            this.xmldata[nodeType]
          ));
        }
      } else if (this.flowVariables.includes(nodeType)) {
        let data = this.xmldata[nodeType];
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowVariable(data[node].name, nodeType, data[node]));
          }
        } else {
          allNodes.push(new FlowVariable(data.name, nodeType, data));
        }
      } else if (this.flowNodes.includes(nodeType)) {
        let data = this.xmldata[nodeType];
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowNode(data[node].name, nodeType, data[node]));
          }
        } else {
          allNodes.push(new FlowNode(data.name, nodeType, data));
        }
      } else if (this.flowResources.includes(nodeType)) {
        let data = this.xmldata[nodeType];
        if (Array.isArray(data)) {
          for (const node of data) {
            allNodes.push(new FlowResource(data[node].name, nodeType, data[node]));
          }
        } else {
          allNodes.push(new FlowResource(data.name, nodeType, data));
        }
      }
    }
    this.elements = allNodes;
    this.startReference = this.findStart();
  }

  private findStart() {
    let start = '';
    const flowElements: FlowNode[] = this.elements.filter(node => node instanceof FlowNode) as FlowNode[];
    if (this.startElementReference) {
      start = this.startElementReference;
    } else if(flowElements.find(n => {
      return n.subtype === 'start';
    })){
      let startElement = flowElements.find(n => {
        return n.subtype === 'start';
      });
      start = startElement.connectors['reference'];
    }
    return start;
  }

}

