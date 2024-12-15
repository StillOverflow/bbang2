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
					JOIN member m ON o.ID = m.id;
`;
//주문서 거래처 검색
const orderSearch =
`
SELECT o.order_cd, a.act_cd, a.act_nm, m.name, o.order_dt, o.due_dt, o.status
FROM \`order\` o JOIN account a ON o.act_cd = a.act_cd
					JOIN member m ON o.ID = m.id
WHERE a.act_nm LIKE ?
`;

module.exports = {
    orderList,
    orderSearch,
}
