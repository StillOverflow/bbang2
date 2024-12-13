<!-- 생산 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-header pb-0">
        <div class="d-flex align-items-center">
          <h3 class="mb-0">생산지시서 등록</h3>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <!--기본정보-->
          <div class="col-md-6">
            <p class="text-uppercase text-lg">기본정보</p>
            <label for="example-text-input" class="form-control-label">생산계획코드</label>
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label">작업일자</label>
            <input class="form-control" type="date" value="" />

            <hr class="horizontal dark" />

            <p class="text-uppercase text-lg">생산제품 목록</p>
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7" width="10%">  </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7" width="10%"> 순번 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"> 제품코드</th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">제품명</th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">생산수량</th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">1</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">우유식빵</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">200</span></td>
                    <td><a class="btn mb-0 btn-outline-success btn-xsm null null">선택하기</a></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">2</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">공갈빵빵</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">200</span></td>
                    <td><a class="btn mb-0 btn-outline-success btn-xsm null null">선택하기</a></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">3</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">케로로빵</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">200</span></td>
                    <td><a class="btn mb-0 btn-outline-success btn-xsm null null">선택하기</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!--공정설정-->
          <div class="col-md-6 bg-gr">
            <p class="text-uppercase text-lg">공정설정</p>
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7" width="10%"> 사용유무 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7" width="10%"> 순번 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"> 공정코드
                    </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">공정명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">1</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽공정</span></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">2</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽분할공정</span></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">3</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">발효공정</span></td>
                  </tr>
                </tbody>
              </table>
            </div>            

            <hr class="horizontal dark" />

            <p class="text-uppercase text-lg">공정 및 자재설정</p>
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7" width="10%"> 사용유무 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7" width="10%"> 자재코드 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"> 자재명
                    </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">필요수량(개당)</th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">현재고</th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="align-middle text-center">
                    <td><span class="text-secondary text-s font-weight-bold">1</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▼</td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td><span class="text-secondary text-s font-weight-bold">2</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽분리공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▼</td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td><span class="text-secondary text-s font-weight-bold">3</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">발효공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▲</td>
                  </tr>

                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC2206123</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">밀가루</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">30g</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">180g</span></td>
                    <td></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC2206123</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">이스트트</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">30g</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">180g</span></td>
                    <td></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC2206123</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">물</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">30g</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">180g</span></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <button class="btn mb-0 btn-success btn-lg null null ms-auto">저장</button>        
          <button class="btn mb-0 btn-secondary btn-lg null null ms-auto">목록</button>        
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Produce_ow',
  // 컴포넌트 로직
};
</script>