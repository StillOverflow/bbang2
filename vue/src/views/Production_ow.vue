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
            <div class="col-md-6">
              <p class="text-uppercase text-lg">기본정보</p>
              <label for="example-text-input" class="form-control-label"
                >생산계획코드</label
              >
              <input class="form-control" type="text" value="" />
              <label for="example-text-input" class="form-control-label"
                >작업일자</label
              >
              <input class="form-control" type="date" value="" />
            </div>
            <div class="col-md-6">
              <p class="text-uppercase text-lg">공정설정</p>
              <table class="table align-items-center mb-0">
                <colgroup>
                  <col width="10%">
                  <col width="10%">
                  <col width="40%">
                  <col width="40%">
                </colgroup>
                <thead align="center">
                  <tr>
                    <th class="text-uppercase text-secondary text-s font-weight-bolder opacity-7">사용유무</th>
                    <th class="text-uppercase text-secondary text-s font-weight-bolder opacity-7">순번</th>
                    <th class="text-uppercase text-secondary text-s font-weight-bolder opacity-7">공정코드</th>
                    <th class="text-uppercase text-secondary text-s font-weight-bolder opacity-7">명칭</th>
                  </tr>
                </thead>
                <tbody align="center">
                  <tr>
                    <td class="align-middle text-center">
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-xs font-weight-bold">1</span></td>
                    <td><span class="text-secondary text-xs font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-xs font-weight-bold">반죽공정</span></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-xs font-weight-bold">2</span></td>
                    <td><span class="text-secondary text-xs font-weight-bold">PRC220332</span></td>
                    <td><span class="text-secondary text-xs font-weight-bold">반죽분리공정</span></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" id="pr_step" checked>
                    </td>
                    <td><span class="text-secondary text-xs font-weight-bold">3</span></td>
                    <td><span class="text-secondary text-xs font-weight-bold">PRC22739</span></td>
                    <td><span class="text-secondary text-xs font-weight-bold">발효공정</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr class="horizontal dark" />
          <p class="text-uppercase text-sm">Contact Information</p>
          <div class="row">
            <div class="col-md-12">
              <label for="example-text-input" class="form-control-label"
                >Address</label
              >
              <argon-input
                type="text"
                value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
              />
            </div>
            <div class="col-md-4">
              <label for="example-text-input" class="form-control-label"
                >City</label
              >
              <argon-input type="text" value="New York" />
            </div>
            <div class="col-md-4">
              <label for="example-text-input" class="form-control-label"
                >Country</label
              >
              <argon-input type="text" value="United States" />
            </div>
            <div class="col-md-4">
              <label for="example-text-input" class="form-control-label"
                >Postal code</label
              >
              <argon-input type="text" value="437300" />
            </div>
          </div>
          <hr class="horizontal dark" />
          <p class="text-uppercase text-sm">About me</p>
          <div class="row">
            <div class="col-md-12">
              <label for="example-text-input" class="form-control-label"
                >About me</label
              >
              <argon-input
                type="text"
                value="A beautiful Dashboard for Bootstrap 5. It is Free and Open Source."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Production_ow',
  // 컴포넌트 로직
};
</script>