
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
       (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd=o.status) AS status
FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
                 JOIN member m ON o.ID = m.id
ORDER BY order_cd DESC
`;

//주문서조회-거래처, 날짜 따로 검색
const orderSearch = (searchObj) => {
    //검색 조건인 거래처명, 시작날짜, 끝나는 날짜 가져와서 담음
    const {search, std, etd, not_status} = searchObj;
    let query = `
        SELECT o.order_cd, 
               a.act_cd, 
               a.act_nm, m.name, o.order_dt, o.due_dt, 
               (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd=o.status) AS status,
               (SELECT IFNULL(sum(order_qty),0) FROM order_detail WHERE order_cd=o.order_cd) AS order_cnt,
               (SELECT count(*) FROM order_detail WHERE order_cd=o.order_cd) AS prd_cnt
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
    // 상태 조건 추가
    if (not_status) {
        conditions.push(`o.status != '%${not_status}%'`);
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
INSERT INTO order_detail (order_dtl_cd, order_cd, prd_cd, order_qty, note)
VALUES 
`;

values.forEach((obj) => {
    sql += `(CONCAT('ODT', LPAD(nextval(order_dtl_cd_seq), 3,'0')),'${seq}','${obj.prd_cd}', '${obj.order_qty}', '${obj.note}'), `;
  });
  sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

  return sql;
};

//주문서 상세(헤드부분)
const orderDtlList =
`
SELECT a.act_nm, o.act_cd, o.id, m.name, o.order_dt, o.due_dt, o.status
FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
					JOIN member m ON o.id = m.id
WHERE order_cd = ?
`;

//주문서 상세(디테일부분)
const dtlOrderDtlList =
`
SELECT o.prd_cd, p.prd_nm, o.order_qty, o.note, o.order_dtl_cd
FROM order_detail o JOIN product p ON o.prd_cd = p.prd_cd
WHERE order_cd = ?
`;

//주문서 삭제
const orderDelete =
`
DELETE \`order\`,order_detail  
FROM \`order\` \`order\` JOIN order_detail order_detail ON \`order\`.order_cd = order_detail.order_cd 
WHERE \`order\`.order_cd = ?
`;

//주문서 단건삭제
const orderListDelete =
`
DELETE FROM order_detail WHERE order_dtl_cd = ?
`;

//주문서 수정
const orderUpdate = 
`
UPDATE order_detail SET ? WHERE order_dtl_cd = ?
`;

//주문서 수정을 위한 삭제
const orderUpdateDelete =
`
DELETE FROM order_detail WHERE order_cd = ?
`;

//주문서 수정을 위한 등록
const orderUpdateInsert = (values) => {

    let sql = `
    INSERT INTO order_detail (order_dtl_cd, 
                              order_cd, 
                              prd_cd, 
                              order_qty, 
                              note)
    VALUES 
    `;

    values.forEach((obj) => {
        sql += `(CONCAT('ODT', LPAD(nextval(order_dtl_cd_seq), 3,'0')),'${obj.order_cd}','${obj.prd_cd}', '${obj.order_qty}', '${obj.note}'), `;
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
       sum(d.prd_out_qty) AS prd_out_qty,
       (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = o.status) AS status
FROM product_out p JOIN  product_out_detail d ON p.prd_out_cd = d.prd_out_cd 
                   JOIN account a ON p.act_cd = a.act_cd
                   JOIN member m ON p.id = m.id
                   JOIN \`order\` o ON p.order_cd = o.order_cd
GROUP BY d.prd_out_cd
ORDER BY p.prd_out_cd DESC
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
SELECT a.order_dtl_cd	  
	  ,a.prd_cd
      ,(SELECT prd_nm FROM product WHERE prd_cd = a.prd_cd) AS prd_nm
	  ,order_qty
	  ,IFNULL(prd_out_qty,0) AS prd_out_qty
      ,(order_qty - ifnull(prd_out_qty,0)) AS no_qty	 
from
    (SELECT 
        od.ORDER_DTL_CD as order_dtl_cd,
        od.PRD_CD AS prd_cd,
        od.ORDER_QTY AS order_qty
    FROM 
    \`order\` o join order_detail od ON o.order_cd=od.order_cd 
    WHERE o.order_cd= ? )a
LEFT JOIN
    (SELECT sum(prd_out_qty) AS prd_out_qty, ORDER_DTL_CD from product_out_detail GROUP BY order_dtl_cd) b
    ON a.ORDER_DTL_CD=b.ORDER_DTL_CD;
`;

// SELECT o.order_dtl_cd,
//        p.prd_cd, 
//        p.prd_nm, 
//        o.order_qty, 
//        (d.prd_out_qty) AS prd_ed, 
//        (o.order_qty - d.prd_out_qty) AS no_qty
// FROM order_detail o JOIN (SELECT sum(prd_out_qty) AS prd_out_qty, order_dtl_cd from product_out_detail GROUP BY order_dtl_cd) d 
//                     ON o.ORDER_DTL_CD = d.ORDER_DTL_CD
// 					JOIN product p ON o.PRD_CD = p.PRD_CD
// WHERE order_cd = ?


//출고 등록 LOT 선택
const outLotList =
`
SELECT p.prd_cd, 
       p.prd_nm, 
       i.stock, 
       i.prd_lot_cd, 
       i.exp_dt
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

    query += `('${seq}', '${order_cd}', '${act_cd}', '${ID}')`;

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
UPDATE product_in i JOIN product_out_detail o ON i.prd_lot_cd = o.prd_lot_cd
SET i.stock = (i.stock - ? )
WHERE i.prd_lot_cd = ? ; 
`;
//출고 등록시 상태 변경
const orderStautsPrdOut =
`
UPDATE \`order\` SET \`status\` = 'J04' WHERE order_cd = ?
`;

//출고 제품 상세(헤드)
const prdOutDtlList =
`
SELECT p.order_cd, a.act_nm, p.act_cd, o.order_dt, o.due_dt, m.name, p.id
FROM product_out p JOIN \`order\` o ON p.order_cd = o.order_cd
						 JOIN account a ON p.act_cd = a.act_cd
						 JOIN member m ON p.id = m.id
WHERE prd_out_cd = ?
`;

//출고 제품 상세(디테일 LOT)
const prdOutDtlLotList =
`
SELECT o.order_dtl_cd, o.prd_lot_cd, p.prd_nm, i.exp_dt, i.stock, o.prd_out_qty, o.note, o.prd_out_dtl_cd
FROM product_out_detail o JOIN product_in i ON o.prd_lot_cd = i.prd_lot_cd
								  JOIN product p ON o.prd_cd = p.prd_cd
WHERE prd_out_cd = ?
`;

//출고 제품 삭제
const prdOutDelete =
`
DELETE product_out, product_out_detail  
FROM product_out product_out LEFT JOIN product_out_detail product_out_detail ON product_out.prd_out_cd = product_out_detail.prd_out_cd 
WHERE product_out.prd_out_cd = ?
`;
//출고 제품 삭제시 상태 원복
const prdOutDeleteStatus =
`
UPDATE \`order\` SET \`status\` = 'J01' WHERE order_cd = ?
`;
//출고 제품 삭제시 제품수량 원복
const prdOutDeleteQty = 
` 
UPDATE product_in i JOIN product_out_detail o ON i.prd_lot_cd = o.prd_lot_cd
SET i.stock = ( i.stock + ? )
WHERE i.prd_lot_cd = ? ; 
`;

//출고 제품 단건삭제
const prdOutListDelete =
`
DELETE FROM product_out_detail WHERE prd_out_dtl_cd = ?
`;

//출고 제품 수정
const prdOutUpdate =
`
UPDATE product_out_detail SET ? WHERE prd_out_dtl_cd = ?
`;

//출고 제품 수정을 위한 등록
const prdOutUpdateInsert = (values) => {
    let sql = `
              INSERT INTO product_out_detail (prd_out_dtl_cd, prd_out_cd, order_dtl_cd, prd_cd, prd_out_qty, prd_lot_cd, note)
              VALUES
              `;

    values.forEach((obj) => {
        sql += `(CONCAT('PODT', LPAD(nextval(prd_out_dtl_cd_seq), 3,'0')),'${obj.prd_out_cd}','${obj.order_dtl_cd}', '${obj.prd_cd}', '${obj.prd_out_qty}', '${obj.prd_lot_cd}', '${obj.note}'), `;
    });
    sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

    return sql;

};

//출고 완료시 제품수량 업데이트
const productOutEndQty = 
` 
UPDATE product_in i JOIN product_out_detail o ON i.prd_lot_cd = o.prd_lot_cd
SET i.stock = (i.stock - ? )
WHERE i.prd_lot_cd = ? ; 
`;
//출고 완료시 상태 변경
const orderStautsPrdOutEnd =
`
UPDATE \`order\` SET \`status\` = 'J03' WHERE order_cd = ?
`;
//출고 완료 확인
const prdOutEnd =
`
SELECT \`status\` FROM \`order\` WHERE order_cd = ?
`;



/* --------------------------------------------------------------제품 반품----------------------------------------------------------------- */

//반품 제품 목록 조회
const returnList =
`
SELECT r.prd_return_cd,
		 m.name, 
		 a.act_nm, 
		 r.act_cd, 
		 r.prd_return_dt, 
		 sum(d.prd_return_qty) AS prd_return_qty, 
		 (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = r.prd_return_receipt) AS prd_return_receipt
FROM product_return r JOIN account a ON r.act_cd = a.act_cd
                      JOIN member m ON r.id = m.id
                      JOIN product_return_detail d ON r.prd_return_cd = d.prd_return_cd
GROUP BY r.prd_return_cd
ORDER BY r.prd_return_cd DESC;
`;

//반품제품조회-거래처, 날짜 따로 검색
const returnSearch = (searchObj) => {
    //검색 조건인 거래처명, 시작날짜, 끝나는 날짜 가져와서 담음
    const {search, std, etd} = searchObj;
    let query = `
  SELECT r.prd_return_cd,
		 m.name, 
		 a.act_nm, 
		 r.act_cd, 
		 r.prd_return_dt, 
		 sum(d.prd_return_qty) AS prd_return_qty, 
		 (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = r.prd_return_receipt) AS prd_return_receipt
    FROM product_return r JOIN account a ON r.act_cd = a.act_cd
                          JOIN member m ON r.id = m.id
                          JOIN product_return_detail d ON r.prd_return_cd = d.prd_return_cd
    `;
    
    const conditions = [];

    // 거래처명 조건 추가
    if (search) {
        conditions.push(`a.act_nm LIKE '%${search}%'`);
    }
    // 날짜 조건 추가
    if (std && etd) {
        conditions.push(`DATE(r.prd_return_dt) BETWEEN '${std}' AND '${etd}'`);
    }
    // WHERE 절 조립
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY r.prd_return_cd ";
    
    
    // 쿼리 반환
    return query; 
};

//반품등록 출고목록 조회
const returnPOutList =
`
SELECT d.prd_out_dtl_cd, d.prd_cd, p.prd_nm, sum(d.prd_out_qty) AS prd_out_qty 
FROM product_out_detail d JOIN product p ON d.prd_cd = p.prd_cd
WHERE d.prd_out_cd = ?
GROUP BY prd_cd;
`;

//반품등록 LOT선택
const returnLot = (searchObj) => {
    //prd_ou_cd = pocd, prd_cd = pdcd
    const {pocd, pdcd} = searchObj;

    let query = `
    SELECT d.prd_lot_cd, d.prd_cd, p.prd_nm, d.prd_out_qty, d.prd_out_dtl_cd 
    FROM product p JOIN product_out_detail d ON d.prd_cd = p.prd_cd
    WHERE prd_out_cd = '${pocd}' 
      AND d.prd_cd = '${pdcd}'
    `;

    return  query;

};

//반품 코드 시퀀스
const productReturnSeq =
`
SELECT CONCAT('PRC', LPAD(nextval(prd_out_cd_seq), 3,'0')) AS prd_return_cd FROM DUAL;
`;
//반품 등록
const productReturnInsert = (obj) => {
    let query = `
                INSERT INTO product_return (prd_return_cd, prd_out_cd, act_cd, id)
                VALUES 
                `;
    const {seq, prd_out_cd, act_cd, ID} = obj; 
    
    if(Object.keys(obj).length > 0){    // 객체의 길이를 측정(값이 들어온것을 확인) 

        query += `('${seq}', '${prd_out_cd}', '${act_cd}', '${ID}')`;

    }
    return query;
};

//반품 디테일 등록
const productReturnDtlInsert = ([seq, values]) => {
    let sql = `
              INSERT INTO product_return_detail (prd_return_dtl_cd, prd_return_cd, prd_out_dtl_cd, prd_cd, prd_lot_cd, prd_return_qty, note)
              VALUES 
              `;

    values.forEach((obj) => {
        sql += `(CONCAT('PRDC', LPAD(nextval(prd_out_dtl_cd_seq), 3,'0')),'${seq}','${obj.prd_out_dtl_cd}', '${obj.prd_cd}', '${obj.prd_lot_cd}', '${obj.prd_return_qty}', '${obj.note}'), `;
    });
    sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

    return sql;

};

//반품 제품 상세(헤드)
const returnDtlList = 
`
SELECT r.prd_out_cd, p.prd_out_dt, a.act_nm, r.act_cd, m.name, r.id
FROM product_return r JOIN product_out p ON r.prd_out_cd = p.prd_out_cd
							 JOIN account a ON r.act_cd = a.act_cd
							 JOIN member m ON r.id = m.id
WHERE prd_return_cd = ?
`;

//반품 제품 상세(디테일)
const dtlReturnDtlList = (searchObj) => {
    const {rtcd, pdcd} = searchObj;

    let query = `
    SELECT r.prd_cd, r.prd_lot_cd, o.prd_out_qty, r.prd_return_qty, r.note
    FROM product_return_detail r JOIN product_out_detail o ON r.prd_out_dtl_cd = o.prd_out_dtl_cd
    WHERE prd_return_cd = '${rtcd}' AND r.prd_cd = '${pdcd}'
    `;

    return query;
};

//반품 제품 상세(디테일 LOT)
const returnDtlLotList = 
`
SELECT r.prd_return_dtl_cd, r.prd_cd, r.prd_return_qty, r.note, r.prd_lot_cd, r.prd_out_dtl_cd, d.prd_out_qty 
FROM product_return_detail r JOIN product_out_detail d ON r.prd_out_dtl_cd = d.prd_out_dtl_cd
WHERE prd_return_cd = ?
`;

//반품 제품 삭제
const returnDelete =
`
DELETE product_return, product_return_detail  
FROM product_return product_return LEFT JOIN product_return_detail product_return_detail ON product_return.prd_return_cd = product_return_detail.prd_return_cd 
WHERE product_return.prd_return_cd = ?
`;

//반품 제품 단건 삭제
const returnListDelete =
`
DELETE FROM product_return_detail WHERE prd_return_dtl_cd = ?
`;

//반품 제품 수정
const returnUpdate =
`
UPDATE product_return_detail SET ? WHERE prd_return_dtl_cd = ?
`;

//반품 수정을 위한 삭제
const returnUpdateDelete = 
`
DELETE FROM product_return_detail WHERE prd_return_cd = ?
`;

//반품 수정을 위한 등록
const returnUpdateInsert = (values) => {
    let sql = `
    INSERT INTO product_return_detail ( prd_return_dtl_cd,
                                        prd_return_cd,
                                        prd_cd,
                                        prd_return_qty,
                                        note,
                                        prd_lot_cd,
                                        prd_out_dtl_cd)
    VALUES
    `;

    values.forEach((obj) => {
        sql += `(CONCAT('PRDC', LPAD(nextval(prd_out_dtl_cd_seq), 3,'0')),'${obj.prd_return_cd}','${obj.prd_cd}', '${obj.prd_return_qty}', '${obj.note}', '${obj.prd_lot_cd}', '${obj.prd_out_dtl_cd}'), `;
    });
    sql = sql.substring(0, sql.length - 2); // 마지막 ,만 빼고 반환

    return sql;
};


/* ----------------------------------------------------제품 재고 조회------------------------------------------------------------- */

// 제품 재고 조회
const productAllList =
`
SELECT p.prd_cd, 
       p.prd_nm, 
		 stock, 
		 prd_qty, 
		 ifnull(sum(prd_out_qty),0) AS prd_out_qty
FROM product p JOIN (SELECT prd_cd, sum(stock) AS stock, sum(prd_qty) AS prd_qty from product_in GROUP BY prd_cd) i ON p.prd_cd = i.prd_cd
				LEFT JOIN product_out_detail o ON p.prd_cd = o.prd_cd
GROUP BY p.prd_cd
`;

// 제품명 검색
const prdAllListSearch =
`
SELECT p.prd_cd, 
       p.prd_nm, 
       sum(i.stock) AS stock, 
       sum(i.prd_qty) AS prd_qty, 
       ifnull(sum(o.prd_out_qty),0) AS prd_out_qty
FROM product p JOIN product_in i ON p.prd_cd = i.prd_cd
			    LEFT JOIN product_out_detail o ON p.prd_cd = o.prd_cd
WHERE p.prd_nm LIKE "%"?"%"
GROUP BY p.prd_cd;	
`;

// 제품당 LOT조회
const prdLotList =
`
SELECT p.prd_nm, i.prd_lot_cd, i.prd_qty, i.stock, i.exp_dt, i.prd_in_dt
FROM product p JOIN product_in i ON p.prd_cd = i.prd_cd
WHERE p.prd_cd = ?
`;

/* ----------------------------------------------------모달------------------------------------------------------------- */

// 거래처 조회(모달)
const moAccList = 
`
SELECT act_cd, 
       act_nm, 
       (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = act_type) AS act_type
FROM account;
`;
// 영업 담당자 조회(모달)
const moMemList =
`
SELECT m.ID, 
       m.name, 
       d.dpt_nm 
FROM member m 
JOIN department d ON m.dpt_cd = d.dpt_cd
WHERE d.dpt_nm = '영업팀'
`;
// 제품 조회(모달)
const moProList =
`
SELECT p.prd_cd, 
       p.prd_nm, 
       sum(i.stock) AS stock
FROM product p 
LEFT JOIN product_in i ON p.prd_cd = i.prd_cd
GROUP BY p.prd_nm
ORDER BY p.prd_cd
`;
// 주문서 조회(모달)
const moOrderList = 
`
SELECT o.order_cd, a.act_cd, a.act_nm, o.order_dt, o.due_dt 
FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
WHERE o.status = 'J01' 
   OR o.status = 'J02'
`;
//출고목록 조회(모달)
const moPrdOutList = 
`
SELECT p.prd_out_cd, p.act_cd, a.act_nm, m.name, p.prd_out_dt
FROM product_out p JOIN account a ON p.ACT_CD = a.act_cd
						 JOIN member m ON p.id = m.id
						 JOIN \`order\` o ON p.order_cd = o.order_cd
WHERE o.status = 'J03'
`;



module.exports = {
    //주문서
    orderList,
    orderSearch,
    orderSeq,
    orderInsert,
    orderDtlInsert,
    orderDtlList,
    dtlOrderDtlList,
    orderDelete,
    orderListDelete,
    orderUpdate,
    orderUpdateDelete,
    orderUpdateInsert,
    

    //제품출고
    prdOutList,
    prdOutSearch,
    outOrderLit,
    outLotList,
    productOutSeq,
    productOutInsert,
    productOutDtlInsert,
    productOutQty,
    orderStautsPrdOut,
    prdOutDtlList,
    prdOutDtlLotList,
    prdOutDelete,
    prdOutDeleteStatus,
    prdOutDeleteQty,
    prdOutListDelete,
    prdOutUpdate,
    prdOutUpdateInsert,
    productOutEndQty,
    orderStautsPrdOutEnd,
    prdOutEnd,

    //제품반품
    returnList,
    returnSearch,
    returnPOutList,
    returnLot,
    productReturnSeq,
    productReturnInsert,
    productReturnDtlInsert,
    returnDtlList,
    dtlReturnDtlList,
    returnDtlLotList,
    returnDelete,
    returnListDelete,
    returnUpdate,
    returnUpdateDelete,
    returnUpdateInsert,

    //제품재고조회
    productAllList,
    prdAllListSearch,
    prdLotList,

    //모달창
    moAccList,
    moMemList,
    moProList,
    moOrderList,
    moPrdOutList

}
