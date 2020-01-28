#!/usr/bin/env node

const fs = require("fs");
const os = require("os");

const DIR_PATH = `${os.homedir()}/.hackernews-cli`;

if (!fs.existsSync(DIR_PATH)) {
  fs.mkdirSync(DIR_PATH);
}
