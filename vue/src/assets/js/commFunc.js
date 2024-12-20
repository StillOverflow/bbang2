import axios from "axios";

export default {
  // 단순 날짜 포맷팅용 전역 함수 (value 있으면 해당 날짜를, 없으면 오늘 날짜를 반환)
  getMyDay(value){
    let date = value == null ? new Date() : new Date(value);
    
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + (date.getDate())).slice(-2);

    return year + '-' + month + '-' + day;
  },

  // 두 자리 숫자 포맷팅용 전역 함수1 (1 => 01, 2 => 02 형식으로 반환)
  twoNum(num){
    return ('0' + num).slice(-2);
  },

  // 날짜 포맷 변환 ag-grid 적용 가능 [S]
  dateFormatter(params) { //여기서 ag grid에 date형식을 보냄
    let value = params.value; // getMyDay() 와의 차이점!
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

  // 숫자 포맷 변환 ag-grid 적용 가능 (천단위 콤마 표시)
  currencyFormatter(params){
    if (!params.value || isNaN(params.value)) return '0';
    return Number(params.value).toLocaleString();
  },

   // 공통코드 가져오기 (리턴값 : [{comm_dtl_cd, comm_dtl_nm}, ....])
  async getComm(cd){
    let result = await axios.get('/api/commList/' + cd)
                            .catch(err => console.log(err));
    return result.data;
  }

};

