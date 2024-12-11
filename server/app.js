require("dotenv").config({ path: "./database/mysql.env" });
const express = require("express");
const app = express();
const commonRouter = require("./router/common_router.js");
const equipmentRouter = require("./router/equipment_router.js");
const materials = require("./router/materials_router.js");
const master_data = require("./router/master_data_router.js");
const production = require("./router/production_router.js");
const quality = require("./router/quality_router.js");
const sales = require("./router/sales_router.js");
// 가나다라마바사아앙아아아ㅓㄹㅇ니ㅏ런아ㅣㄹ넝라ㅣㄴㅇ머라ㅣㄴㅇㅁ러나이
// 미들웨어
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: false })); // application/x-form-urlencoded

// 라우터 등록
app.use("/", commonRouter);
app.use("/", equipmentRouter);
app.use("/", materials);
app.use("/", master_data);
app.use("/", production);
app.use("/", quality);
app.use("/", sales);

app.listen(3000, () => {
  console.log("Server Start");
  console.log("http://localhost:3000");
});

// 라우팅
app.get("/", (req, res) => {
  res.send("Welcome!!");
});
