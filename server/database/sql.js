const common = require("./sqls/common.js");
const equipment = require("./sqls/equipment.js");
const standard = require("./sqls/standard.js");
const material = require("./sqls/material.js");
const produce = require("./sqls/produce.js");
const quality = require("./sqls/quality.js");
const sales = require("./sqls/sales.js");

module.exports = {
  ...common,
  ...equipment,
  ...standard,
  ...material,
  ...produce,
  ...quality,
  ...sales,
};
