//! ------------------------------ 자재 발주서(미지시 생산계획) ------------------------------
// 미지시 생산 계획서 조회
const produceHeadPlanList = `
   SELECT
      prod_plan_cd,
      start_dt,
      end_dt,
      fn_get_membername(id) AS name,
      id
   FROM
      prod_plan
   WHERE
      prod_plan_cd IN (
         SELECT
            prod_plan_cd
         FROM
            prod_inst
         WHERE
            UPPER(STATUS) = 'Z01'
      )
`

// 날짜별로 미지시 생산계획 검색
const planListSearch = (searchObj) => {
   // 시작날짜, 끝나는 날짜 가져와서 담음
   const {startDt, endDt} = searchObj;
   let query = `
      SELECT
         prod_plan_cd,
         start_dt,
         end_dt,
         fn_get_membername(id) AS name,
         id
      FROM
         prod_plan
      WHERE
         prod_plan_cd IN (
            SELECT
               prod_plan_cd
            FROM
               prod_inst
            WHERE
               UPPER(STATUS) = 'Z01'
         )
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

// 미지시 생산 계획서에 대한 자재 재고 조회
const getPlanMaterialStock = `
   SELECT
      b.mat_cd,   
      c.mat_nm,
      fn_get_codename(c.\`type\`) AS type,
      IFNULL(e.mat_stock, 0)      AS stock_qty,
      IFNULL(b.require_qty, 0)    AS require_qty,
      IFNULL(c.safe_stk, 0)       AS safe_stk,
      fn_get_codename(c.unit)     AS unit,
      (IFNULL(e.mat_stock, 0) - IFNULL(b.require_qty, 0)) AS lack_qty
   FROM
      (
         SELECT
            mat_cd,
            SUM(a.qty) AS require_qty
         FROM
            (
               SELECT
                  z.prd_cd,
                  p.mat_cd,
                  (z.prod_plan_qty * p.\`usage\`) AS qty
               FROM
                  prod_plan_dtl z
                  LEFT JOIN bom p ON z.prd_cd = p.prd_cd
               WHERE
                  z.prod_plan_cd = UPPER(?)
            ) a
         GROUP BY
            mat_cd
      ) b
      LEFT JOIN material c ON b.mat_cd = c.mat_cd
      LEFT OUTER JOIN (
         SELECT
            mat_cd,
            SUM(mat_stock) mat_stock
         FROM
            material_in
         GROUP BY
            mat_cd
      ) e ON b.mat_cd = e.mat_cd
   ORDER BY
      b.mat_cd
`
//! ----------------------------------- 자재 발주관리 -----------------------------------
// 발주서 조회
const getMaterialOrder = `
   SELECT   
      mat_order_cd,
      fn_get_codename(status) AS status,
      fn_get_membername(id) AS id,
      (SELECT act_nm FROM account a WHERE m.act_cd = a.act_cd) AS act_cd
   FROM     
      material_order m
   WHERE    
      UPPER(status) <> UPPER('L01')
   ORDER BY 
      create_dt DESC
   
`

// 발주서 디테일 조회
const getMaterialOrderDetail = `
   SELECT
      mat_order_dtl_cd,
      mat_qty,
      a.create_dt,
      a.update_dt,
      a.mat_cd,
      fn_get_codename(c.\`unit\`) AS unit,
      fn_get_materialname(a.mat_cd) AS mat_nm,
      b.mat_order_cd,
      delivery_dt,
      b.act_cd,
      fn_get_accountname(act_cd) AS act_nm
   FROM
      material_order_detail a
      INNER JOIN material_order b ON b.mat_order_cd = a.mat_order_cd
      LEFT JOIN material c ON a.mat_cd = c.mat_cd
   WHERE
      UPPER(b.mat_order_cd) = UPPER( 'ord001' )
   ORDER BY
      mat_nm
`
//! ----------------------------------- 자재 출고조회 -----------------------------------
// 생산완료된 생산지시서 조회
const getProduceInstruction = (searchObj) => {
   let query = `
      SELECT
         inst_cd, -- 지시서 코드
         work_dt, -- 작업일자
         status,
         fn_get_codename(status) AS statusName   -- 진행 상태         
      FROM
         prod_inst
      WHERE
         UPPER(STATUS) <> 'Z01'
   `
   const conditions = [];

   // 날짜 조건 추가
   if (searchObj.startDt && searchObj.endDt) {
      conditions.push(`DATE(work_dt) BETWEEN DATE('${searchObj.startDt}') AND DATE('${searchObj.endDt}')`);
   }

   // 진행상태
   if(searchObj.status) {
      conditions.push(`UPPER(status) = UPPER('${searchObj.status}')`)
   }

   // WHERE 절 조립
   if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
   }
   query += ` ORDER BY a.work_dt DESC`;
   // 쿼리 반환
   return query;
}


const getMaterialOutForProduction = (data) => {
   let query = `
      SELECT 
         d.inst_dtl_cd,                           -- 지시서 상세 코드
         c.proc_cd,                               -- 공정 코드
         fn_get_proc_nm(proc_cd) AS proc_nm,      -- 공정명
         a.mat_cd,                                -- 자재코드
         b.mat_nm,                                -- 자재명 
         fn_get_codename(b.unit) AS unit,         -- 자재 단위
         a.mat_out_qty,                           -- 출고량
         a.mat_out_dt,                            -- 출고날짜
         fn_get_codename(b.category) AS category, -- 자재 카테고리
         fn_get_codename(b.\`type\`) AS type,       -- 자재 구분
         mat_lot_cd                               -- 자재 lot
      FROM   
         material_out_detail a                    -- 자재 출고 디테일 테이블
      LEFT JOIN 
         material b ON a.mat_cd = b.mat_cd        -- 자재 정보 테이블
      INNER JOIN 
         prod_result c ON c.prod_result_cd = a.prod_result_cd  -- 생산 실적 테이블
      INNER JOIN 
         prod_inst_dtl d ON c.inst_cd = d.inst_cd  -- 생산 지시 디테일 테이블
   `
   const conditions = [];

   // 날짜 조건 추가
   if (data.inst_cd) {
      conditions.push(`UPPER(c.inst_cd) = UPPER('${data.inst_cd}') `);
   }

   if (data.category) {
      conditions.push(`UPPER(b.category) = UPPER('${data.category}')`);
   }

   if(data.type) {
      conditions.push(`UPPER(b.type) = UPPER('${data.type}')`)
   }

   if(data.mat_nm) {
      conditions.push(`b.mat_nm LIKE '%${data.mat_nm}%'`)
   }

   // WHERE 절 조립
   if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
   }
   query += ` ORDER BY a.mat_out_dt DESC`;
   // 쿼리 반환
   return query;
} 

module.exports = {
   produceHeadPlanList,    // 미지시 생산계획서 조회
   planListSearch,         // 미지시 생산계획서 검색
   getPlanMaterialStock,   // 미지시 생산 계획서에 대한 자재 재고 조회
   getMaterialOrder,       // 발주서 헤더 조회
   getMaterialOrderDetail, // 발주서 디테일 조회
   
   getProduceInstruction,  // 생산완료된 생산지시서 조회
   getMaterialOutForProduction, // 지시서에 대한 자재 출고 내역
};
