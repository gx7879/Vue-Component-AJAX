Vue.component('card-column',{
  props: ['item'],
  template: '#cardColumn',
  methods: {
    statusJudge: function(item){
      if(item.Status == '普通'){
        return '2';
      } else if(item.Status == '對敏感族群不健康'){
        return '3';
      } else if(item.Status == '對所有族群不健康'){
        return '4';
      } else if(item.Status == '非常不健康'){
        return '5';
      } else if(item.Status == '危害'){
        return '6';
      }else{
        return '1';
      }
    },
    starClick: function(){
      this.item.data.starStatus = !this.item.data.starStatus;
      this.$emit('stared-click-fun', this.item.data);
    },
  }

});

var app = new Vue({
  el: '#app',
  data: {
    data: [],
    location: '',
    stared: [],
    filter: 'all',
  },
  // 請在此撰寫 JavaScript
  mounted: function(){
    const vm = this;
    const api = '//opendata2.epa.gov.tw/AQI.json';
    
    // 使用 jQuery ajax
    $.get(api).then(function( response ) {
      vm.data = response;
      vm.data.forEach(function(dataSource){
        vm.$set(dataSource,'starStatus',false);
      });
      if(localStorage.getItem("staredItem")){
        var localStorageData = localStorage.getItem("staredItem");
        vm.stared = JSON.parse(localStorageData);
      }
      vm.data.forEach(function(itemData,idx){
        vm.stared.forEach(function(localItem){
          if(itemData.SiteName == localItem.SiteName){
            vm.$set(itemData,'starStatus', true);
          }
        });
      });

    });
  },
  methods: {
    staredClick: function(itemData){
      var vm = this;
      if(itemData.starStatus){
        this.stared.push(itemData)
        localStorage.setItem("staredItem", JSON.stringify(vm.stared));
      }else{
        var arryIndex = this.stared.findIndex(function(staredData){
          return itemData.SiteName == staredData.SiteName;
        });
        var selectCunIndex = this.selectCun.findIndex(function(selectIndex){
          return itemData.SiteName == selectIndex.SiteName;
        });
        this.selectCun[selectCunIndex].starStatus = false;
        this.stared.splice(arryIndex,1);
        localStorage.setItem("staredItem", JSON.stringify(vm.stared));
      }
    }
  },
  computed: {
    countyArr: function(){
      var vm = this;
      var set = new Set();
      var newArr=[];
      var countyArr = vm.data.filter(function(loc){
        return !set.has(loc.County) ? set.add(loc.County) : false;
      });
      countyArr.forEach(function(county){
        newArr.push(county.County);
      });
      return newArr;
    },
    selectCun: function(){
      var vm = this;
      if(this.filter == 'all' && this.location == ''){
        return vm.data;
      }else{
        return this.data.filter(function(item){
          return vm.location == item.County;
        })
      }
    },
    locationVal: function(){
      if(this.location.length>0){
        this.filter = 'select';
      }
    },

  }
});
