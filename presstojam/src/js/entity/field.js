
import { Errors } from "./../error.js"


export class Field {

    constructor(name) {
        this._name = name;
        this._default_val = null;
        this._immutable = false;
        this._min = null;
        this._max = null;
        this._contains = [];
        this._notcontains = [];
        this._model = "";
        this._background = false;
        this._system = false;
        this._summary = false;
        this._where = null;
        this._entity = null;
        this._slug;
        this._disabled = false;
        this._multiple = false;
    }

    buildGetterSetters() {
        const keys = Object.keys(this);
       
        keys.forEach(property => {
          if (property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                   return this[property];
                },
                set: function(newValue) {
                    this[property] = newValue;
                }
            })
          }
        });
    }

    apply(obj) {
        for (let x in obj) {
            if (obj[x] === null) continue;
            if (x == "type") this._type = obj[x].toLowerCase();
            else if (x == "contains" || x == "notcontains") {
                if (obj[x]) this["_" + x] = obj[x].split("|");
            } else this["_" + x] = obj[x];
        }
    }


    clean(val) {
        return val;
    }


    calcValue(value) {
        if (!value) return "";
        else return value;
    }


    validateSize(val) {
        if (this._min !== null && val < this._min) return Errors.MIN_VALUE;
        else if (this._max !== null && val > this._max) return Errors.MAX_VALUE;
        else return Errors.OK;
    }


    validate(val) {
        if (val === undefined || val === null) return;
        let err;
        if (isNaN(val)) {
            const length = (val) ? val.length : 0;
            err = this.validateSize(length);
        } else {
            err = this.validateSize(val);
        }
        if (err != Errors.OK) return err;

        for(let nhas of this._notcontains) {
            if (val.match(nhas)) return Errors.HAS_NOT;
        }

        if (this._contains.length == 0) return Errors.OK;
        
        for(let has of this._contains) {
            if (val.match(has)) return Errors.OK;
        }
        return Errors.HAS;
    }




    getErrorVal(error) {
        if (error == Errors.MIN_VALUE) return this.min;
        else if (error == Errors.MAX_VALUE) return this._max;
        else if (error == Errors.HAS) return this._contains.join(" | ");
        else if (error == Errors.HAS_NOT) return this._notcontains;
    }

    display(val) {
        return val;
    }
}


