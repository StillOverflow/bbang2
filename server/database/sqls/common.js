//! QQA01 중 'QQ'와 관련된 공통코드를 모두 찾을 때
const findCommList = `
  SELECT
    comm_dtl_nm,
    comm_dtl_cd
  FROM
    common_detail
  WHERE
    UPPER(comm_cd) = UPPER(?)
  ORDER BY
    comm_dtl_cd
`;

// 사원 조회 (매개변수 없으면 전체 조회, 있으면 부서별 직원 조회)
// const memList = (dpt_cd) => {
//   return `
//   SELECT mem_cd,
//          name,
//          id,
//          password,
//          phone,
//          addr,
//          email,
//          birth,
//          hire_dt,
//          quit_dt,
//          fn_get_codename(status) as status,
//          fn_get_codename(permission) as permission,
//          create_dt,
//          update_dt,
//          fn_get_departname(dpt_cd) as dpt_cd,
//          gender
//   FROM member ${!dpt_cd ? "" : "WHERE  UPPER(dpt_cd) = UPPER('" + dpt_cd + "') "} -- 부서번호 있을 시 동적 조건 생성
//   ORDER  BY id `;
// };

const memList = (datas) => {
  let query =  `
    SELECT mem_cd,
          name,
          id,
          password,
          phone,
          addr,
          email,
          birth,
          hire_dt,
          quit_dt,
          fn_get_codename(status) as status,
          fn_get_codename(permission) as permission,
          create_dt,
          update_dt,
          fn_get_departname(dpt_cd) as dpt_cd,
          gender
    FROM member 
  `;

  const conditions = [];

  // 거래처조회 조건
  if (datas.dpt_cd) conditions.push(`UPPER(dpt_cd) = UPPER('${datas.dpt_cd}')`);
  //if (data.id) conditions.push(`id = '${data.act_type}'`);
  //if (data.password) conditions.push(`password = '${data.act_cd}'`);
  if (datas.name) conditions.push(`name LIKE '%${datas.name}%'`);

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }
  
  query += ` ORDER BY id, name`; // 정렬

  return query; // 합체한 쿼리 전체
};

//! 거래처 조회
// 거래처 코드가 존재하면 Where 조립 없으면 전체조회
const accountSelect = (datas) => {
  let query = `
  SELECT act_cd,
        fn_get_codename(act_type) AS act_type,
        act_nm,
        mgr_nm,
        mgr_tel,
        ceo_nm,
        act_addr,
        act_tel,
        business_no,
        LOCATION as location,
        create_dt,
        note
  FROM ACCOUNT
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
  SELECT mat_cd,
         mat_nm,
         fn_get_codename(TYPE) AS type,
         price,
         safe_stk,
         create_dt,
         update_dt,
         fn_get_codename(category) AS category,
         fn_get_codename(unit) AS unit,
         note
  FROM material
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
  SELECT prd_cd,
         prd_nm,
         fn_get_codename(category) AS category,
         price,
         fn_get_codename(unit) AS unit,
         exp_range,
         safe_stk,
         create_dt,
         update_dt,
         note,
         (SELECT SUM(STOCK)
         FROM product_in
         WHERE PRD_CD = p.PRD_CD ) AS in_cnt
  FROM   product p
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
const commOrderDtlList = 
`
  SELECT order_dtl_cd,
         order_cd,
         o.prd_cd AS prd_cd,
         prd_nm,
         order_qty,
         (SELECT sum(STOCK)
         FROM product_in
         WHERE PRD_CD=o.PRD_CD) AS in_cnt
  FROM order_detail o
  JOIN product p ON o.PRD_CD=p.PRD_CD
  WHERE order_cd=?
`;

//로그인
const login = (datas) => {
  let sql = 
          `SELECT MEM_CD,
                  NAME,
                  ID,
                  PHONE,
                  ADDR,
                  EMAIL,
                  BIRTH,
                  HIRE_DT,
                  STATUS,
                  PERMISSION,
                  fn_get_codename(PERMISSION) AS "PS",
                  m.DPT_CD AS DPT_CD,
                  d.DPT_NM AS DPT_NM
            FROM 
                member m JOIN department d ON m.DPT_CD=d.DPT_CD 
                
            WHERE BINARY id='${datas.id}' and BINARY password='${datas.password}'`;
  return sql;
};

module.exports = {
  findCommList,
  memList,        // 사원
  accountSelect,  // 거래처
  materialSelect, // 자재
  productSelect,  // 제품
  commOrderDtlList,
  login // 로그인
};