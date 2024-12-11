const common = require("./sqls/common.js");
const equipment = require("./sqls/equipment.js");
const master_data = require("./sqls/master_data.js");
const materials = require("./sqls/materials.js");
const production = require("./sqls/production.js");
const quality = require("./sqls/quality.js");
const sales = require("./sqls/sales.js");

module.exports = {
  ...common,
  ...equipment,
  ...master_data,
  ...materials,
  ...production,
  ...quality,
  ...sales,
};