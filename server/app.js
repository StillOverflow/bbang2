require('dotenv').config({ path: './database/mysql.env' });
const express = require('express');
const app = express();
const commonRouter = require('./router/common_router.js');
const equipmentRouter = require('./router/equipment_router.js');
const material = require('./router/material_router.js');
const standard = require('./router/standard_router.js');
const produce = require('./router/produce_router.js');
const quality = require('./router/quality_router.js');
const sales = require('./router/sales_router.js');

// 미들웨어
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: false })); // application/x-form-urlencoded
// 정적 파일을 제공할 디렉토리를 설정
app.use('/uploads', express.static('uploads'));

// 라우터 등록
app.use('/', commonRouter);
app.use('/', equipmentRouter);
app.use('/', material);
app.use('/', standard);
app.use('/', produce);
app.use('/', quality);
app.use('/', sales);

app.listen(3000, () => {
  console.log('Server Start');
  console.log('http://localhost:3000');
});

// 라우팅
app.get('/', (req, res) => {
  res.send('Welcome!!');
});
