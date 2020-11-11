const core = require("@actions/core");
const fs = require("fs");
const { context } = require("@actions/github");

async function run() {
  try {
    if (!process.env.NPM_TOKEN) {
      throw `Env variable NPM_TOKEN not defined!`;
    }

    const { payload } = context;

    const { repository } = payload;

    console.log(repository);
    console.log(context);
    const message = payload.commits.map((commit) => commit.message).join(". ");

    core.exportVariable("COMMIT_MESSAGE", message);
    // core.exportVariable("POC_DIST_REPO", repository.full_name + "-dist");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
