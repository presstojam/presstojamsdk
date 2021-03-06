class MapModel {

    constructor() {
        this._route = '';
        this._flow = '';
        this._model = '';
        this._state = '';
        this._key = 0;
        this._to = '';
        this._params = {};
        this._base = "/";
        this._default = false;
    
        const keys = Object.keys(this);

        keys.forEach(property => {
          if (property[0] == "_") {
            Object.defineProperty(this, property.substring(1), {
                get: function() { 
                    return this[property];
                },
                set: function(newValue) {
                    if (newValue != this[property]) {
                        this[property] = newValue;
                    }
                }
            });
          } 
        });


        this.action_map = {
            'post' : '-create',
            'put' : '-update',
            'delete' : '-delete',
            'login' : '-login',
            'logout' : '-logout',
            'primary' : '-primary',
            'parent' : '-parent',
            'get' : ''
        };

    }

    get id() {
        return this.model + "-" + this.state + "-" + this.to;
    }

    reset() {
        this.route = '';
        this.flow = '';
        this.model = '';
        this.state = '';
        this.key = 0;
        this.to = '';
        this.params = {};
    }


    convertToURL() {
        let url = this._base + this.route + "/" + this.flow;
        if (this.model != this.flow) url += "/" + this.model;
        url += this.action_map[this.state];
        if (this.key) url += "-" + this.key;
        if (this.to) url += "-to-" + this.to;

        let params = new URLSearchParams();
        for(const i in this.params) {
            if (!this.params[i]) continue;
            if (typeof this.params[i] == 'object') {
                let pts = [];
                for(let x in this.params[i]) {
                    pts.push(this.params[i][x]);
                }
                params.append(i, pts.join(","));
            } else {
                params.append(i, this.params[i]);
            }
        }

        let param_str = params.toString();
        if (param_str) url += "?" + param_str;

        return url;
    }
    
    initSettings(settings) {
        if (settings) this._base = settings.base;
        this.convertFromURL();
    }

    convertFromURL() {
        let url_obj = new URL(window.location.href);
        let url = url_obj.pathname.replace(this.base, "");
        url = url.replace(/^\/+|\/+$/g, '');

        if (!url) return;


        let parts = url.split("/");

        if (parts.length >= 3) {
            this.route = parts[0];
            this.flow = parts[1];
            url = parts[2];
        } else if (parts.length >= 2) {
            this.route = parts[0];
            url = parts[1];
        }
        
        const _self = this;
        url_obj.searchParams.forEach(function(value, key) {
            _self.params[key] = (value.indexOf(",") > -1) ? value.split(",") : value;
        });

       
        parts = url.split("-to-");
        if (parts.length > 1) {
            this.to = parts[1];
            url = parts[0];
        }

       
        parts = url.split("-");
        let key = parts[parts.length - 1];
        if (key == "first") {
            this.key = key;
            parts.pop();
        } else if (!isNaN(key)) {
            this.key = parseInt(key);
            parts.pop();
        }
            
        if (parts.length == 0) {
            throw new Error("Can't convert this url string: " + url);
        }
    
        this.state = "get";
        for(let i in this.action_map) {
            if (this.action_map[i] == "-" + parts[parts.length - 1]) {
                this.state = i
                parts.pop();
                break;
            }
        }
        this.model = parts.join("-");
        if (!this.route) this.route = this.model;
        if (!this.flow) this.flow = this.model;
    }

    getAll() {
        return {
            route : this.route,
            model : this.model,
            state : this.state,
            key : this.key,
            to : this.to,
            params : this.params,
            base : this.base,
            default : this.default
        };
    }

    apply(route) {
        for(let i in route) {
            this[i] = route[i];
        }
    }
}


export const Map = new MapModel();

