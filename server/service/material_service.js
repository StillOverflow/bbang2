const mariadb = require('../database/mapper.js');

const producePlanList = async() => {
    let list = await mariadb.query('producePlanList');
    return list;
}

module.exports = {
    //메소드명
}