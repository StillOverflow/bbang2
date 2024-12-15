//----------------bom----------------------

//전체 제품조회
const prdList = 
`
select distinct p.prd_cd, p.prd_nm, b.usage_sta
from product p
join bom b on p.prd_cd = b.prd_cd
`
//자재 목록 조회
const matList =
`
select mat_cd, mat_nm, type
from material
`

//bom 조회
const bomlist = 
`
select b.prd_cd, b.mat_cd, m.mat_nm, m.price, b.usage , b.unit
from bom b
join material m on b.mat_cd = m.mat_cd
where b.prd_cd = ?
`
//bom 자재추가
const bomInsert = 
`
insert into bom (prd_cd, mat_cd, usage)
values(?, ?, ?)
`
//bom 자재삭제
const bomDel =
`
delete from bom
where prd_cd = ?
and mat_cd = ?
`
//--------------공정흐름도-----------------




module.exports = {
    bomlist,
    prdList,
    matList,
    bomInsert,
    bomDel
};
