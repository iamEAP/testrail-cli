"use strict";

var YAML = require('yamljs');

module.exports = function testrailCliFactory(coreFactory, TestRailFactory, argv, process, console) {
  process = process || global.process;
  console = console || global.console;

  var url = process.env.TESTRAIL_URL || argv.url,
      username = process.env.TESTRAIL_UN || argv.username,
      password = process.env.TESTRAIL_PW || argv.password,
      configs,
      testRailClient,
      core;

  // Ensure we have a URL, username, and password to work with.
  if (!url || !username || !password) {
    console.error("Couldn't find testrail API credentials.");
    console.error('URL:      Either TESTRAIL_URL env variable or --url flag.');
    console.error('Username: Either TESTRAIL_UN env variable or --username flag.');
    console.error('Password: Either TESTRAIL_PW env variable or --password flag.');
    process.exit(1);
  }

  // Read in any/all configuration files.
  console.log('debugging');
  console.log(process.cwd());
  try {
    configs = YAML.load(process.cwd() + '/.testrail-cli.yml');
    console.log(configs);
  }
  catch (Exception) {
    configs = {projectId: null, caseNameToIdMap: {}};
    console.error(configs);
  }

  // Authenticate and create the TestRail client.
  testRailClient = new TestRailFactory(url, username, password);

  // Instantiate the core.
  core = coreFactory(testRailClient, configs, process, console);

  return {
    init: function initializeTestRunFromConsole() {
      var projectId = argv.p || argv.projectId || configs.projectId,
          name = argv.n || argv.runName,
          suiteId = argv.s || argv.suiteId || configs.suiteId,
          description = argv.d || argv.description,
          milestoneId = argv.m || argv.milestoneId;

      core.init(projectId, name, suiteId, description, milestoneId);
    },
    finish: function finishTestRunFromConsole() {
      var runId = argv.r || argv.runId;

      core.finish(runId);
    },
    report: function reportXmlFromConsole() {
      var runId = argv.r || argv.runId,
          files = argv.f || argv.file;

      core.report(runId, files);
    }
  }
};
