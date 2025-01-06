//! ------------------------------ 자재 발주서(미지시 생산계획) ------------------------------
// 미지시 생산 계획서 조회
const produceHeadPlanList = `
   SELECT
      prod_plan_cd,
      order_cd,
      fn_get_membername(id) AS name,
      start_dt,
      end_dt,
      status,
      update_dt,
      create_dt
   FROM
      prod_plan
   WHERE
      UPPER(STATUS) = UPPER('Z01')
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

//! ----------------------------------- 자재 입고관리 -----------------------------------
// 자재 입고전 대기목록 조회
const getMaterialBeforeIn = `
   SELECT 
      test_rec_cd,                       -- 검사내역코드
      refer_cd,                          -- 자재 발주서 번호
      target_type,                       -- 대상유형 (p01)
      target_cd,                         -- 대상코드
      mat_nm,                            -- 자재명
      fn_get_codename(unit) AS unit,     -- 자재단위
      fn_get_codename(\`type\`) AS type, -- 자재구분
      pass_qty                           -- 합격량
   FROM
      quality_test_record a
   LEFT OUTER JOIN
      material b ON target_cd = mat_cd
   WHERE 
      UPPER(target_type) = UPPER('p01')
   AND
      NOT EXISTS (
                  SELECT 1
                  FROM material_in mi
                  WHERE mi.test_rec_cd = a.test_rec_cd
                  )
`

// 자재 LOT 마지막값에서 +1한 값
const materialLotSeq = `
   SELECT CONCAT('MATLOT', 
                  DATE_FORMAT(NOW(), '%Y%m%d'),
                  LPAD(
                        COALESCE(MAX(CAST(RIGHT(mat_lot_cd, 4) AS UNSIGNED)), 0) + 1,
                        4,
                        '0'
                     )
               ) AS seq
   FROM material_in;
` 

// 자재 입고 등록
const insertMaterial = `
   INSERT INTO material_in
   SET ?
`

// 자재발주서 디테일 상태변환
const updateMatOrderDtlStatus = `
   UPDATE material_order_detail a
      LEFT JOIN (
         SELECT 
            mat_order_cd, 
            mat_cd, 
            sum(mat_qty) AS total_in_qty
         FROM 
            material_in
         WHERE 
            mat_order_cd = ?
         GROUP BY
            mat_order_cd, 
            mat_cd
      ) b ON a.mat_cd = b.mat_cd
   SET a.STATUS = CASE 
                     WHEN IFNULL(b.total_in_qty, 0) > 1 AND IFNULL(b.total_in_qty, 0) < a.mat_qty THEN 'L02' -- 일부만 입고되었으면 입고중
                     WHEN IFNULL(b.total_in_qty, 0) = a.mat_qty THEN 'L03' -- 발주 수량과 동일하면 입고완료
                     ELSE a.STATUS                              -- 기본 상태 유지
                  END
   WHERE a.mat_order_cd = ?
`














//! ----------------------------------- 자재 재고조회 -----------------------------------
// 자재 재고조회
const getMaterialStockList = `
   SELECT   
      a.mat_lot_cd,                            -- 자재 LOT
      fn_get_materialname(a.mat_cd) AS mat_nm, -- 자재 코드
      sum(a.mat_qty) mat_qty,                  -- 입고량
      sum(a.mat_stock) AS mat_stock,           -- 재고량
      a.exp_dt,                                -- 유통기한
      a.mat_int_dt,                            -- 입고일시
      fn_get_membername(a.id) AS name,         -- 담당자
      a.create_dt,                             -- 등록일
      a.update_dt,                             -- 수정일
      a.test_rec_cd,                           -- 검사내역코드
      a.mat_order_cd,                          -- 발주서 코드
      fn_get_codename(b.category) AS category, -- 카테고리
      fn_get_codename(b.unit) AS unit,         -- 단위
      fn_get_codename(\`type\`) AS type,       -- 자재 구분
      b.safe_stk                               -- 안전재고
   FROM    
      material_in a 
   INNER JOIN 
      material b ON a.mat_cd = b.mat_cd
   GROUP BY
      a.mat_cd
   ORDER BY 
      CAST(SUBSTRING(a.mat_lot_cd, 7) AS UNSIGNED) DESC,
      b.mat_nm ASC
`

// 자재 LOT별 재고조회
const getMaterialStockLotList = `
   SELECT   
      a.mat_lot_cd,                            -- 자재 LOT
      fn_get_materialname(a.mat_cd) AS mat_nm, -- 자재 코드
      a.mat_qty mat_qty,                  -- 입고량
      a.mat_stock AS mat_stock,           -- 재고량
      a.exp_dt,                                -- 유통기한
      a.mat_int_dt,                            -- 입고일시
      fn_get_membername(a.id) AS name,         -- 담당자
      a.create_dt,                             -- 등록일
      a.update_dt,                             -- 수정일
      a.test_rec_cd,                           -- 검사내역코드
      a.mat_order_cd,                          -- 발주서 코드
      fn_get_codename(b.category) AS category, -- 카테고리
      fn_get_codename(b.unit) AS unit,         -- 단위
      fn_get_codename(\`type\`) AS TYPE,         -- 자재 구분
      b.safe_stk
   FROM    
      material_in a 
   INNER JOIN 
      material b ON a.mat_cd = b.mat_cd
   ORDER BY 
      CAST(SUBSTRING(a.mat_lot_cd, 7) AS UNSIGNED) DESC,
      b.mat_nm ASC
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
         prod_inst   -- 생산 지시서
      WHERE
         UPPER(STATUS) <> 'Z01'  -- 진행전이 아닌것
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
   query += ` ORDER BY work_dt DESC `;
   // 쿼리 반환
   return query;
}

// 자재 출고 내역
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

   if (data.inst_cd) {  // 생산 지시서 코드
      conditions.push(`UPPER(c.inst_cd) = UPPER('${data.inst_cd}') `);
   }

   if (data.category) { // 카테고리
      conditions.push(`UPPER(b.category) = UPPER('${data.category}')`);
   }

   if(data.type) {   // 자재 유형   
      conditions.push(`UPPER(b.type) = UPPER('${data.type}')`)
   }

   if(data.mat_nm) { // 자재명
      conditions.push(`b.mat_nm LIKE '%${data.mat_nm}%'`)
   }

   // WHERE 절 조립
   if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
   }
   query += ` ORDER BY inst_dtl_cd DESC, a.mat_out_dt DESC`;
   // 쿼리 반환
   return query; 
}

module.exports = {
   produceHeadPlanList,         // 미지시 생산계획서 조회
   planListSearch,              // 미지시 생산계획서 검색
   getPlanMaterialStock,        // 미지시 생산 계획서에 대한 자재 재고 조회
   getMaterialOrder,            // 발주서 헤더 조회
   getMaterialOrderDetail,      // 발주서 디테일 조회

   getMaterialBeforeIn,         // 자재 입고전 대기목록
   materialLotSeq,              // LOT seq값
   insertMaterial,              // 자재 등록
   updateMatOrderDtlStatus,     // 자재 발주서 디테일 상태변환

   getMaterialStockList,        // 제품 총 재고
   getMaterialStockLotList,     // 제품 LOT별 재고

   getProduceInstruction,       // 생산완료된 생산지시서 조회
   getMaterialOutForProduction, // 지시서에 대한 자재 출고 내역

};
