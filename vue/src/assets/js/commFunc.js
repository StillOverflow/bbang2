export default {
  // 날짜 포맷팅용 전역 함수 (value 있으면 해당 날짜를, 없으면 오늘 날짜를 반환)
  getMyDay(value){
    let date = value == null ? new Date() : new Date(value);
    
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + (date.getDate())).slice(-2);

    return year + '-' + month + '-' + day;
  },

  // 숫자 포맷팅용 전역 함수1 (1 => 01, 2 => 02 형식으로 반환)
  twoNum(num){
    return ('0' + num).slice(-2);
  },

  // 날짜 포맷 변환 ag-grid 적용 가능 [S]
  dateFormatter(params) { //여기서 ag grid에 date형식을 보냄
    let value = params.value;
    let format = 'yyyy-MM-dd';
    let date = value == null ? new Date() : new Date(value);

    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);

    let result = format.replace('yyyy', year)
                    .replace('MM', month)
                    .replace('dd', day);
    return result;
  },
  // 날짜 포맷 변환 ag-grid 적용 가능 [E]

};

