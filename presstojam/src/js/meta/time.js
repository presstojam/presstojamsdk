import { Field } from "./field.js"

export class Time extends Field {

    constructor(name, obj) {
        super(name);
        if (obj) this.apply(obj);
    }


    addAPIParam(obj, val) {
        let cobj = {};
        if (val) {
            if (val.min) cobj.min = val.min;
            if (val.max) cobj.max = val.max;
            if (Object.keys(cobj).length > 0) {
                obj[this._name] = cobj;
            }
        }
    }

    
    getChange1(store) {
        if (store.change == null) store.change = store.value;
        if (!store.change) return "";
        return store.change.min;
    }


    setChange1(store, val) {
        if (!store.change) store.change = { min: null, max: null };
        store.change.min = this.clean(val);
        store.error = this.validate(val);
    }


    getChange2(store) {
        if (store.change == null) store.change = store.value;
        if (!store.change) return "";
        return store.change.max;
    }


    setChange2(store, val) {
        if (!store.change) store.change = { min: null, max: null };
        store.change.max = this.clean(val);
        store.error = this.validate(val);
    }
}