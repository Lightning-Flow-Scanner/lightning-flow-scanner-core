(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.lightningflowscanner = {}));
})(this, (function (exports) { 'use strict';

    function convertFlowNodes(obj, nodes, key) {
        obj[key] = nodes.map(node => node.element);
        return obj;
    }

    function BuildFlow(nodesToMerge) {
        let res = {};
        for (const nodeToMerge of nodesToMerge) {
            const subtype = nodeToMerge.subtype;
            const nodesOfType = nodesToMerge.filter(node => subtype === node.subtype);
            res = convertFlowNodes(res, nodesOfType, subtype);
        }
        return res;
    }

    class FlowElementConnector {
        constructor(type, element, args) {
            this.element = {};
            this.processed = false;
            this.type = type;
            this.element = element;
            this.childName = args.childName ? args.childName : undefined;
            this.childOf = args.childOf ? args.childOf : undefined;
            if (element && element['targetReference']) {
                this.reference = element['targetReference'];
            }
        }
    }

    class FlowElement {
        constructor(metaType, subtype, element) {
            this.element = {};
            this.element = element;
            this.subtype = subtype;
            this.metaType = metaType;
        }
    }

    class FlowNode extends FlowElement {
        constructor(provName, subtype, element) {
            super('node', subtype, element);
            this.connectors = [];
            let nodeName = subtype === 'start' ? 'flowstart' : provName;
            this.name = nodeName;
            const connectors = this.getConnectors(subtype, element);
            this.connectors = connectors;
            this.locationX = element["locationX"];
            this.locationY = element["locationY"];
        }
        getConnectors(subtype, element) {
            var _a;
            if (subtype === 'start') {
                const connectors = [];
                if (element.connector) {
                    connectors.push(new FlowElementConnector('connector', element.connector, {}));
                }
                if (Array.isArray(element.scheduledPaths)) {
                    for (const asyncElement of element === null || element === void 0 ? void 0 : element.scheduledPaths) {
                        if (asyncElement.connector) {
                            connectors.push(new FlowElementConnector('connector', asyncElement.connector, {
                                childName: (_a = asyncElement === null || asyncElement === void 0 ? void 0 : asyncElement.name) !== null && _a !== void 0 ? _a : 'AsyncAfterCommit',
                                childOf: 'scheduledPaths'
                            }));
                        }
                    }
                }
                else {
                    if (element.scheduledPaths) {
                        connectors.push(new FlowElementConnector('connector', element.scheduledPaths, {
                            childName: element.scheduledPaths.name,
                            childOf: 'scheduledPaths'
                        }));
                    }
                }
                return connectors;
            }
            else if (subtype === 'decisions') {
                const connectors = [];
                if (element.defaultConnector) {
                    connectors.push(new FlowElementConnector('defaultConnector', element.defaultConnector, {}));
                }
                if (element.rules) {
                    if (Array.isArray(element.rules)) {
                        for (const rule of element.rules) {
                            if (rule.connector) {
                                connectors.push(new FlowElementConnector('connector', rule.connector, {
                                    childName: rule.name,
                                    childOf: 'rules'
                                }));
                            }
                        }
                    }
                    else {
                        if (element.rules.connector) {
                            connectors.push(new FlowElementConnector('connector', element.rules.connector, {
                                childName: element.rules.name,
                                childOf: 'rules'
                            }));
                        }
                    }
                }
                return connectors;
            }
            else if (subtype === 'assignments') {
                return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
            }
            else if (subtype === 'loops') {
                const connectors = [];
                if (element.nextValueConnector) {
                    connectors.push(new FlowElementConnector('nextValueConnector', element.nextValueConnector, {}));
                }
                if (element.noMoreValuesConnector) {
                    connectors.push(new FlowElementConnector('noMoreValuesConnector', element.noMoreValuesConnector, {}));
                }
                return connectors;
            }
            else if (subtype === 'actionCalls') {
                const connectors = [];
                if (element.connector) {
                    connectors.push(new FlowElementConnector('connector', element.connector, {}));
                }
                if (element.faultConnector) {
                    connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
                }
                return connectors;
            }
            else if (subtype === 'waits') {
                const connectors = [];
                if (element.defaultConnector) {
                    connectors.push(new FlowElementConnector('defaultConnector', element.defaultConnector, {}));
                }
                if (element.faultConnector) {
                    connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
                }
                if (Array.isArray(element.waitEvents)) {
                    for (const waitEvent of element.waitEvents) {
                        if (waitEvent.connector) {
                            connectors.push(new FlowElementConnector('connector', waitEvent.connector, {
                                childName: waitEvent.name,
                                childOf: 'waitEvents'
                            }));
                        }
                    }
                }
                return connectors;
            }
            else if (subtype === 'recordCreates') {
                const connectors = [];
                if (element.connector) {
                    connectors.push(new FlowElementConnector('connector', element.connector, {}));
                }
                if (element.faultConnector) {
                    connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
                }
                return connectors;
            }
            else if (subtype === 'recordDeletes') {
                const connectors = [];
                if (element.connector) {
                    connectors.push(new FlowElementConnector('connector', element.connector, {}));
                }
                if (element.faultConnector) {
                    connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
                }
                return connectors;
            }
            else if (subtype === 'recordLookups') {
                const connectors = [];
                if (element.connector) {
                    connectors.push(new FlowElementConnector('connector', element.connector, {}));
                }
                if (element.faultConnector) {
                    connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
                }
                return connectors;
            }
            else if (subtype === 'recordUpdates') {
                const connectors = [];
                if (element.connector) {
                    connectors.push(new FlowElementConnector('connector', element.connector, {}));
                }
                if (element.faultConnector) {
                    connectors.push(new FlowElementConnector('faultConnector', element.faultConnector, {}));
                }
                return connectors;
            }
            else if (subtype === 'subflows') {
                return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
            }
            else if (subtype === 'screens') {
                return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
            }
            else {
                return element.connector ? [new FlowElementConnector('connector', element.connector, {})] : [];
            }
        }
    }

    class Compiler {
        constructor() {
            this.visitedElements = new Set();
        }
        traverseFlow(flow, startElementName, visitCallback, endElementName) {
            // Iterative Deepening Depth-First Search (IDDFS)
            let elementsToVisit = [startElementName];
            while (elementsToVisit.length > 0) {
                const nextElements = [];
                for (const elementName of elementsToVisit) {
                    if (!this.visitedElements.has(elementName)) {
                        const currentElement = flow.elements.find(element => element instanceof FlowNode && element.name === elementName);
                        if (currentElement) {
                            visitCallback(currentElement);
                            this.visitedElements.add(elementName);
                            nextElements.push(...this.findNextElements(flow, currentElement, endElementName));
                        }
                    }
                }
                if (nextElements.length === 0) { // If no more next elements
                    break; // Terminate the traversal
                }
                elementsToVisit = nextElements;
            }
        }
        findNextElements(flow, currentElement, endElementName) {
            const nextElements = [];
            if (currentElement.connectors && currentElement.connectors.length > 0) {
                for (const connector of currentElement.connectors) {
                    if (connector.reference) {
                        // Check if the reference exists in the flow elements
                        const nextElement = flow.elements.find(element => element instanceof FlowNode && element.name === connector.reference);
                        if (nextElement instanceof FlowNode && nextElement.name !== endElementName) {
                            nextElements.push(nextElement.name);
                        }
                    }
                }
            }
            return nextElements;
        }
    }

    class FlowMetadata extends FlowElement {
        constructor(subtype, element) {
            super('metadata', subtype, element);
        }
    }

    class FlowVariable extends FlowElement {
        constructor(name, subtype, element) {
            super('variable', subtype, element);
            this.name = name;
            this.dataType = element["dataType"];
        }
    }

    class FlowResource extends FlowElement {
        constructor(name, subtype, element) {
            super('resource', subtype, element);
            this.name = name;
        }
    }

    class Flow {
        constructor(flowName, data) {
            this.flowVariables = [
                "choices",
                "constants",
                "dynamicChoiceSets",
                "formulas",
                "variables",
            ];
            this.flowResources = ["textTemplates", "stages"];
            this.flowMetadata = [
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
            this.flowNodes = [
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
            this.name = flowName;
            if (data) {
                if (data.Flow) {
                    this.xmldata = data.Flow;
                }
                else
                    this.xmldata = data;
                this.preProcessNodes();
            }
        }
        preProcessNodes() {
            this.label = this.xmldata.label;
            this.interviewLabel = this.xmldata.interviewLabel;
            this.processType = this.xmldata.processType;
            this.processMetadataValues = this.xmldata.processMetadataValues;
            this.startElementReference = this.xmldata.startElementReference;
            this.start = this.xmldata.start;
            this.status = this.xmldata.status;
            this.type = this.xmldata.processType;
            const allNodes = [];
            for (const nodeType in this.xmldata) {
                // skip xmlns url
                // if (nodeType == "@xmlns") {
                //   continue;
                // }
                let data = this.xmldata[nodeType];
                if (this.flowMetadata.includes(nodeType)) {
                    if (Array.isArray(data)) {
                        for (const node of data) {
                            allNodes.push(new FlowMetadata(nodeType, node));
                        }
                        for (const node of data) {
                        }
                    }
                    else {
                        allNodes.push(new FlowMetadata(nodeType, data));
                    }
                }
                else if (this.flowVariables.includes(nodeType)) {
                    if (Array.isArray(data)) {
                        for (const node of data) {
                            allNodes.push(new FlowVariable(node.name, nodeType, node));
                        }
                    }
                    else {
                        allNodes.push(new FlowVariable(data.name, nodeType, data));
                    }
                }
                else if (this.flowNodes.includes(nodeType)) {
                    if (Array.isArray(data)) {
                        for (const node of data) {
                            allNodes.push(new FlowNode(node.name, nodeType, node));
                        }
                    }
                    else {
                        allNodes.push(new FlowNode(data.name, nodeType, data));
                    }
                }
                else if (this.flowResources.includes(nodeType)) {
                    if (Array.isArray(data)) {
                        for (const node of data) {
                            allNodes.push(new FlowResource(node.name, nodeType, node));
                        }
                    }
                    else {
                        allNodes.push(new FlowResource(data.name, nodeType, data));
                    }
                }
            }
            this.elements = allNodes;
            this.startReference = this.findStart();
        }
        findStart() {
            let start = "";
            const flowElements = this.elements.filter((node) => node instanceof FlowNode);
            if (this.startElementReference) {
                start = this.startElementReference;
            }
            else if (flowElements.find((n) => {
                return n.subtype === "start";
            })) {
                let startElement = flowElements.find((n) => {
                    return n.subtype === "start";
                });
                start = startElement.connectors[0]["reference"];
            }
            return start;
        }
    }

    class FlowAttribute {
        constructor(name, subtype, expression) {
            this.metaType = 'attribute';
            this.name = name;
            this.subtype = subtype;
            this.expression = expression;
        }
    }

    class FlowType {
    }
    FlowType.backEndTypes = ['AutoLaunchedFlow', 'CustomEvent', 'InvocableProcess', 'Orchestrator', 'EvaluationFlow', 'ActionCadenceAutolaunchedFlow'];
    FlowType.processBuilder = ['Workflow'];
    FlowType.surveyTypes = ['Survey'];
    FlowType.visualTypes = ['Flow', 'IndividualObjectLinkingFlow', 'LoginFlow', 'RoutingFlow', 'Appointments', 'ActionCadenceStepFlow', 'ContactRequestFlow', 'ContactRequestFlow', 'CustomerLifecycle', 'FieldServiceMobile', 'FieldServiceWeb', 'SurveyEnrich'];
    FlowType.unsupportedTypes = ['CheckoutFlow', 'FSCLending', 'FSCLending', 'LoyaltyManagementFlow'];
    FlowType.allTypes = function () {
        return [...this.backEndTypes, ...this.visualTypes, ...this.surveyTypes];
    };

    class ResultDetails {
        constructor(violation) {
            this.violation = violation;
            this.name = violation.name;
            this.metaType = violation.metaType;
            this.type = violation.subtype;
            if (violation.metaType === 'variable') {
                let element = violation;
                this.details = { dataType: element.dataType };
            }
            if (violation.metaType === 'node') {
                let element = violation;
                this.details = { locationX: element.locationX, locationY: element.locationY, connectsTo: element.connectors.map(connector => connector.reference) };
            }
            if (violation.metaType === 'attribute') {
                let element = violation;
                this.details = { expression: element.expression };
            }
        }
    }

    class RuleResult {
        constructor(info, details, errorMessage) {
            this.details = [];
            this.ruleDefinition = info;
            this.ruleName = info.name;
            this.severity = info.severity ? info.severity : 'error';
            this.occurs = false;
            this.details = details;
            if (details.length > 0) {
                this.occurs = true;
            }
            if (errorMessage) {
                this.errorMessage = errorMessage;
            }
        }
    }

    class ScanResult {
        constructor(flow, ruleResults) {
            this.flow = flow;
            this.ruleResults = ruleResults;
        }
    }

    function FixFlows(flow, ruleResults) {
        const unusedVariableRes = ruleResults.find((r) => r.ruleName === 'UnusedVariable');
        const unusedVariableReferences = (unusedVariableRes && unusedVariableRes.details && unusedVariableRes.details.length > 0) ? unusedVariableRes.details.map((d) => d.name) : [];
        const unconnectedElementsRes = ruleResults.find((r) => r.ruleName === 'UnconnectedElement');
        const unconnectedElementsReferences = (unconnectedElementsRes && unconnectedElementsRes.details && unconnectedElementsRes.details.length > 0) ? unconnectedElementsRes.details.map((d) => d.name) : [];
        const nodesToBuild = flow.elements.filter(node => {
            switch (node.metaType) {
                case 'variable':
                    const nodeVar = node;
                    if (!unusedVariableReferences.includes(nodeVar.name)) {
                        return node;
                    }
                    break;
                case 'node':
                    const nodeElement = node;
                    if (!unconnectedElementsReferences.includes(nodeElement.name)) {
                        return node;
                    }
                    break;
                case 'metadata':
                    return node;
                case 'resource':
                    return node;
            }
        });
        let xmldata = BuildFlow(nodesToBuild);
        const newFlow = new Flow(flow.name, xmldata);
        return newFlow;
    }

    class RuleCommon {
        constructor(info, optional) {
            this.docRefs = [];
            this.name = info.name;
            this.supportedTypes = info.supportedTypes;
            this.label = info.label;
            this.description = info.description;
            this.uri = 'https://github.com/Lightning-Flow-Scanner/lightning-flow-scanner-core/tree/master/src/main/rules/' + info.name + '.ts';
            this.docRefs = info.docRefs;
            this.isConfigurable = info.isConfigurable;
            this.autoFixable = info.autoFixable;
            this.severity = (optional && optional.severity) ? optional.severity : 'error';
        }
    }

    class APIVersion extends RuleCommon {
        constructor() {
            super({
                name: 'APIVersion',
                label: 'Outdated API Version',
                description: "Introducing newer API components may lead to unexpected issues with older versions of Flows, as they might not align with the underlying mechanics. Starting from API version 50.0, the 'Api Version' attribute has been readily available on the Flow Object. To ensure smooth operation and reduce discrepancies between API versions, it is strongly advised to regularly update and maintain them.",
                supportedTypes: FlowType.allTypes(),
                docRefs: [],
                isConfigurable: true,
                autoFixable: false
            });
        }
        execute(flow, options) {
            let flowAPIVersionNumber;
            if (flow.xmldata.apiVersion) {
                const flowAPIVersion = flow.xmldata.apiVersion;
                flowAPIVersionNumber = +flowAPIVersion;
            }
            if (flowAPIVersionNumber) {
                if (options && options.expression) {
                    const expressionEvaluation = eval(flowAPIVersionNumber + options.expression);
                    return (!expressionEvaluation ?
                        new RuleResult(this, [new ResultDetails(new FlowAttribute(!expressionEvaluation ? ('' + flowAPIVersionNumber) : undefined, "apiVersion", options.expression))]) :
                        new RuleResult(this, []));
                }
                else {
                    return new RuleResult(this, []);
                }
            }
            else {
                return new RuleResult(this, [new ResultDetails(new FlowAttribute('API Version <49', "apiVersion", "<49"))]);
            }
        }
    }

    class AutoLayout extends RuleCommon {
        constructor() {
            super({
                name: 'AutoLayout',
                label: 'Auto-Layout Mode',
                description: "With Canvas Mode set to Auto-Layout, Elements are spaced, connected, and aligned automatically, keeping your Flow neatly organized thus saving you time.",
                supportedTypes: FlowType.allTypes(),
                docRefs: [],
                isConfigurable: true,
                autoFixable: false
            });
        }
        execute(flow, options) {
            var _a;
            if (flow.processMetadataValues) {
                const CanvasMode = flow.xmldata.processMetadataValues.find(mdv => mdv.name === 'CanvasMode');
                const AutoLayout = CanvasMode.value && typeof CanvasMode.value === 'object' && CanvasMode.value.stringValue && CanvasMode.value.stringValue === "AUTO_LAYOUT_CANVAS";
                return (!AutoLayout ?
                    new RuleResult(this, [new ResultDetails(new FlowAttribute((_a = CanvasMode.value) === null || _a === void 0 ? void 0 : _a.stringValue, "CanvasMode", '!== AUTO_LAYOUT_CANVAS'))]) :
                    new RuleResult(this, []));
            }
        }
    }

    class CopyAPIName extends RuleCommon {
        constructor() {
            super({
                name: 'CopyAPIName',
                label: 'Copy API Name',
                description: "Maintaining multiple elements with a similar name, like 'Copy_X_Of_Element,' can diminish the overall readability of your Flow. When copying and pasting these elements, it's crucial to remember to update the API name of the newly created copy.",
                supportedTypes: FlowType.allTypes(),
                docRefs: [],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const flowElements = flow.elements.filter(node => node instanceof FlowNode);
            const copyOfElements = [];
            for (const element of flowElements) {
                const copyOf = new RegExp('Copy_[0-9]+_of_[A-Za-z0-9]+').test(element.name);
                if (copyOf) {
                    copyOfElements.push(element);
                }
            }
            let results = [];
            for (const det of copyOfElements) {
                results.push(new ResultDetails(det));
            }
            return new RuleResult(this, results);
        }
    }

    class DMLStatementInLoop extends RuleCommon {
        constructor() {
            super({
                name: 'DMLStatementInLoop',
                label: 'DML Statement In A Loop',
                description: "To prevent exceeding Apex governor limits, it is advisable to consolidate all your database operations, including record creation, updates, or deletions, at the conclusion of the flow.",
                supportedTypes: FlowType.backEndTypes,
                docRefs: [{ 'label': 'Flow Best Practices', 'path': 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const dmlStatementTypes = ['recordDeletes', 'recordUpdates', 'recordCreates'];
            const loopElements = flow.elements.filter(node => node.subtype === 'loops');
            const dmlStatementsInLoops = [];
            const findDML = (element) => {
                if (dmlStatementTypes.includes(element.subtype)) {
                    dmlStatementsInLoops.push(element);
                }
            };
            for (const element of loopElements) {
                let loopEnd;
                // Check if 'noMoreValuesConnector' attribute exists
                if (element.element['noMoreValuesConnector'] && element.element['noMoreValuesConnector'][0]) {
                    loopEnd = element.element['noMoreValuesConnector'][0].targetReference[0];
                }
                else {
                    loopEnd = element.name;
                }
                new Compiler().traverseFlow(flow, element.name, findDML, loopEnd);
            }
            // Create result details
            const results = dmlStatementsInLoops.map(det => new ResultDetails(det));
            return new RuleResult(this, results);
        }
    }

    class DuplicateDMLOperation extends RuleCommon {
        constructor() {
            super({
                name: "DuplicateDMLOperation",
                label: "Duplicate DML Operation",
                description: "When the flow executes database changes or actions between two screens, it's important to prevent users from navigating back between screens. Failure to do so may result in duplicate database operations being performed within the flow.",
                supportedTypes: FlowType.visualTypes,
                docRefs: [],
                isConfigurable: false,
                autoFixable: false,
            });
        }
        execute(flow) {
            const flowElements = flow.elements.filter((node) => node instanceof FlowNode);
            const processedElementIndexes = [];
            const unconnectedElementIndexes = [];
            const DuplicateDMLOperations = [];
            const startingNode = this.findStart(flow);
            if (!startingNode || startingNode === -1) {
                throw "Can not find starting element";
            }
            let dmlFlag = false;
            let indexesToProcess = [startingNode];
            do {
                indexesToProcess = indexesToProcess.filter((index) => !processedElementIndexes.includes(index));
                if (indexesToProcess.length > 0) {
                    for (const [index, element] of flowElements.entries()) {
                        if (indexesToProcess.includes(index)) {
                            const references = [];
                            if (element.connectors && element.connectors.length > 0) {
                                for (const connector of element.connectors) {
                                    if (connector.reference) {
                                        references.push(connector.reference);
                                    }
                                }
                            }
                            dmlFlag = this.flagDML(element, dmlFlag);
                            if (references.length > 0) {
                                const elementsByReferences = flowElements.filter((element) => references.includes(element.name));
                                for (const nextElement of elementsByReferences) {
                                    const nextIndex = flowElements.findIndex((element) => nextElement.name === element.name);
                                    if ("screens" === nextElement.subtype) {
                                        if (dmlFlag &&
                                            nextElement.element["allowBack"] &&
                                            nextElement.element["allowBack"] == "true" &&
                                            nextElement.element["showFooter"] == "true") {
                                            DuplicateDMLOperations.push(nextElement);
                                        }
                                    }
                                    if (!processedElementIndexes.includes(nextIndex)) {
                                        indexesToProcess.push(nextIndex);
                                    }
                                }
                            }
                            processedElementIndexes.push(index);
                        }
                    }
                }
                else {
                    // skip unconnected elements
                    for (const index of flowElements.keys()) {
                        if (!processedElementIndexes.includes(index)) {
                            unconnectedElementIndexes.push(index);
                        }
                    }
                }
            } while (processedElementIndexes.length + unconnectedElementIndexes.length <
                flowElements.length);
            let results = [];
            for (const det of DuplicateDMLOperations) {
                results.push(new ResultDetails(det));
            }
            return new RuleResult(this, results);
        }
        flagDML(element, dmlFlag) {
            const dmlStatementTypes = [
                "recordDeletes",
                "recordUpdates",
                "recordCreates",
            ];
            if (dmlStatementTypes.includes(element.subtype)) {
                return true;
            }
            else if (dmlFlag === true &&
                element.subtype === "screens" &&
                element.element["allowBack"] &&
                element.element["allowBack"] == "true") {
                return false;
            }
            else {
                return dmlFlag;
            }
        }
        findStart(flow) {
            const flowElements = flow.elements.filter((node) => node instanceof FlowNode);
            let start;
            if (flow.startElementReference) {
                start = flowElements.findIndex((n) => {
                    return n.name == flow.startElementReference;
                });
            }
            else {
                start = flowElements.findIndex((n) => {
                    return n.subtype === "start";
                });
            }
            return start;
        }
    }

    class FlowDescription extends RuleCommon {
        constructor() {
            super({
                name: 'FlowDescription',
                label: 'Missing Flow Description',
                description: "Descriptions play a vital role in documentation. We highly recommend including details about where they are used and their intended purpose.",
                supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
                docRefs: [],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const missingFlowDescription = !flow.xmldata.description;
            return (missingFlowDescription ?
                new RuleResult(this, [new ResultDetails(new FlowAttribute('undefined', "description", "!==null"))]) :
                new RuleResult(this, []));
        }
    }

    class FlowName extends RuleCommon {
        constructor() {
            super({
                name: 'FlowName',
                label: 'Flow Naming Convention',
                description: "The readability of a flow is of utmost importance. Establishing a naming convention for the Flow Name significantly enhances findability, searchability, and maintains overall consistency. It is advisable to include at least a domain and a brief description of the actions carried out in the flow, for instance, 'Service_OrderFulfillment'.",
                supportedTypes: FlowType.allTypes(),
                docRefs: [{ 'label': "Naming your Flows is more critical than ever. By Stephen Church", 'path': 'https://www.linkedin.com/posts/stephen-n-church_naming-your-flows-this-is-more-critical-activity-7099733198175158274-1sPx?utm_source=share&utm_medium=member_desktop' }],
                isConfigurable: true,
                autoFixable: false
            });
        }
        execute(flow, options) {
            const regexExp = (options && options.expression) ? options.expression : '[A-Za-z0-9]+_[A-Za-z0-9]+';
            const conventionApplied = new RegExp(regexExp).test(flow.name);
            return (!conventionApplied ?
                new RuleResult(this, [new ResultDetails(new FlowAttribute(flow.name, 'name', regexExp))]) :
                new RuleResult(this, []));
        }
    }

    class InactiveFlow extends RuleCommon {
        constructor() {
            super({
                name: 'InactiveFlow',
                label: 'Inactive Flow',
                description: 'Like cleaning out your closet: deleting unused flows is essential. Inactive flows can still cause trouble, like accidentally deleting records during testing, or being activated as subflows within parent flows.',
                supportedTypes: FlowType.allTypes(),
                docRefs: [],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const inactiveFlows = [];
            for (const node of flow.elements) {
                const nodeElementString = JSON.stringify(node.element);
                if (node.subtype == "status" && nodeElementString != '\"Active\"') {
                    inactiveFlows.push(node);
                }
            }
            let results = [];
            for (const det of inactiveFlows) {
                results.push(new ResultDetails(det));
            }
            return new RuleResult(this, results);
        }
    }

    class MissingFaultPath extends RuleCommon {
        constructor() {
            super({
                name: 'MissingFaultPath',
                label: 'Missing Fault Path',
                description: "At times, a flow may fail to execute a configured operation as intended. By default, the flow displays an error message to the user and notifies the admin who created the flow via email. However, you can customize this behavior by incorporating a Fault Path.",
                supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
                docRefs: [{ label: 'Flow Best Practices', path: 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const compiler = new Compiler();
            const results = [];
            const elementsWhereFaultPathIsApplicable = flow.elements.filter((node) => node instanceof FlowNode && ['recordLookups', 'recordDeletes', 'recordUpdates', 'recordCreates', 'waits', 'actionCalls'].includes(node.subtype)).map((e) => e.name);
            const visitCallback = (element) => {
                // Check if the element should have a fault path
                if (!element.connectors.find((connector) => connector.type === 'faultConnector') && elementsWhereFaultPathIsApplicable.includes(element.name)) {
                    // Check if the element is part of another fault path
                    if (!this.isPartOfFaultHandlingFlow(element, flow)) {
                        results.push(new ResultDetails(element));
                    }
                }
            };
            // Use the core.Compiler for traversal
            compiler.traverseFlow(flow, flow.startReference, visitCallback);
            return new RuleResult(this, results);
        }
        isPartOfFaultHandlingFlow(element, flow) {
            const flowelements = flow.elements.filter(el => el instanceof FlowNode);
            for (const otherElement of flowelements) {
                if (otherElement !== element) {
                    // Check if the otherElement has a faultConnector pointing to element
                    if (otherElement.connectors.find((connector) => connector.type === 'faultConnector' && connector.reference === element.name)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    class MissingNullHandler extends RuleCommon {
        constructor() {
            super({
                name: 'MissingNullHandler',
                label: 'Missing Null Handler',
                description: "When a Get Records operation doesn't find any data, it returns null. To ensure data validation, utilize a decision element on the operation result variable to check for a non-null result.",
                supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
                docRefs: [],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const getOperations = ['recordLookups'];
            const getOperationElements = flow.elements.filter(node => node.metaType === 'node' && getOperations.includes(node.subtype));
            const decisionElements = flow.elements.filter(node => node.metaType === 'node' && node.subtype === 'decisions');
            const getOperationsWithoutNullHandler = [];
            for (const getElement of getOperationElements) {
                const elementName = getElement.name;
                let nullCheckFound = false;
                let resultReferences = [];
                if (getElement.element['storeOutputAutomatically']) {
                    resultReferences = [elementName];
                }
                else if (getElement.element['outputReference']) {
                    resultReferences = getElement.element['outputReference'];
                }
                else if (getElement.element['outputAssignments']) {
                    const outputAssignments = getElement.element['outputAssignments'];
                    for (const assignment of outputAssignments) {
                        resultReferences.push(assignment.assignToReference);
                    }
                }
                for (const el of decisionElements) {
                    const rules = el.element['rules'];
                    for (const rule of rules) {
                        for (const condition of rule.conditions) {
                            let referenceFound = false;
                            let isNullOperator = false;
                            let checksIfFalse = false;
                            if (condition.leftValueReference && condition.leftValueReference.length > 0) {
                                let valueReference = condition.leftValueReference[0];
                                for (let ref of resultReferences) {
                                    referenceFound = ref.includes(valueReference);
                                    if (referenceFound) {
                                        break;
                                    }
                                }
                            }
                            if (condition.operator && condition.operator.length > 0) {
                                let operator = condition.operator[0];
                                isNullOperator = (operator === 'IsNull');
                            }
                            if (condition.rightValue && condition.rightValue.length > 0 && condition.rightValue[0].booleanValue && condition.rightValue[0].booleanValue.length > 0) {
                                let rightValue = condition.rightValue[0].booleanValue[0];
                                checksIfFalse = (rightValue.toLowerCase() === 'false');
                            }
                            if (referenceFound && isNullOperator && checksIfFalse) {
                                nullCheckFound = true;
                            }
                        }
                    }
                }
                if (!nullCheckFound) {
                    getOperationsWithoutNullHandler.push(getElement);
                }
            }
            let results = [];
            for (const det of getOperationsWithoutNullHandler) {
                results.push(new ResultDetails(det));
            }
            return new RuleResult(this, results);
        }
    }

    class ProcessBuilder extends RuleCommon {
        constructor() {
            super({
                name: 'ProcessBuilder',
                label: 'No Process Builder',
                description: "Salesforce is transitioning away from Workflow Rules and Process Builder in favor of Flow. Ensure you're prepared for this transition by migrating your organization's automation to Flow. Refer to official documentation for more information on the transition process and tools available.",
                supportedTypes: FlowType.processBuilder,
                docRefs: [{ 'label': 'Process Builder Retirement', 'path': 'https://help.salesforce.com/s/articleView?id=000389396&type=1' }],
                isConfigurable: true,
                autoFixable: false
            });
        }
        execute(flow, options) {
            return new RuleResult(this, [new ResultDetails(new FlowAttribute('Workflow', "processType", '== Workflow'))]);
        }
    }

    class SOQLQueryInLoop extends RuleCommon {
        constructor() {
            super({
                name: 'SOQLQueryInLoop',
                label: 'SOQL Query In A Loop',
                description: "To prevent exceeding Apex governor limits, it is advisable to consolidate all your SOQL queries at the conclusion of the flow.",
                supportedTypes: FlowType.backEndTypes,
                docRefs: [{ 'label': 'Flow Best Practices', 'path': 'https://help.salesforce.com/s/articleView?id=sf.flow_prep_bestpractices.htm&type=5' }],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const dmlStatementTypes = ['recordLookups'];
            const loopElements = flow.elements.filter(node => node.subtype === 'loops');
            const soqlStatementsInLoops = [];
            const findDML = (element) => {
                if (dmlStatementTypes.includes(element.subtype)) {
                    soqlStatementsInLoops.push(element);
                }
            };
            for (const element of loopElements) {
                let loopEnd;
                // Check if 'noMoreValuesConnector' attribute exists
                if (element.element['noMoreValuesConnector'] && element.element['noMoreValuesConnector']) {
                    loopEnd = element.element['noMoreValuesConnector'].targetReference;
                }
                else {
                    loopEnd = element.name;
                }
                new Compiler().traverseFlow(flow, element.name, findDML, loopEnd);
            }
            // Create result details
            const results = soqlStatementsInLoops.map(det => new ResultDetails(det));
            return new RuleResult(this, results);
        }
    }

    class UnconnectedElement extends RuleCommon {
        constructor() {
            super({
                name: 'UnconnectedElement',
                label: 'Unconnected Element',
                description: "To maintain the efficiency and manageability of your Flow, it's best to avoid including unconnected elements that are not in use.",
                supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
                docRefs: [],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const connectedElements = new Set();
            // Callback function to log connected elements
            const logConnected = (element) => {
                connectedElements.add(element.name);
            };
            // Get Traversable Nodes
            const flowElements = flow.elements.filter(node => node instanceof FlowNode);
            // Find start of Flow
            const startIndex = this.findStart(flowElements);
            // Start traversal from the start node
            if (startIndex !== -1) {
                new Compiler().traverseFlow(flow, flowElements[startIndex].name, logConnected);
            }
            const unconnectedElements = flowElements.filter(element => !connectedElements.has(element.name));
            // Create result details
            const results = unconnectedElements.map(det => new ResultDetails(det));
            return new RuleResult(this, results);
        }
        findStart(nodes) {
            return nodes.findIndex(n => {
                return n.subtype === 'start';
            });
        }
    }

    class UnusedVariable extends RuleCommon {
        constructor() {
            super({
                name: 'UnusedVariable',
                label: 'Unused Variable',
                description: "To maintain the efficiency and manageability of your Flow, it's advisable to avoid including unconnected variables that are not in use.",
                supportedTypes: [...FlowType.backEndTypes, ...FlowType.visualTypes],
                docRefs: [],
                isConfigurable: false,
                autoFixable: false
            });
        }
        execute(flow) {
            const unusedVariables = [];
            for (const variable of flow.elements.filter(node => node instanceof FlowVariable)) {
                const variableName = variable.name;
                if ([...JSON.stringify(flow.elements.filter(node => node instanceof FlowNode)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index).length === 0) {
                    // if not found in any inside of flow elements
                    if ([...JSON.stringify(flow.elements.filter(node => node instanceof FlowResource)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index).length === 0) {
                        const insideCounter = [...JSON.stringify(variable).matchAll(new RegExp(variable.name, 'gi'))].map(a => a.index);
                        const variableUsage = [...JSON.stringify(flow.elements.filter(node => node instanceof FlowVariable)).matchAll(new RegExp(variableName, 'gi'))].map(a => a.index);
                        // finally also checks indexes where name occurs in the variable itself and where name occurs in all variables
                        // when this is the same, variable must be unused.
                        if (variableUsage.length === insideCounter.length) {
                            unusedVariables.push(variable);
                        }
                    }
                }
            }
            let results = [];
            for (const det of unusedVariables) {
                results.push(new ResultDetails(det));
            }
            return new RuleResult(this, results);
        }
    }

    const DefaultRuleStore = {
        APIVersion,
        AutoLayout,
        CopyAPIName,
        DMLStatementInLoop,
        DuplicateDMLOperation,
        FlowDescription,
        FlowName,
        MissingFaultPath,
        MissingNullHandler,
        ProcessBuilder,
        SOQLQueryInLoop,
        UnconnectedElement,
        UnusedVariable,
        InactiveFlow,
    };

    class DynamicRule {
        constructor(className) {
            if (DefaultRuleStore[className] === undefined || DefaultRuleStore[className] === null) {
                throw new Error(`Rule \'${className}\' does not exist in the store.`);
            }
            return new DefaultRuleStore[className]();
        }
    }

    function GetRuleDefinitions(ruleConfig) {
        const selectedRules = [];
        if (ruleConfig && ruleConfig instanceof Map) {
            for (const ruleName of ruleConfig.keys()) {
                let severity = "error";
                try {
                    const configuredSeverity = ruleConfig.get(ruleName)["severity"];
                    if (configuredSeverity &&
                        (configuredSeverity === "error" ||
                            configuredSeverity === "warning" ||
                            configuredSeverity === "note")) {
                        severity = configuredSeverity;
                    }
                    const matchedRule = new DynamicRule(ruleName);
                    matchedRule["severity"] = severity;
                    selectedRules.push(matchedRule);
                }
                catch (error) {
                    console.log(error.message);
                }
            }
        }
        else {
            // tslint:disable-next-line:forin
            for (const rule in DefaultRuleStore) {
                const matchedRule = new DynamicRule(rule);
                matchedRule["severity"] = "error";
                selectedRules.push(matchedRule);
            }
        }
        return selectedRules;
    }

    function ScanFlows(flows, ruleOptions) {
        const flowResults = [];
        let selectedRules = [];
        if (ruleOptions && ruleOptions.rules) {
            const ruleMap = new Map();
            for (const [ruleName, rule] of Object.entries(ruleOptions.rules)) {
                ruleMap.set(ruleName, rule);
            }
            selectedRules = GetRuleDefinitions(ruleMap);
        }
        else {
            selectedRules = GetRuleDefinitions();
        }
        for (const flow of flows) {
            const ruleResults = [];
            for (const rule of selectedRules) {
                try {
                    if (rule.supportedTypes.includes(flow.type)) {
                        let config = undefined;
                        if (ruleOptions &&
                            ruleOptions["rules"] &&
                            ruleOptions["rules"][rule.name]) {
                            config = ruleOptions["rules"][rule.name];
                        }
                        const result = config && Object.keys(config).length > 0
                            ? rule.execute(flow, config)
                            : rule.execute(flow);
                        if (result.severity !== rule.severity) {
                            result.severity = rule.severity;
                        }
                        ruleResults.push(result);
                    }
                    else {
                        ruleResults.push(new RuleResult(rule, []));
                    }
                }
                catch (error) {
                    let message = "Something went wrong while executing " +
                        rule.name +
                        " in the Flow: '" +
                        flow.name;
                    ruleResults.push(new RuleResult(rule, [], message));
                }
            }
            flowResults.push(new ScanResult(flow, ruleResults));
        }
        return flowResults;
    }

    function getRules(ruleNames) {
        if (ruleNames && ruleNames.length > 0) {
            const ruleSeverityMap = new Map(ruleNames.map((name) => [name, 'error']));
            return GetRuleDefinitions(ruleSeverityMap);
        }
        else {
            return GetRuleDefinitions();
        }
    }
    function scan(parsedFlows, ruleOptions) {
        let flows = [];
        for (let flow of parsedFlows) {
            if (!flow.errorMessage && flow.flow) {
                flows.push(flow.flow);
            }
        }
        let scanResults;
        if ((ruleOptions === null || ruleOptions === void 0 ? void 0 : ruleOptions.rules) && Object.entries(ruleOptions.rules).length > 0) {
            scanResults = ScanFlows(flows, ruleOptions);
        }
        else {
            scanResults = ScanFlows(flows);
        }
        if (ruleOptions === null || ruleOptions === void 0 ? void 0 : ruleOptions.exceptions) {
            for (const [exceptionName, exceptionElements] of Object.entries(ruleOptions.exceptions)) {
                for (const scanResult of scanResults) {
                    if (scanResult.flow.name === exceptionName) {
                        for (const ruleResult of scanResult.ruleResults) {
                            if (exceptionElements[ruleResult.ruleName]) {
                                const exceptions = exceptionElements[ruleResult.ruleName];
                                const filteredDetails = ruleResult.details.filter((detail) => {
                                    return !exceptions.includes(detail.name);
                                });
                                ruleResult.details = filteredDetails;
                                ruleResult.occurs = filteredDetails.length > 0;
                            }
                        }
                    }
                }
            }
        }
        return scanResults;
    }
    function fix(results) {
        let newResults = [];
        for (let result of results) {
            if (result.ruleResults && result.ruleResults.length > 0) {
                let fixables = result.ruleResults.filter((r) => r.ruleName === 'UnusedVariable' && r.occurs || r.ruleName === 'UnconnectedElement' && r.occurs);
                if (fixables && fixables.length > 0) {
                    const newFlow = FixFlows(result.flow, fixables);
                    result.flow = newFlow;
                    newResults.push(result);
                }
            }
        }
        return newResults;
    }

    exports.Compiler = Compiler;
    exports.Flow = Flow;
    exports.FlowAttribute = FlowAttribute;
    exports.FlowElement = FlowElement;
    exports.FlowNode = FlowNode;
    exports.FlowResource = FlowResource;
    exports.FlowType = FlowType;
    exports.FlowVariable = FlowVariable;
    exports.ResultDetails = ResultDetails;
    exports.RuleResult = RuleResult;
    exports.ScanResult = ScanResult;
    exports.fix = fix;
    exports.getRules = getRules;
    exports.scan = scan;

}));
