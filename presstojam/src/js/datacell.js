import { reactive, computed } from "vue"

export class DataCell {

    constructor(meta) {
        this._store = reactive({ 
            meta : meta, 
            value: null, 
            change: null,
            change2 : null,
            display: null, 
            error: 0, 
            is_validate_on: false,
            mode : 'view'
        });


        const meta_keys = Object.getOwnPropertyNames(meta);
        const keys = Object.keys(this);

        const _self = this;
        meta_keys.forEach(property => {
            if (property[0] != "_" && !keys.includes(property)) {
                this[property] = computed({
                    get: function () {
                        return _self.store.meta[property];
                    },
                    set: function (newValue) {
                        _self.store.meta[property] = newValue;
                    }
                })
            }
        });



        this.error = computed({
            get: () => { return this._store.error; },
            set: val => { 
                this._store.error = parseInt(val); 
                this._store.is_validate_on = true; 
            }
        });

        this.display = computed({
            get: () => {
                if (Array.isArray(this._store.display)) {
                    if (this._store.display.length > 0) return this._store.display.join(" ");
                    else return this._store.value;
                } else if (this._store.display) return this._store.display;
                else return this._store.value;
            },
            set: (row) => {
                this._store.display = [];
                const fields = this._store.meta.include_fields;
                if (fields) {
                    for(const field of fields) {
                        const fname = this._store.meta.name + "/" + field;
                        this._store.display.push(row[fname]);
                    }
                }
            }
        });


        this.showError = computed(() => {
            let res = this._store.is_validate_on && this._store.error ? true : false;
            return this._store.is_validate_on && this._store.error ? true : false;
        });

        if (this._store.meta.default_val) this._store.value = this._store.meta.default_val;
        else if (this._store.meta.type == "select") this._store.value = 0;

        this.val = computed({
            get: () => {
                return this._store.meta.getVal(this._store);
            },
            set: (val) => {
                this._store.value = this._store.meta.clean(val);
                this._store.error = this._store.meta.validate(val);
            }
        });

        this.change = computed({
            get: () => {
                return this._store.meta.getChange(this._store);
            },
            set: (val) => {
                this._store.meta.setChange(this._store, val);
            }
        });

       
        this.change1 = computed({
            get: () => {
                return this._store.meta.getChange1(this._store);
            },
            set: (val) => {
                this._store.meta.setChange1(this._store, val);
            }
        });

        this.change2 = computed({
            get: () => {
                if (typeof this._store.meta.getChange2 === "function") {
                    return this._store.meta.getChange2(this._store);
                }
            },
            set: (val) => {
                this._store.meta.setChange2(this._store, val);
            }
        });


        this.filter = computed({
            get: () => {
                return this._store.meta.getFilter(this._store);
            },
            set: (val) => {
                this._store.meta.setFilter(this._store, val);
            }
        });


        this.mode = computed({
            get: () => {
                return this._store.mode;
            },
            set: (val) => {
                if (this._store.meta.immutable) {
                    if (val == "view" || val == "filter") this._store.mode = val;
                }  else {
                    this._store.mode = val;
                }
            }
        });

    }


    get meta() {
        return this._store.meta;
    }

    set validateon(on) {
        if (this._store.mode == 'post' || this._store.mode == 'edit') {
            this._store.is_validate_on = on;
        }
    }

    get store() {
        return this._store;
    }

    resetMeta(meta) {
        this._store.meta = meta;
    }

    toString() {
        return this._store.display;
    }

    isSummary() {
        return this._store.meta.summary;
    }

    setContainsAsOptions(options) {
        this._store.meta.setContainsAsOptions(options);
    }

    reset() {
        this._store.change = null;
        this._store.value = null;
    }

    getOption(key) {
        if (this._store.meta.type == 'string') return key;
        else return this._store.meta.getOption(key);
    }


    addParam(obj) {
        this._store.meta.addParam(obj, this._store.value)
    }

    addAPIParam(obj) {
        this._store.meta.addParam(obj, this._store.value)
    }
    
}
