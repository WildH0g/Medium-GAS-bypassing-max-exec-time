// jshint esversion: 9
// jshint laxbreak: true

function testRuntime(timesRun = 0) {
  if (timesRun > 0) console.log(`ran ${timesRun} times`);
  Utilities.sleep(30000);
  testRuntime(timesRun + 1);
}