//----------------bom----------------------

//전체 제품조회
const prdList = 
`
select distinct p.prd_cd, p.prd_nm, b.usage_sta
from product p
left join bom b 
on p.prd_cd = b.prd_cd
`;
//제품 키워드 검색
const prdSearch=
`
select distinct p.prd_cd, p.prd_nm, b.usage_sta
from product p
left join bom b 
on p.prd_cd = b.prd_cd
where p.prd_nm like ?
`;
//자재 목록 조회
const matList =
`
select mat_cd, mat_nm, type, unit
from material
`;
//자재 키워드 검색
const matSearch =
`
select mat_cd, mat_nm, type
from material
where mat_nm like ?
`;
//bom 조회
const bomlist = 
`
select b.prd_cd, b.mat_cd, m.mat_nm, m.price, b.usage , b.unit
from bom b
join material m on b.mat_cd = m.mat_cd
where b.prd_cd = ?
`;
//bom 자재추가
const bomInsert = 
`
insert into bom
set  ?
`
//bom 자재삭제
const bomDel =
`
delete from bom
where prd_cd = ?
and mat_cd = ?
`;
//--------------공정흐름도-----------------
//선택할 제품조회 위에있음

//선택한 제품의 공정흐름도 조회

//공정코드 조회(모달)

//공정흐름도에 선택한 공정코드 등록

//공정흐름도의 공정코드 삭제

//선택한 제품의 bom조회 위에있음

//bom내역에서 선택한 자재 공정흐름도 공정코드에 등록

//선택한 공정흐름도의 공정코드에대한 자재정보 조회

//선택한 공정흐름도의 공정코드에대한 자재삭제



module.exports = {
    bomlist,
    prdList,
    matList,
    bomInsert,
    bomDel,
    prdSearch,
    matSearch
};
