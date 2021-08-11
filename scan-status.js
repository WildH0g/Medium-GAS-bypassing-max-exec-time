// jshint esversion: 9
// jshint laxbreak: true
class ScanStatus {
  static set(status) {
    PropertiesService.getScriptProperties().setProperty('status', status);
  }

  static get() {
    return PropertiesService.getScriptProperties().getProperty(key);
  }
}
