//! QQA01 중 'QQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = `
  SELECT comm_dtl_nm, comm_dtl_cd
  FROM   common_detail
  WHERE  UPPER(comm_cd) = UPPER( ? )
  ORDER  BY comm_dtl_cd
`;

//! 거래처 조회
// 거래처 코드가 존재하면 Where 조립 없으면 전체조회
const accountSelect = (datas) => {
  let query = `
    SELECT  act_cd, fn_get_codename(act_type) AS act_type, act_nm, mgr_nm, mgr_tel, ceo_nm, 
            act_addr, act_tel, business_no, location, note
    FROM    account
  `;

  const conditions = [];

  // 거래처조회 조건
  if (datas.act_type) conditions.push(`act_type = UPPER('${datas.act_type}')`);
  if (datas.act_cd) conditions.push(`act_cd = UPPER('${datas.act_cd}')`);
  if (datas.act_nm) conditions.push(`act_nm LIKE '%${datas.act_nm}%'`);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }
  
  query += ` ORDER BY act_cd`; // 정렬

  return query; // 합체한 쿼리 전체
};

//! 자재 조회
const materialSelect = (datas) => {
  let query = `
    SELECT mat_cd, mat_nm, \`type\`, price, safe_stk, create_dt, update_dt, category, \`unit\`
    FROM   material
  `;
  
  const conditions = [];

  // 자재조회 조건
  if(datas.mat_cd) conditions.push(`mat_cd = UPPER('${datas.mat_cd}')`);
  if(datas.mat_nm) conditions.push(`mat_nm LIKE '%${datas.mat_nm}%'`);
  if(datas.type) conditions.push(`\`type\` = UPPER('${datas.type}')`);
  if(datas.category) conditions.push(`\`category\` = UPPER('${datas.category}')`);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY mat_cd`;

  return query;
}

//! 상품 조회
const productSelect = (datas) => {
  let query = `
    SELECT prd_cd, prd_nm, category, price, \`unit\`, exp_range, safe_stk, create_dt, update_dt, note
    FROM   product
  `;
  
  const conditions = [];

  // 상품조회 조건
  if(datas.prd_cd) conditions.push(`prd_cd = UPPER('${datas.prd_cd}')`);
  if(datas.prd_nm) conditions.push(`prd_nm LIKE '%${datas.prd_nm}%'`);
  if(datas.category) conditions.push(`\`category\` = UPPER('${datas.category}')`);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY prd_cd`;

  return query;
}


//주문서별 제품목록
const orderDtlList = 
`
SELECT ORDER_DTL_CD,
		 ORDER_CD,
		 o.PRD_CD, 
		 PRD_NM, 
		 ORDER_QTY, 
		 (SELECT sum(STOCK) FROM product_in WHERE PRD_CD=o.PRD_CD) AS IN_CNT
FROM 
		order_detail o JOIN product p ON o.PRD_CD=p.PRD_CD 
		WHERE order_cd=?
`;

//제품목록
const productList = 
`
SELECT PRD_CD, 
       PRD_NM, 
       PRICE, 
       (SELECT sum(STOCK) FROM product_in WHERE PRD_CD=p.PRD_CD) AS IN_CNT 
FROM product p
`;

module.exports = {
  findCommList,
  accountSelect,  // 거래처
  materialSelect, // 자재
  productSelect,  // 제품
  orderDtlList,
  productList
};