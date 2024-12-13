<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Authors table</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">자재코드</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                자재명
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                구분
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                단위
              </th><th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                BOM양
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                추가
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr  :key="material.MAT_CD" v-for="material in filteredMaterials">
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    {{ material.MAT_CD }}
                  </div>
                </div>
              </td>
              <td>
                {{material.MAT_NM}}
              </td>
              <td class="align-middle text-center text-sm">
                {{material.TYPE}}
              </td>
              <td class="align-middle text-center">
                {{material.UNIT}}
              </td>
              <td class="align-middle">
                  <input v-model="material.usage" type="int"/>
              </td>
              <td>
                <button class="btn btn-info btn-sm">추가</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>


  export default{

  }
  
</script>
