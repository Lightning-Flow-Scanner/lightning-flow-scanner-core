import p from "path-browserify";
import { Flow } from '../models/Flow';
import * as fs from 'fs';
import { convert } from  'xmlbuilder2';

export async function ParseFlows(selectedUris: string[]) {

  let parsedFlows: Flow[] = [];
  for (let uri of selectedUris) {
    try {
      let content = await fs.readFileSync(p.normalize(uri));
      let xmlString = content.toString();
      const flowObj = convert(xmlString, { format: 'object' });
      parsedFlows.push(new Flow(
        {
          'path': uri,
          xmldata: flowObj
        }));
    } catch (e) {
      // todo catch error
    }
  }
  return parsedFlows;
}
