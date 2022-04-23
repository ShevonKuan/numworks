const Store = require("electron-store");
const store = new Store();
function init() {
    return store.get("ionEvents") ? store.get("ionEvents") : [];
}
function update(e) {
    store.set("ionEvents", e);
}