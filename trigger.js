// jshint esversion: 9
// jshint laxbreak: true
const Trigger = (function () {
  class Trigger {
    constructor(functionName, everyMinutes) {
      return ScriptApp.newTrigger(functionName)
        .timeBased()
        .everyMinutes(everyMinutes)
        .create();
    }

    static deleteTrigger(e) {
      if (typeof e !== 'object')
        return console.log(`${e} is not an event object`);
      if (!e.triggerUid)
        return console.log(`${JSON.stringify(e)} doesn't have a triggerUid`);
      ScriptApp.getProjectTriggers().forEach(trigger => {
        if (trigger.getUniqueId() === e.triggerUid) {
          console.log('deleting trigger', e.triggerUid);
          return ScriptApp.deleteTrigger(trigger);
        }
      });
    }
  }
  return Trigger;
})();
