/* --------------------주문서---------------------- */

//주문서 목록 조회
const orderList = 
`
SELECT o.order_cd, 
       a.act_cd, 
       a.act_nm, 
       m.name, 
       o.order_dt, 
       o.due_dt, 
       (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd=o.status) AS status
FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
                 JOIN member m ON o.ID = m.id
`;
//주문서 거래처,날짜 검색
// const orderSearch =
// `
// SELECT o.order_cd, a.act_cd, a.act_nm, m.name, o.order_dt, o.due_dt, o.status
// FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
// 					JOIN member m ON o.ID = m.id
// WHERE a.act_nm LIKE ? AND DATE(o.order_dt) BETWEEN ? AND ?
// `;
//거래처, 날짜 따로 검색
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

//주문서 등록

// 거래처 조회(모달)
const moAccList = 
`
SELECT act_cd, 
       act_nm, 
       (SELECT comm_dtl_nm FROM common_detail WHERE comm_dtl_cd = act_type) AS act_type
FROM account;
`;






module.exports = {
    orderList,
    orderSearch,
    moAccList,
}
