// 전역 함수를 플러그인으로 설정
import comm from './commFunc.js';

export default {
  install : (app) => {
    app.config.globalProperties.$comm = comm; // $ 표시는 관례적으로 전역을 뜻함.
  }
};