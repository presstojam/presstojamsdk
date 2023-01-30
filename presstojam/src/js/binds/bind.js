import { ref, computed } from "vue"

export class Bind {
    
    constructor(cell, value = null) {
        this._cell = cell;
        this._value = value;
        this._error = ref(0);
        this._is_dirty = false;
        this._bind_group; 
        this._active = ref(true);
        this._show_error = ref(false);
    }


    get cell() {
        return this._cell;
    }

    get value() {
        return this._value;
    }

    get is_dirty() {
        return this._is_dirty;
    }

    get error() {
        return this._error;
    }

    set error(err) {
        this._error.value =err;
    }

    set active(active) {
        this._active.value = active;
    }

    get active() {
        return this._active;
    }
      

    get show_error() {
        return this._show_error;
    }


    get classes() {
        if (this._error.value) {
            return "p-invalid";
        } else {
            return "";
        }
    }

    setShowError(val) {
        if (this._cell.type == "json") return;
        this._show_error.value = val;
    }

    
    setValue(val) {
        val = this._cell.clean(val);
        this._error.value = this._cell.validate(val);
        this._value = val;
        this.setDirty(true)
        this._bind_group.trigger(this._cell.name, this._value);
    }

    setDirty(dirty) {
        if (dirty) {
            this._is_dirty = dirty;
        }
    }

    setGroup(group) {
        this._bind_group = group;
    }

    getGroup() {
        return this._bind_group;
    }

}
