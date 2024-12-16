const common = require("./sqls/common.js");
const produce = require("./sqls/produce.js");

module.exports = {
  ...common,
  ...produce,
};
