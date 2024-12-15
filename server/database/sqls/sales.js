//주문서 목록
const orderList = 
`
SELECT o.order_cd,
       a.act_cd,
       a.act_nm, 
       m.name, 
       o.order_dt, 
       o.due_dt, 
       o.status
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

const orderSearch = (search, std, etd) => {
    let query = `
        SELECT o.order_cd, a.act_cd, a.act_nm, m.name, o.order_dt, o.due_dt, o.status
        FROM \`order\` o 
        JOIN account a ON o.act_cd = a.act_cd
        JOIN member m ON o.ID = m.id
    `;
    
    const conditions = [];
    const params = [];

    // 거래처명 조건 추가
    if (search) {
        conditions.push(`a.act_nm LIKE "%"?"%"`);
        params.push(search);
        console.log("params결과"+params);
    }

    // 날짜 조건 추가
    if (std && etd) {
        conditions.push("DATE(o.order_dt) BETWEEN ? AND ?");
        params.push(std, etd);
    }

    // WHERE 절 조립
    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    return { query, params }; // 쿼리와 매개변수를 반환
};

module.exports = {
    orderList,
    orderSearch,
}
