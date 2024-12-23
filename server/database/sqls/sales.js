
/* -------------------------------------------주문서------------------------------------------------- */

//주문서 목록 조회
const orderList = 
`
SELECT o.order_cd as order_cd, 
       a.act_cd as act_cd, 
       a.act_nm as act_nm, 
       m.name as name, 
       o.order_dt as order_dt, 
       o.due_dt as due_dt, 
       (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd=o.status) AS status,
       (SELECT IFNULL(sum(order_qty),0) FROM order_detail WHERE order_cd=o.order_cd) AS order_cnt,
       (SELECT count(*) FROM order_detail WHERE order_cd=o.order_cd) AS prd_cnt
FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
                 JOIN member m ON o.ID = m.id
`;

//주문서조회-거래처, 날짜 따로 검색
const orderSearch = (searchObj) => {
    //검색 조건인 거래처명, 시작날짜, 끝나는 날짜 가져와서 담음
    const {search, std, etd} = searchObj;
    let query = `
        SELECT o.order_cd, a.act_cd, a.act_nm, m.name, o.order_dt, o.due_dt, o.status
        FROM \`order\` o 
        JOIN account a ON o.act_cd = a.act_cd
        JOIN member m ON o.ID = m.id
    `;
    
    const conditions = [];

    // 거래처명 조건 추가
    if (search) {
        conditions.push(`a.act_nm LIKE '%${search}%'`);
    }
    // 날짜 조건 추가
    if (std && etd) {
        conditions.push(`DATE(o.order_dt) BETWEEN '${std}' AND '${etd}'`);
    }
    // WHERE 절 조립
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }
    // 쿼리 반환
    return query; 
};


//주문 코드 시퀀스 
const orderSeq =
`
SELECT CONCAT('OD', LPAD(nextval(order_cd_seq), 3,'0')) as order_cd FROM DUAL;
`;
//주문서 등록
const orderInsert = (obj) => {
    
    let query = `
                INSERT INTO \`order\` (order_cd, order_dt, due_dt, id, act_cd)
                VALUES 
                `;

    const {seq, order_dt, due_dt, mem_id, act_cd} = obj; 
    
    if(Object.keys(obj).length > 0){    // 객체의 길이를 측정(값이 들어온것을 확인) 

        query += `('${seq}', '${order_dt}', '${due_dt}', '${mem_id}', '${act_cd}')`;

    }
    return query;

}

//주문서 디테일 등록
const orderDtlInsert = ([seq, values]) => {

let sql = `
INSERT INTO order_detail (order_dtl_cd, order_cd, prd_cd, order_qty)
VALUES 
`;

values.forEach((obj) => {
    sql += `(CONCAT('ODT', LPAD(nextval(order_dtl_cd_seq), 3,'0')),'${seq}','${obj.prd_cd}', '${obj.order_qty}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};

/* --------------------------------------------------제품 출고------------------------------------------------------------------ */

//출고 제품 목록 조회
const prdOutList =
`
SELECT d.prd_out_cd, 
       a.act_cd, 
       a.act_nm, 
       m.name, 
       p.prd_out_dt, 
       sum(d.prd_out_qty) AS prd_out_qty
FROM product_out p JOIN  product_out_detail d ON p.prd_out_cd = d.prd_out_cd 
                   JOIN account a ON p.act_cd = a.act_cd
                   JOIN member m ON p.id = m.id
GROUP BY d.prd_out_cd;
`;

//출고제품조회-거래처, 날짜 따로 검색
const prdOutSearch = (searchObj) => {
    //검색 조건인 거래처명, 시작날짜, 끝나는 날짜 가져와서 담음
    const {search, std, etd} = searchObj;
    let query = `
        SELECT d.prd_out_cd, 
        a.act_cd, 
        a.act_nm, 
        m.name, 
        p.prd_out_dt, 
        sum(d.prd_out_qty) AS prd_out_qty
    FROM product_out p JOIN  product_out_detail d ON p.prd_out_cd = d.prd_out_cd 
                    JOIN account a ON p.act_cd = a.act_cd
                    JOIN member m ON p.id = m.id
    `;
    
    const conditions = [];

    // 거래처명 조건 추가
    if (search) {
        conditions.push(`a.act_nm LIKE '%${search}%'`);
    }
    // 날짜 조건 추가
    if (std && etd) {
        conditions.push(`DATE(p.prd_out_dt) BETWEEN '${std}' AND '${etd}'`);
    }
    // WHERE 절 조립
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ") + " GROUP BY d.prd_out_cd ";
    }else { // 조건이 없을때 GROUP BY절만 실행
        query += " GROUP BY d.prd_out_cd ";
    }
    
    // 쿼리 반환
    return query; 
};

// 출고 등록 주문서 조회
const outOrderLit =
`
SELECT o.order_dtl_cd,
       p.prd_cd, 
       p.prd_nm, 
       o.order_qty, 
       (d.prd_out_qty) AS prd_ed, 
       (o.order_qty - d.prd_out_qty) AS no_qty
FROM order_detail o JOIN (SELECT sum(prd_out_qty) AS prd_out_qty, order_dtl_cd from product_out_detail GROUP BY order_dtl_cd) d 
                    ON o.ORDER_DTL_CD = d.ORDER_DTL_CD
					JOIN product p ON o.PRD_CD = p.PRD_CD
WHERE order_cd = ?
`;

//출고 등록 LOT 선택
const outLotList =
`
SELECT p.prd_cd, p.prd_nm, i.stock, i.prd_lot_cd, i.exp_dt
FROM product p JOIN product_in i ON p.prd_cd = i.prd_cd
WHERE p.prd_cd = ?
`;


//출고 코드 시퀀스
const productOutSeq =
`
SELECT CONCAT('POD', LPAD(nextval(prd_out_cd_seq), 3,'0')) AS prd_out_cd FROM DUAL;
`;
//출고 등록 
const productOutInsert = (obj) => {
    let query = `
                INSERT INTO product_out (prd_out_cd, order_cd, act_cd, ID)
                VALUES 
                `;
    const {seq, order_cd, act_cd, ID} = obj; 
    
    if(Object.keys(obj).length > 0){    // 객체의 길이를 측정(값이 들어온것을 확인) 

        query += `('${seq}', '${order_cd}', '${act_cd}', '${ID}')`;

    }
    return query;
};
//출고 디테일 등록
const productOutDtlInsert = ([seq, values]) => {
    let sql = `
              INSERT INTO product_out_detail (prd_out_dtl_cd, prd_out_cd, order_dtl_cd, prd_cd, prd_out_qty, prd_lot_cd, note)
              VALUES
              `;

    values.forEach((obj) => {
        sql += `(CONCAT('PODT', LPAD(nextval(prd_out_dtl_cd_seq), 3,'0')),'${seq}','${obj.order_dtl_cd}', '${obj.prd_cd}', '${obj.prd_out_qty}', '${obj.prd_lot_cd}', '${obj.note}'), `;
    });
    sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

    return sql;

};
//출고 등록시 제품수량 업데이트
const productOutQty = 
` 
UPDATE product_in i JOIN product_out_detail o ON i.prd_cd = o.prd_cd
SET i.stock = (i.stock - o.PRD_OUT_QTY)
WHERE i.prd_lot_cd = ? ; 
`;

/* --------------------------------------------------------------제품 반품----------------------------------------------------------------- */







/* ----------------------------------------------------모달------------------------------------------------------------- */

// 거래처 조회(모달)
const moAccList = 
`
SELECT act_cd, 
       act_nm, 
       (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = act_type) AS act_type
FROM account;
`;
// 담당자 조회(모달)
const moMemList =
`
SELECT m.ID, 
       m.name, 
       d.dpt_nm 
FROM member m 
JOIN department d ON m.dpt_cd = d.dpt_cd;
`;
// 제품 조회(모달)
const moProList =
`
SELECT p.prd_cd, 
       p.prd_nm, 
       sum(i.stock) AS stock
FROM product p 
JOIN product_in i ON p.prd_cd = i.prd_cd
GROUP BY p.prd_nm;
`;
// 주문서 조회(모달)
const moOrderList = 
`
SELECT o.order_cd, a.act_cd, a.act_nm, o.order_dt, o.due_dt 
FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
`;



module.exports = {
    //주문서
    orderList,
    orderSearch,
    orderSeq,
    orderInsert,
    orderDtlInsert,

    //제품출고
    prdOutList,
    prdOutSearch,
    outOrderLit,
    outLotList,
    productOutSeq,
    productOutInsert,
    productOutDtlInsert,
    productOutQty,



    //모달창
    moAccList,
    moMemList,
    moProList,
    moOrderList,

}
