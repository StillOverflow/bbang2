// ^ ------------------------- 자재 발주서(미지시 생산계획) -------------------------
// 미지시 생산 계획서 조회
const produceHeadPlanList = `
   SELECT p.prod_plan_cd,
         p.start_dt,
         p.end_dt,
         m.id,
         m.name
   FROM   prod_plan p INNER JOIN member m
   ON     p.id = m.id
   WHERE  prod_plan_cd IN (SELECT prod_plan_cd
                           FROM   prod_inst
                           WHERE  UPPER(status) = 'Z01')
`

// 날짜별로 검색
const planListSearch = (searchObj) => {
   // 시작날짜, 끝나는 날짜 가져와서 담음
   const {startDt, endDt} = searchObj;
   let query = `
      SELECT p.prod_plan_cd,
            p.start_dt,
            p.end_dt,
            m.id,
            m.name
      FROM   prod_plan p INNER JOIN member m
      ON     p.id = m.id
      WHERE  prod_plan_cd IN (SELECT prod_plan_cd
                              FROM   prod_inst
                              WHERE  UPPER(status) = 'Z01')
   `;

   const conditions = [];

   // 날짜 조건 추가
   if (startDt && endDt) {
      conditions.push(`p.start_dt BETWEEN '${startDt}' AND '${endDt}'`);
   }
   // WHERE 절 조립
   if (conditions.length > 0) {
      query += " AND " + conditions;
   }
   // 쿼리 반환
   return query; 
};

// 생산 계획서에 대한 자재 재고 조회
const getPlanMaterialStock = `
   SELECT   b.mat_cd,
            c.mat_nm,
            fn_get_codename(c.type) \`type\`,
            CONCAT(IFNULL(b.require_qty, 0), fn_get_codename(c.unit)) AS require_qty,
            CONCAT(IFNULL(c.safe_stk, 0), fn_get_codename(c.unit)) AS safe_stk,
            CONCAT(IFNULL(b.require_qty, 0), fn_get_codename(c.unit)) AS total_qty,
            CONCAT(IFNULL(e.mat_stock, 0), fn_get_codename(c.unit)) AS stock_qty,
            CONCAT(IFNULL(e.mat_stock, 0) - IFNULL(b.require_qty, 0), fn_get_codename(c.unit)) AS lack_qty
   FROM    (SELECT  mat_cd ,
                    SUM(a.qty) AS require_qty
            FROM    (SELECT z.prd_cd,
                           p.mat_cd,
                           (z.prod_plan_qty * p.\`usage\`) AS qty
                     FROM  prod_plan_dtl z LEFT JOIN bom p
                                             ON z.prd_cd = p.prd_cd 
                     WHERE z.prod_plan_cd = UPPER( ? )) a
            GROUP BY mat_cd ) b LEFT JOIN material c
                                       ON b.mat_cd = c.mat_cd
                              LEFT OUTER JOIN (select mat_cd, sum(mat_stock) mat_stock from material_in GROUP BY mat_cd)  e 
                                      ON b.mat_cd = e.mat_cd
   ORDER BY b.mat_cd
`
// ^ ------------------------- 자재 발주관리 -------------------------

module.exports = {
   produceHeadPlanList,
   planListSearch,
   getPlanMaterialStock,
};
