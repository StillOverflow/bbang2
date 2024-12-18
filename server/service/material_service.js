const mariadb = require('../database/mapper.js');

const produceHeadPlanList = async() => {
    let list = await mariadb.query('produceHeadPlanList');
    return list;
}

const getPlanMaterialStock = async(code)=> {
    let list = await mariadb.query('getPlanMaterialStock', code);
    return list;
} 

module.exports = {
    produceHeadPlanList,
    getPlanMaterialStock
}