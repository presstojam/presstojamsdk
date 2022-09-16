import { ID} from "./id.js"
import { Flag } from "./flag.js"
import { Asset } from "./asset.js"
import { Time } from "./time.js"
import { Number } from "./number.js"
import { String } from "./string.js"

export function createField(field, obj, schema_model) {
    let cell;
    if (obj.type == "id") cell = new ID(field, obj);
    else if (obj.type =="number") cell = new Number(field, obj);
    else if (obj.type == "asset") cell = new Asset(field, obj);
    else if (obj.type == "flag") cell = new Flag(field, obj);
    else if (obj.type == "time") cell = new Time(field, obj);
    else cell = new String(field, obj);
    cell.model = schema_model;
    return cell;
}