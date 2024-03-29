import { Controller } from "./index.js"

import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
import 'primeflex/primeflex.css'
import Schema from "./schema.vue";
import TestVue from "./testvue.vue"
import { createApp } from 'vue'
import container from "./index.js";
import "./scss/styles.scss";
import CreateAction from "./components/actions/create-action.vue"
import Publish from "./Publish.vue"

//const url = "https://api.presstojam.com";
//const url = "https://api-owen.presstojam.com";
//const url = "https://api.genercode.com";
//const url = "http://slim.localhost";
//https://api.presstojam.com

const url = "https://dev-aml2.api-capstonegroup.com/v4";

let settings = {
    "profile" : "pi-users",
    "url" : url,
    "client" : {  "debug" : true, custom_headers : {
        'x-domain' : "petinsure.ie"
    } },
    base : "/admin/",
    "models" : {
        "pi-claims" : {
            "limit" : 50,
            "to" : "pi-policy",
            "fields" : [
                "--id",
                "pre-authorisation",
                "last-updated",
                "pi-policy-pet/--parentid",
                "contacts",
                "contacts/phone1",
                "pi-policy-pet/pet-name",
                "claim-handler",
              
                "any-other-comments"
            ],
            "includes" : {
                "contacts" : ["title", "first-name", "last-name"]
            },
              max_cols : 30
        },
        "pi-surgerys" : {
            "limit" : 50
        },
        "pi-claims-rejection-categories" : {
            "nofilter" : 1,
            max_cols : 30
        },
        "pi-claim-type" : {
            "nofilter" : 1
        },
        "pi-claims-file-types" : {
            "nofilter" : 1,
            max_cols : 30
        },
        "pi-conditions" : {
            "limit" : 50
        },
        "pi-claims-payments" : {
            "limit" : 50
        },
        "plan-discounts" : {
            
        },
        "pi-policy-payments" : {
            "limit" : 50
        },
        "eft-batch-payments" : {
            "export_fields" : {
                "risk-key" : "YourCustRef",
                "account-holder" : "Name",
                "bic" : "BIC",
                "iban" : "IBAN",
                "amount" : "Amount",
                "mandate-ref" : "UMR",
                "date-of-signing" : "DateOfSigning",
                "due-date" : "DueDate"
            },
            "fields" : [
                "--parent",
                "risk-key",
                "account-holder",
                "bic",
                "iban",
                "amount",
                "mandate-ref",
                "date-of-signing",
                "due-date",
                "is-verified"
            ]
        }
    }
};

/*

let settings = { 
  "profile" : "accounts",
  "url" : url,
  "base" : "/admin",
  "models" : {
    "projects" : {
        "actions" : [{
            component :  Publish,
            args : {}
            }
           
        ]
    }
  }
  /*
  "models" : {
      "projects" : {
            "import" : true,
           "export_fields" : {
            "cfdist-id" : "Distribution ID",
            "domain" : "Domain",
            "hosting-status" : "Hosting Status"
           },
         
           "limit" : 2,
           "no_filter" : false,
           "order":{
            "hosting-status" : "desc"
           },
           "distinguish" : "hosting-status",
           "actions" : [
            {
                "component" : TestVue, 
                "atts" : {
                    type : "test"
                }
            }
           ]
           //"groupclasses" : { "active" : "redbackground"}
          // "export_fields" : ["cfdist-id", "domain", "hosting-status"]
      },
      "fields" : {
          "max_cols" : 10,
          "parent" : {
              "hide_actions" : {
                  "post" : true,
                  "parent" : true
              }
          },
          "classes" : [
            {
                att : "type",
                value : "str",
                class : "red"
            }
          ]
          
      }
  },
  "flows" : [{
        "title" : "Register Project",
        "key" : "register",
        "routes" : [
            {"model" : "projects", "method" : "post"},
            {"model" : "profiles", "method" : "crud"}
        ]
    }],
    "routes" : [
        { "path" : "/schema", component : Schema, name :"name"}
    ]
    */
//};

const app = createApp(Controller);
app.use(container, settings);
app.mount("#app");

/*
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const referer = urlParams.get("referer");
const domain = urlParams.get("domain");
const code = urlParams.get("code");


const Ctrl = FactoryController.createController({
  "plugin" : {
        "project-import" : {
            "post" : {
                  "load" : instance => {
                      instance.data.domain = domain;
                      instance.data.code = code;
                      instance.submit()
                      .then(() => {
                          let url = domain + referer;
                          url += (url.indexOf("?") == -1) ? "?" : "&";
                          url += "code=" + code;
                          window.location = url;
                      })
                  }
              }
          }
      }
});

Ctrl.initProfile()
.then(profile => {
  if (profile == "accounts") {
      return Client.post('/core-assume-role', { 'role' : 'plugin' });
  }
})
.then(() => {
  Router.runRoute();
  try {
      const app = createApp(GCRoot);
      app.provide('ctrl', Ctrl);
      app.mount("#app");
  } catch(err) {
      alert(err.message);
  }
});

  Ctrl.initSettings({
      "client" : {"url" : "http://api.localhost", "debug" : true },
      "models" : {
          "accounts-user" : {
          "actions" : {
              "login" : {
                  "next" : redirect
              },
              "post" : {
                  "next" : redirect
              }
          }
      }
      },
      "router" : {
          "aliases" : {
              "/accounts-login" : "/plugin/" 
          }
      },
      "routes" : response => {
          if (response.__profile && response.__profile != "public") {
              //the user is already logged in, need to logout and reset
              Client.post("/core-logout")
              .then(() => {
                //  location.reload();
              });
          }
      }
  });*/
