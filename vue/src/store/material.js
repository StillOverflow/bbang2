const materialStore = ({
   namespaced: true,
   state : {
      materials: [],
   },

   mutations: { // 변경함수 = setter과 같은역활
      setMaterial(state, data) {
         if (!state || !Array.isArray(state)) {
            state.materialData = data;
         }
      },
   },
   
   getters: {
      getMaterials(state) {
         return state.materialData;
      },
   },

});

export default materialStore;
