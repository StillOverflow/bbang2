const mariadb = require("../database/mapper.js");

//-----------------BOM-------------------
//제품전체조회
  const findAllPrd = async()=>{
    let list = await mariadb.query('prdList');
    return list;
  }
//제품 키워드 검색
  const searchPrd = async(search) => {
    let list = await mariadb.query('prdSearch', [`%${search}%`]);
    return list;
  }
//자재전체조회  
  const findAllMat = async()=>{
    let list = await mariadb.query('matList');
    return list;
  }
//자재 키워드 검색
  const searchMtl = async(search) => {
    let list = await mariadb.query('matSearch', [`%${search}%`]);
    return list;
  }
//BOM조회
  const findBomByPc = async(prd_cd)=> {
    let list = await mariadb.query('bomlist',prd_cd);
    return list;
  } 
//BOM등록  
  const createBom = async(bomInfo)=>{
    //console.log(bomInfo,' bomInfo');

    let result = await mariadb.query('bomInsert', bomInfo);
    console.log('result ', result);
    if(result.affectedRows>0){
      return { "result" : "success"};
    }else{
      return {"result" : "fail"};
    }
  }
//BOM삭제
  const deleteBom = async(prd_cd, mat_cd)=>{
    let result = await mariadb.query('bomDel', [prd_cd, mat_cd]);
    if(result.affectedRows > 0){
      return{ "result" : "success", "prd_cd" : prd_cd, "mat_cd" : mat_cd};
    } else{
      return { "result" : "fail" };
    }
  }

//-----------------공정흐름도-------------------
  // 공정 흐름도 조회
  const searchFlow = async(prd_cd)=>{
    let list = await mariadb.query('procFlowByProd', prd_cd);
    return list;
  }

  // 공정 추가


  // 공정 삭제
 



//------------------공통코드----------------------
const findAllComm = async(comm_cd)=> {
  let list = await mariadb.query('commList',comm_cd);
  return list;
}
  
module.exports = {
  //메소드명
  findBomByPc,
  createBom,
  findAllPrd,
  findAllMat,
  deleteBom,
  searchPrd,
  searchMtl,
  findAllComm,
  searchFlow
};
