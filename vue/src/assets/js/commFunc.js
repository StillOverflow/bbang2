import axios from "axios";

export default {
  //////////////////////////////// 일반 ////////////////////////////////

  // 단순 날짜 포맷팅용 전역 함수 (value 있으면 해당 날짜를, 없으면 오늘 날짜를 반환)
  getMyDay(value){
    let date = value == null ? new Date() : new Date(value);
    
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + (date.getDate())).slice(-2);

    return year + '-' + month + '-' + day;
  },

  // 단순 숫자 포맷팅용 전역 함수 (천단위 콤마 표시)
  getCurrency(num){
    if (!num) return '0';
    return Number(num).toLocaleString();
  },

  // 날짜+시간 포맷 변환 일반 (시/분/초까지) (데이터타입 DATETIME)
  getDateTime(){
    // 현재 날짜와 시간을 가져오기
    const currentDate = new Date();

    // 각 구성 요소를 가져오기
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // 날짜와 시간을 문자열로 포맷팅
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedDate;
  },

  // 날짜+시간 포맷 변환 일반 (시/분까지) (데이터타입 DATETIME)
  getDatetimeMin(value){
    if(!value) return null; // null이면 null 그대로 리턴

    let newDate = new Date(value);
    // 2024-12-12T03:00:00.000Z => 2024-12-12, 12:00로 변환
    let strDate = newDate.toLocaleDateString('en-CA', { // en-CA => 국가별 날짜형식(0000-00-00)
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      hour12: false, // 24시간
      minute: 'numeric'
    });
    return strDate.replace(',', ''); // 쉼표 제거 (2024-12-12 12:00)
  },

    // 날짜+시간 포맷 변환 일반 (시/분/초까지) (데이터타입 DATETIME)
  getDatetimeMinSec(value){
    if(!value) return null; // null이면 null 그대로 리턴

    let newDate = new Date(value);
    // 2024-12-12T03:00:00.000Z => 2024-12-12, 12:00로 변환
    let strDate = newDate.toLocaleDateString('en-CA', { // en-CA => 국가별 날짜형식(0000-00-00)
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      hour12: false, // 24시간
      minute: 'numeric',
      second: 'numeric'
    });
    return strDate.replace(',', ''); // 쉼표 제거 (2024-12-12 12:00)
  },


  










  




























  ////////////////////////////// Ag-Grid //////////////////////////////

  // 날짜 포맷 변환 ag-grid용 [S]
  dateFormatter(params) { // 여기서 ag grid에 date형식을 보냄
    let value = params.value; // null 그냥 넣으면 오류남
    let format = 'yyyy-MM-dd';
    let date = value == null ? new Date() : new Date(value); // null이면 오늘 날짜 입력
    date = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // 밀리초 단위 계산 (DB 시간 차이때문)

    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);

    let result = format.replace('yyyy', year)
                    .replace('MM', month)
                    .replace('dd', day);
    return result;
  },

  // 날짜 포맷 변환 ag-grid용 (null 리턴 버전)
  dateFormatter_returnNull(params) {
    let value = params.value; // ag-grid용 params.value
    if(!value) return null; // null이면 null 그대로 리턴

    let date = new Date(value);
    date = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // 밀리초 단위 계산

    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + (date.getDate())).slice(-2);

    return year + '-' + month + '-' + day;
  },

  // 날짜+시간 포맷 변환 ag-grid용 (데이터타입 DATETIME)
  datetimeFormatter(params){
    let value = params.value; // ag-grid용 params.value
    if(!value) return null; // null이면 null 그대로 리턴

    let newDate = new Date(value);
    // 2024-12-12T03:00:00.000Z => 2024-12-12, 12:00로 변환
    let strDate = newDate.toLocaleDateString('en-CA', { // en-CA => 국가별 날짜형식(0000-00-00)
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      hour12: false, // 24시간
      minute: 'numeric'
    });
    return strDate.replace(',', ''); // 쉼표 제거 (2024-12-12 23:00)
  },

  // 숫자 포맷 변환 ag-grid 적용 가능 (천단위 콤마 표시)
  currencyFormatter(params){
    if (!params.value || isNaN(params.value)) return '0';
    return Number(params.value).toLocaleString();
  },

  //빈 컬럼 표기
  defaultFormatter(params) {
    return params.value == null ? "-" : params.value;
  },    













  /////////////////////////////// axios ///////////////////////////////

  // 공통코드 가져오기 (리턴값 : [{comm_dtl_cd, comm_dtl_nm}, ....])
  async getComm(cd){ // comm_cd
    let result = await axios.get('/api/comm/codeList/' + cd)
                            .catch(err => console.log(err));
    return result.data;
  },

  // 사원목록 가져오기 (dpt_cd 넣으면 부서별 사원 조회, 안 넣으면 전체 조회)
  async getMembers(dpt){
    let result = await axios.get('/api/comm/member', {params: {dpt_cd: dpt}})
                            .catch(err => console.log(err));
    return result.data;
  }






































};








































