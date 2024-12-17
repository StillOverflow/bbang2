const producePlanHeaderList = `
   SELECT p.prod_plan_cd,
         p.start_dt,
         p.end_dt,
         m.id,
         m.name
   FROM   prod_plan p INNER JOIN member m
   ON     p.id = m.id
   WHERE  prod_plan_cd = (SELECT prod_plan_cd
                          FROM   prod_inst
                          WHERE  UPPER(status) = 'Z01')
`

const getPlanMaterialStock = `
   SELECT   a.prod_plan_dtl_cd "계획서 디테일 코드",
            a.prod_plan_qty    "계획서 상품 수량",
            b.mat_cd           "bom 자재" ,
            c.mat_nm           "자재명",
            f.comm_dtl_nm,
            CONCAT(IFNULL(b.\`usage\`, 0), d.comm_dtl_nm) AS "usage",
            CONCAT(CAST(IFNULL(b.\`usage\`, 0) * IFNULL(a.prod_plan_qty, 0) AS CHAR), d.comm_dtl_nm) AS requir_qty,
            CONCAT(SUM(IFNULL(e.mat_stock, 0)), d.comm_dtl_nm) AS stock_qty,
            CONCAT(SUM(IFNULL(e.mat_stock, 0)) - (IFNULL(b.\`usage\`, 0) * IFNULL(a.prod_plan_qty, 0)), d.comm_dtl_nm) AS lack_qty,
            a.prod_plan_cd "계획서 헤더 코드"
   FROM     prod_plan_dtl a  INNER JOIN bom b 
                                    ON a.prd_cd = b.prd_cd
                           LEFT JOIN material c 
                                    ON b.mat_cd = c.mat_cd
                           LEFT JOIN common_detail d 
                                    ON d.comm_dtl_cd = b.unit
                           LEFT JOIN common_detail f
                                    ON f.comm_dtl_cd = c.\`type\`
                           LEFT OUTER JOIN material_in e 
                                    ON b.mat_cd = e.mat_cd
   WHERE    a.prod_plan_cd = UPPER(?)
   GROUP BY a.prod_plan_dtl_cd, 
            a.prd_cd, 
            a.prod_plan_qty, 
            b.mat_cd, 
            c.mat_nm, 
            d.comm_dtl_nm, 
            b.\`usage\`, 
            a.prod_plan_cd
   ORDER BY a.prod_plan_cd, a.prd_cd, b.mat_cd
`

module.exports = {
   producePlanHeaderList,
   getPlanMaterialStock,

};
