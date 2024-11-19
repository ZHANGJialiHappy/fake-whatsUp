import Parse from "parse";

const PARSE_APPLICATION_ID = "BPo17lq5JC17DCclEGqLD4h0rnqs2rqgzF29mcTl";
const PARSE_HOST_URL = "https://parseapi.back4app.com/";
const PARSE_JAVASCRIPT_KEY = "Jcx8pcnXdv3w7wdFHooiAzlW56JGr2kEQOqBJrRU";
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;

export default Parse;