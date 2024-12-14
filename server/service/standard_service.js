const mariadb = require("../database/mapper.js");

//제품전체조회
  const findAllPrd = async()=>{
    let list = await mariadb.query('prdList');
    return list;
  }
//자재전체조회  
  const findAllMat = async()=>{
    let list = await mariadb.query('matList');
    return list;
  }
//BOM조회
  const findBomByPc = async(prd_cd)=> {
    let list = await mariadb.query('bomlist',prd_cd);
    return list;
  }
//BOM등록  
  const createBom = async(bomInfo)=>{
    let result = await mariadb.query('boardInsert', bomInfo);
    if(result.insertId>0){
      return {bom_no:result.insertId};
    }else{
      return {};
    }
  }
//BOM삭제
  const deleteBom = async(prd_cd, mat_cd)=>{
    let result = await mariadb.query('bomDel', [prd_cd, mat_cd]);
    if(result.affectedRows == 1 && result.changedRows ==0){
      return{ "result" : "success", "prd_cd" : prd_cd, "mat_cd" : mat_cd};
  }else{
      return { "result" : "fail" };
  }
  }
  
module.exports = {
  //메소드명
  findBomByPc,
  createBom,
  findAllPrd,
  findAllMat,
  deleteBom
};
