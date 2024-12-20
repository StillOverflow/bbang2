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

const getPlanMaterialStock = `
   SELECT   b.mat_cd,
            c.mat_nm,
            fn_get_codename(c.type) \`type\`,
            b.require_qty,
            CONCAT(IFNULL(b.require_qty, 0), fn_get_codename(c.unit)) AS total_qty,
            CONCAT(IFNULL(e.mat_stock, 0), fn_get_codename(c.unit)) AS stock_qty,
            CONCAT(IFNULL(e.mat_stock, 0) - IFNULL(b.require_qty, 0), fn_get_codename(c.unit)) AS lack_qty
   FROM    (SELECT  mat_cd ,
                    SUM(a.qty) AS require_qty
            FROM    (SELECT z.prd_cd,
                           p.mat_cd,
                           (z.prod_plan_qty * p.\`usage\`) AS qty
                     FROM   prod_plan_dtl z LEFT JOIN bom p
                                          ON z.prd_cd = p.prd_cd 
                     WHERE  z.prod_plan_cd = UPPER( ? )) a
            GROUP BY mat_cd ) b LEFT JOIN material c
                                       ON b.mat_cd = c.mat_cd
                              LEFT OUTER JOIN (select mat_cd, sum(mat_stock) mat_stock from material_in GROUP BY mat_cd)  e 
                                       ON b.mat_cd = e.mat_cd
   ORDER BY b.mat_cd
`

module.exports = {
   produceHeadPlanList,
   getPlanMaterialStock,

};
