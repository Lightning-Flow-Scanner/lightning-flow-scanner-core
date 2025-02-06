import { FlowNode } from "./FlowNode";
import { FlowElement } from "./FlowElement";

import { extractNodes } from "../libs/ExtractNodes";

import * as p from "path";
import { XMLSerializedAsObject } from "xmlbuilder2/lib/interfaces";
import { create } from "xmlbuilder2";

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
  public triggerOrder?: number;

  constructor(path?: string, data?: unknown);
  constructor(path: string, data?: unknown) {
    if (path) {
      this.fsPath = p.resolve(path);
      let flowName = p.basename(p.basename(this.fsPath), p.extname(this.fsPath));
      if (flowName.includes(".")) {
        flowName = flowName.split(".")[0];
      }
      this.name = flowName;
    }
    if (data) {
      const hasFlowElement = !!data && typeof data === "object" && "Flow" in data;
      if (hasFlowElement) {
        this.xmldata = (data as XMLSerializedAsObject).Flow;
      } else this.xmldata = data;
      this.preProcessNodes();
    }
  }

  private preProcessNodes() {
    this.label = this.xmldata.label;
    this.interviewLabel = this.xmldata.interviewLabel;
    this.processType = this.xmldata.processType;
    this.processMetadataValues = this.xmldata.processMetadataValues;
    this.startElementReference = this.xmldata.startElementReference;
    this.start = this.xmldata.start;
    this.status = this.xmldata.status;
    this.type = this.xmldata.processType;
    this.triggerOrder = this.xmldata.triggerOrder;
    this.elements = extractNodes(this);
    this.startReference = this.findStart();
  }

  private findStart() {
    let start = "";
    const flowElements: FlowNode[] = this.elements.filter(
      (node) => node instanceof FlowNode
    ) as FlowNode[];
    if (this.startElementReference) {
      start = this.startElementReference;
    } else if (
      flowElements.find((n) => {
        return n.subtype === "start";
      })
    ) {
      const startElement = flowElements.find((n) => {
        return n.subtype === "start";
      });
      start = startElement.connectors[0]["reference"];
    }
    return start;
  }

  public toXMLString(): string {
    try {
      return this.generateDoc();
    } catch (exception) {
      console.warn(`Unable to write xml, caught an error ${exception.toString()}`);
      return "";
    }
  }

  private generateDoc(): string {
    const flowXmlNamespace = "http://soap.sforce.com/2006/04/metadata";
    const doc = create(
      {
        encoding: "UTF-8",
      },
      { Flow: this.xmldata }
    )
      .root()
      .att("xmlns", flowXmlNamespace);
    return doc.end({ prettyPrint: true });
  }
}
