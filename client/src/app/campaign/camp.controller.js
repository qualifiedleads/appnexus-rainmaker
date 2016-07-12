(function() {
  'use strict';

  angular
    .module('pjtLayout')
    .controller('CampaignController', CampaignController);

  /** @ngInject */
  function CampaignController($window, $state, $localStorage, $translate, Camp, Campaign) {
    var vm = this;
    vm.Camp = Camp;
    vm.multipleTotalCount = 0;
    vm.checkChart = [];
    vm.by = '';
    var LC = $translate.instant;
    vm.campName = Campaign.campaign;
    vm.campId = Campaign.id;


    if ($localStorage.seriesCamp == null ){
      $localStorage.seriesCamp = [{
        argumentField: "date",
        valueField: "impression"
      }, {
        argumentField: "date",
        valueField: "cpa"
      }, {
        argumentField: "date",
        valueField: "cpc"
      }, {
        argumentField: "date",
        valueField: "clicks"
      }, {
        argumentField: "date",
        valueField: "mediaspent"
      }, {
        argumentField: "date",
        valueField: "conversions"
      }, {
        argumentField: "date",
        valueField: "ctr"
      }];

    }
    //$localStorage.checkCharCamp = null;
    var tempIndex = [];
    if ($localStorage.checkCharCamp== null ){
      $localStorage.checkCharCamp = {
        'impressions': true,
        'cpa': true,
        'cpc':true,
        'clicks': true,
        'mediaspent': true,
        'conversions': true,
        'ctr': true
      };
      tempIndex = [];
      for(var index in $localStorage.checkCharCamp) {
        if ($localStorage.checkCharCamp[index] == true) {
          tempIndex.push(index);
        }
      }
      vm.by = tempIndex.join();
    } else {
      tempIndex = [];
      for(var index in $localStorage.checkCharCamp) {
        if ($localStorage.checkCharCamp[index] == true) {
          tempIndex.push(index);
        }
      }
      vm.by = tempIndex.join();
    }

    vm.totals = [];
    vm.chartStore = new $window.DevExpress.data.CustomStore({
      totalCount: function () {
        return 0;
      },
      load: function () {
        return vm.Camp.statsChart(vm.campId, vm.dataStart, vm.dataEnd,vm.by)
          .then(function (result) {
            return result;
          });
      }
    });

    vm.boxPlotStore = new $window.DevExpress.data.CustomStore({
      totalCount: function () {
        return 0;
      },
      load: function () {
        return vm.Camp.cpaReport(vm.campId, vm.dataStart, vm.dataEnd)
          .then(function (result) {
            return result;
          });
      }
    });


    vm.gridStore = new $window.DevExpress.data.CustomStore({
      totalCount: function () {
        return 0;
      },
      load: function (loadOptions) {
        return vm.Camp.campaignDomains(vm.campId, vm.dataEnd, vm.dataStart, loadOptions.skip,
          loadOptions.take, loadOptions.sort, loadOptions.order,loadOptions.filter)
          .then(function (result) {
            $localStorage.gridStore = result;
            return result;
          });
      }
    });

    vm.detailsStoreAll = new $window.DevExpress.data.CustomStore({
      totalCount: function () {
        return 0;
      },
      load: function () {
        return vm.Camp.campaignDetails(vm.dataStart, vm.dataEnd,$localStorage.selectedSection)
          .then(function (result) {
            return result.all;
          });
      }
    });

    vm.detailsStoreConversion = new $window.DevExpress.data.CustomStore({
      totalCount: function () {
        return 0;
      },
      load: function () {
        return vm.Camp.campaignDetails(vm.dataStart, vm.dataEnd,vm.by)
          .then(function (result) {
            return result.conversions;
          });
      }
    });


    vm.multipleStore = new $window.DevExpress.data.CustomStore({
      totalCount: function () {
        return vm.multipleTotalCount ;
      },
      load: function (loadOptions) {
        if(loadOptions.take == null) {
          loadOptions.take = 20;
        }
        if(loadOptions.skip == null) {
          loadOptions.skip = 0;
        }
        if(loadOptions.sort == null) {
          loadOptions.sort = 'campaign';
        }
        if(loadOptions.order == null) {
          loadOptions.order = 'DESC';
        }
        return vm.Camp.statsCampaigns(vm.dataStart, vm.dataEnd, loadOptions.skip,
          loadOptions.take, loadOptions.sort, loadOptions.order,
          vm.by, loadOptions.filter)
          .then(function (result) {
            vm.multipleTotalCount = result.totalCount;
            return result.campaigns;
          });
      }
    });



    /** BIG DIAGRAM  - START **/
    vm.types = ['line', 'stackedLine', 'fullStackedLine'];

    vm.chartOptionsFirst = {
      argumentAxis: {
        valueMarginsEnabled: false,
        discreteAxisDivisionMode: 'crossLabels',
        grid: {
          visible: true
        }
      },
      crosshair: {
        enabled: true,
        color: 'deepskyblue',
        label: {
          visible: true
        }
      },
      commonSeriesSettings: {
        point: {
          size: 3,
          hoverStyle: {
            border: {
              visible: true,
              width: 2
            },
            size: 5
          }
        }
      },
      bindingOptions: {
        dataSource: 'camp.chartStore'
      },
      series: $localStorage.seriesCamp,
      legend:{
        visible: false
      },
      loadingIndicator: {
        show: true,
        text: "Creating a chart..."
      }
    };

    vm.rangeOptionsFirst = {
      margin: {
        left: 10
      },
      scale: {
        minorTickCount:1
      },
      bindingOptions: {
        dataSource: 'camp.chartStore'
      },
      chart: {
        series: $localStorage.seriesCamp
      },
      behavior: {
        callSelectedRangeChanged: "onMoving"
      },
      onSelectedRangeChanged: function (e) {
        var zoomedChart = $("#zoomedContainerFirst #zoomedChartFirst").dxChart("instance");
        zoomedChart.zoomArgument(e.startValue, e.endValue);
      }
    };

    /** BIG DIAGRAM  - END **/

    /** CHECKBOX CHART - START **/
    vm.impressions = {
      text: LC('MAIN.CHECKBOX.IMPRESSIONS'),
      value: $localStorage.checkCharCamp.impressions? true:false,
      onValueChanged: function (e) {
        if (e.value == true) {
          $localStorage.checkCharCamp.impressions = true;
          $localStorage.seriesCamp.push({
            argumentField: "day",
            valueField: "impression"
          });
          $state.reload();
        } else {
          $localStorage.checkCharCamp.impressions = false;
          for(var index in $localStorage.seriesCamp) {
            if ($localStorage.seriesCamp[index].valueField == 'impression') {
              $localStorage.seriesCamp.splice(index, 1);
            }
          }
          $state.reload();
        }
      }
    };



    vm.CPA = {
      text: LC('MAIN.CHECKBOX.CPA'),
      value: $localStorage.checkCharCamp.cpa? true:false,
      onValueChanged: function (e) {
        if (e.value == true) {
          $localStorage.checkCharCamp.cpa = true;
          $localStorage.seriesCamp.push({
            argumentField: "day",
            valueField: "cpa"
          });
          $state.reload();
        } else {
          $localStorage.checkCharCamp.cpa = false;
          for(var index in $localStorage.seriesCamp) {
            if ($localStorage.seriesCamp[index].valueField == 'cpa') {
              $localStorage.seriesCamp.splice(index, 1);
            }
          }
          $state.reload();
        }
      }
    };

    vm.CPC = {
      text: LC('MAIN.CHECKBOX.CPC'),
      value: $localStorage.checkCharCamp.cpc? true:false,
      onValueChanged: function (e) {
        if (e.value == true) {
          $localStorage.checkCharCamp.cpc = true;
          $localStorage.seriesCamp.push({
            argumentField: "day",
            valueField: "cpc"
          });
          $state.reload();
        } else {
          $localStorage.checkCharCamp.cpc = false;
          for(var index in $localStorage.seriesCamp) {
            if ($localStorage.seriesCamp[index].valueField == 'cpc') {
              $localStorage.seriesCamp.splice(index, 1);
            }
          }
          $state.reload();
        }
      }
    };

    vm.clicks = {
      text: LC('MAIN.CHECKBOX.CLICKS'),
      value: $localStorage.checkCharCamp.clicks? true:false,
      onValueChanged: function (e) {
        if (e.value == true) {
          $localStorage.checkCharCamp.clicks = true;
          $localStorage.seriesCamp.push({
            argumentField: "day",
            valueField: "clicks"
          });
          $state.reload();
        } else {
          $localStorage.checkCharCamp.clicks = false;
          for(var index in $localStorage.seriesCamp) {
            if ($localStorage.seriesCamp[index].valueField == 'clicks') {
              $localStorage.seriesCamp.splice(index, 1);
            }
          }
          $state.reload();
        }
      }
    };
    vm.media = {
      text: LC('MAIN.CHECKBOX.MEDIA_SPENT'),
      value: $localStorage.checkCharCamp.mediaspent? true:false,
      onValueChanged: function (e) {
        if (e.value == true) {
          $localStorage.checkCharCamp.mediaspent = true;
          $localStorage.seriesCamp.push({
            argumentField: "day",
            valueField: "mediaspent"
          });
          $state.reload();
        } else {
          $localStorage.checkCharCamp.mediaspent = false;
          for(var index in $localStorage.seriesCamp) {
            if ($localStorage.seriesCamp[index].valueField == 'mediaspent') {
              $localStorage.seriesCamp.splice(index, 1);
            }
          }
          $state.reload();
        }
      }
    };
    vm.conversions = {
      text: LC('MAIN.CHECKBOX.CONVERSIONS'),
      value: $localStorage.checkCharCamp.conversions? true:false,
      onValueChanged: function (e) {
        if (e.value == true) {
          $localStorage.checkCharCamp.conversions = true;
          $localStorage.seriesCamp.push({
            argumentField: "day",
            valueField: "conversions"
          });
          $state.reload();
        } else {
          $localStorage.checkCharCamp.conversions = false;
          for(var index in $localStorage.seriesCamp) {
            if ($localStorage.seriesCamp[index].valueField == 'conversions') {
              $localStorage.seriesCamp.splice(index, 1);
            }
          }
          $state.reload();
        }
      }
    };
    vm.CTR = {
      text: LC('MAIN.CHECKBOX.CTR'),
      value: $localStorage.checkCharCamp.ctr? true:false,
      onValueChanged: function (e) {
        if (e.value == true) {
          $localStorage.checkCharCamp.ctr = true;
          $localStorage.seriesCamp.push({
            argumentField: "day",
            valueField: "ctr"
          });
          $state.reload();
        } else {
          $localStorage.checkCharCamp.ctr = false;
          for(var index in $localStorage.seriesCamp) {
            if ($localStorage.seriesCamp[index].valueField == 'ctr') {
              $localStorage.seriesCamp.splice(index, 1);
            }
          }
          $state.reload();
        }
      }
    };
    /** CHECKBOX CHART - END **/

    /** DATE PIKER - START **/
    if ($localStorage.dataStart == null && $localStorage.dataEnd == null ){
      $localStorage.dataStart = $window.moment({ hour: '00' }).subtract(1, 'day').unix() ;
      $localStorage.dataEnd = $window.moment({ hour: '00' }).subtract(1, 'day').endOf('day').unix();
    } else {
      vm.dataStart = $localStorage.dataStart;
      vm.dataEnd = $localStorage.dataEnd;
    }
    if ($localStorage.SelectedTime == null) {
      $localStorage.SelectedTime = 0;
    }

    var products = [
      {
        ID: 0,
        Name: LC('MAIN.DATE_PICKER.YESTERDAY'),
        dataStart: $window.moment({ hour: '00' }).subtract(1, 'day').unix() ,
        dataEnd: $window.moment({ hour: '00' }).subtract(1, 'day').endOf('day').unix()
      }, {
        ID: 1,
        Name: LC('MAIN.DATE_PICKER.LAST_3_DAYS'),
        dataStart:  $window.moment({ hour: '00' }).subtract(3, 'day').unix(),
        dataEnd: $window.moment({ hour: '00' }).unix()
      }, {
        ID: 2,
        Name: LC('MAIN.DATE_PICKER.LAST_7_DAYS'),
        dataStart:  $window.moment({ hour: '00' }).subtract(7, 'day').unix(),
        dataEnd: $window.moment({ hour: '00' }).unix()
      }, {
        ID: 3,
        Name: LC('MAIN.DATE_PICKER.LAST_14_DAYS'),
        dataStart:  $window.moment({ hour: '00' }).subtract(14, 'day').unix(),
        dataEnd: $window.moment({ hour: '00' }).unix()
      }, {
        ID: 4,
        Name: LC('MAIN.DATE_PICKER.LAST_21_DAYS'),
        dataStart:  $window.moment({ hour: '00' }).subtract(21, 'day').unix(),
        dataEnd: $window.moment({ hour: '00' }).unix()
      }, {
        ID: 5,
        Name: LC('MAIN.DATE_PICKER.CURRENT_MONTH'),
        dataStart: $window.moment().startOf('month').unix(),
        dataEnd: $window.moment().unix()
      }, {
        ID: 6,
        Name: LC('MAIN.DATE_PICKER.LAST_MONTH'),
        dataStart: $window.moment().subtract(1, 'month').startOf('month').unix(),
        dataEnd: $window.moment().subtract(1, 'month').endOf('month').unix()
      }, {
        ID: 7,
        Name: LC('MAIN.DATE_PICKER.LAST_90_DAYS'),
        dataStart: $window.moment({ hour: '00' }).subtract(90, 'day').unix(),
        dataEnd: $window.moment().unix()
      }, {
        ID: 8,
        Name: LC('MAIN.DATE_PICKER.ALL_TIME'),
        dataStart: 0,
        dataEnd: $window.moment().unix()
      }];
    vm.datePiker = {
      items: products,
      displayExpr: 'Name',
      valueExpr: 'ID',
      value: products[$localStorage.SelectedTime].ID,
      onValueChanged: function (e) {
        //$log.info(products[e.value]);
        $localStorage.SelectedTime = e.value;
        $localStorage.dataStart = products[e.value].dataStart;
        $localStorage.dataEnd = products[e.value].dataEnd;

        //$('#gridContainer1').dxDataGrid('instance').refresh();
        //$('#gridContainer2').dxDataGrid('instance').refresh();
        $state.reload();
      }
    };
    /** DATE PIKER - END **/


    /** BOX PLOT- START **/


    vm.chartOptionsSecond = {
      bindingOptions: {
        dataSource: 'camp.boxPlotStore'
      },
      commonSeriesSettings: {
        type: 'candleStick'
      },
      // size: {
      //   height: 205,
      //   width:600
      // },
      valueAxis: {
        valueType: 'numeric'
      },
      argumentAxis: {
        valueMarginsEnabled: false,
        grid: {
          visible: true
        },
        label: {
          visible: false
        },
        argumentType: 'datetime'
      },
      tooltip: {
        enabled: true
      },
      legend: {
        visible: false
      },
      loadingIndicator: {
        show: true,
        text: "Creating a chart..."
      },
      useAggregation: true,
      series: [{
        openValueField: 'Open',
        highValueField: 'High',
        lowValueField: 'Low',
        closeValueField: 'Close',
        argumentField: 'Date'
      }]
    };

    vm.rangeOptionsSecond = {
      size: {
        height: 100,
      },
      margin: {
        left: 10
      },
      scale: {
        minorTickCount:'day',
        valueType: 'date',
        tickInterval: 'day'
      },
      bindingOptions: {
        dataSource: 'camp.boxPlotStore'
      },
      chart: {
        series: {
          type: 'line',
          valueField: 'Open',
          argumentField: 'Date',
          placeholderHeight: 20
        },
        useAggregation: true,
        valueAxis: { valueType: 'numeric' }
      },

      behavior: {
        callSelectedRangeChanged: "onMoving",
        snapToTicks: false
      },
      onSelectedRangeChanged: function (e) {
        var zoomedChart = $("#zoomedContainerSecond #zoomedChartSecond").dxChart("instance");
        zoomedChart.zoomArgument(new Date(e.startValue), new Date(e.endValue));
      }
    };


    /** BOX PLOT- END **/



    /** MULTIPLE - START **/
    vm.selectedItems = [];
    vm.chartOptionsFuncgrid = [];
    if ($localStorage.boxPlotData == null){
      $localStorage.boxPlotData = vm.boxPlotData;
    }

    vm.state='';
    vm.selectCell = {
      dataSource: [
        {'name': 'White List',
          'state':'whiteList'},
        {'name': 'Black List',
          'state':'blackList'},
        {'name': 'Suspended',
          'state':'suspended'}
      ],
      disabled:true,
      placeholder: 'Select a state',
      displayExpr: 'name',
      valueExpr: vm.state,
      onSelectionChanged: function(e) {
        var selectedRows = $('#gridContainer2')[0].querySelectorAll('[aria-selected="true"]');
        var stateSelected = e.selectedItem.state;
        console.log(stateSelected);
        if(selectedRows[0]) {
          var selectedArr = [];
          for (var i=0; i<selectedRows.length; i++){
            selectedArr.push(selectedRows[i].firstChild.innerText);
          }
          console.log(selectedArr);

        }
      }
    };


    vm.dataGridOptionsCampaign = {
      onInitialized: function (data) {
        vm.dataGridOptionsMultipleFunc = data.component;
        vm.dataGridOptionsMultipleFunc._controllers.columns._commandColumns[1].visibleIndex = 9;
      },
      onRowPrepared: function(data) {
        vm.objectData = data;
        if(vm.objectData.rowType == 'data') {
          //console.log(vm.objectData);
          var allRowBtns = data.rowElement[0].childNodes[9];
          var state = data.data.state;
          if(state.whiteList == "true"){
            allRowBtns.classList.add('active-white');
          }
          if(state.blackList == "true"){
            allRowBtns.classList.add('active-black');
          }
          if(state.suspended == "true"){
            allRowBtns.classList.add('active-suspended');
          }
        }
      },
      showBorders: true,
      alignment: 'left',
      headerFilter: {
        visible: true
      },
      bindingOptions: {
        dataSource: 'camp.gridStore',
        allowColumnResizing: 'true'
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [10, 30, 50],
        visible: true,
        showNavigationButtons: true
      },
      howBorders: true,
      showRowLines: true,
      columns: [
        {
          caption: LC('MAIN.CAMPAIGN.COLUMNS.PLACEMENT'),
          dataField: 'placement'
        },
        {
          caption: LC('MAIN.CAMPAIGN.COLUMNS.NETWORK'),
          dataField: 'NetworkPublisher'
        },
        {
          caption: LC('MAIN.CAMPAIGN.COLUMNS.CONV'),
          dataField: 'conv'
        }, {
          caption:  LC('MAIN.CAMPAIGN.COLUMNS.IMP'),
          dataField: 'imp'
        }, {
          caption:  LC('MAIN.CAMPAIGN.COLUMNS.CLICKS'),
          dataField: 'clicks'
        }, {
          caption:  LC('MAIN.CAMPAIGN.COLUMNS.CPC'),
          dataField: 'cpc'
        },
        {
          caption: LC('MAIN.CAMPAIGN.COLUMNS.CPM'),
          dataField: 'cpm'
        },
        {
          caption: LC('MAIN.CAMPAIGN.COLUMNS.CVR'),
          dataField: 'cvr'
        },
        {
          caption: LC('MAIN.CAMPAIGN.COLUMNS.CTR'),
          dataField: 'ctr'
        },
        {
          caption: 'State',
          width: 300,
          columnIndex: 16,
          headerCellTemplate: 'headerCellTemplate',
          cellTemplate: function (container, options) {
            $("<div />").dxButton({
              text: 'white list',
              height:30,
              width: 89,
              disabled: true,
              onClick: function (e) {
                console.log(options.data);
                var parentWhiteBtn = e.element[0].parentNode;
                console.log(parentWhiteBtn);
                if (parentWhiteBtn.classList.contains('active-white')) {
                  parentWhiteBtn.classList.remove('active-white');
                  parentWhiteBtn.classList.add('unactive-white');
                  options.data.state.whiteList = 'false';
                } else if (!parentWhiteBtn.classList.contains('active-white')){
                  parentWhiteBtn.classList.remove('unactive-white');
                  parentWhiteBtn.classList.add('active-white');
                  options.data.state.whiteList = 'true';
                  options.data.state.suspended = 'false';
                  options.data.state.blackList = 'false';
                  parentWhiteBtn.classList.remove('active-black');
                  parentWhiteBtn.classList.remove('active-suspended');
                }

              }
            }).addClass('white-list').appendTo(container);

            $("<div />").dxButton({
              text: 'black list',
              height:30,
              width: 89,
              disabled: true,
              onClick: function (e) {
                //console.log(e);
                var parentWhiteBtn = e.element[0].parentNode;
                //console.log(parentWhiteBtn);
                if (parentWhiteBtn.classList.contains('active-black')) {
                  parentWhiteBtn.classList.remove('active-black');
                  parentWhiteBtn.classList.add('unactive-black');
                  options.data.state.blackList = 'false';
                } else if (!parentWhiteBtn.classList.contains('active-black')){
                  parentWhiteBtn.classList.remove('unactive-black');
                  parentWhiteBtn.classList.add('active-black');
                  options.data.state.blackList = 'true';
                  options.data.state.suspended = 'false';
                  options.data.state.whiteList = 'false';
                  parentWhiteBtn.classList.remove('active-white');
                  parentWhiteBtn.classList.remove('active-suspended');
                }

              }
            }).addClass('black-list').appendTo(container);

            $("<div />").dxButton({
              text: 'suspended',
              height:30,
              width: 95,
              disabled: true,
              onClick: function (e) {
                //console.log(e);
                var parentWhiteBtn = e.element[0].parentNode;
                //console.log(parentWhiteBtn);
                if (parentWhiteBtn.classList.contains('active-suspended')) {
                  parentWhiteBtn.classList.remove('active-suspended');
                  parentWhiteBtn.classList.add('unactive-suspended');
                  options.data.state.suspended = 'false';
                } else if (!parentWhiteBtn.classList.contains('active-suspended')){
                  parentWhiteBtn.classList.remove('unactive-suspended');
                  parentWhiteBtn.classList.add('active-suspended');
                  options.data.state.suspended = 'true';
                  options.data.state.whiteList = 'false';
                  options.data.state.blackList = 'false';
                  parentWhiteBtn.classList.remove('active-white');
                  parentWhiteBtn.classList.remove('active-black');

                }

              }
            }).addClass('suspended').appendTo(container);
          }
        }
      ],
      selection: {
        mode: 'multiple',
        showCheckBoxesMode: 'always'
      },
      onSelectionChanged: function (data) {
        vm.selectedItems = data.selectedRowsData;
        vm.disabled = !vm.selectedItems.length;
      }
    };
    /** MULTIPLE - END **/



    /** RANGE SELECTOR FIRST - START **/
    vm.rangeFirstChartOptions = {
      margin: {
        left: 50
      },
      size: {
        height: 150,
        width: 450
      },
      scale: {
        startValue:  new Date($localStorage.dataStart),
        endValue: new Date($localStorage.dataEnd),
        minorTickInterval: "day",
        minRange: "hour",
        maxRange: "month",
        minorTick: {
          visible: false
        }
      },
      sliderMarker: {
        format: "monthAndDay"
      }
      // selectedRange: {
      //   startValue: new Date($localStorage.dataStart),
      //   endValue: new Date($localStorage.dataEnd)
      // }
    };

    /** RANGE SELECTOR FIRST - END **/

    /** RANGE SELECTOR SECOND - START **/
    vm.rangeSecondChartOptions = {
      margin: {
        left: 50,
        top: 12
      },
      size: {
        height: 150,
        width: 450
      },
      scale: {
        startValue: new Date($localStorage.dataStart),
        endValue: new Date($localStorage.dataEnd),
        minorTickInterval: "day",
        minRange: "day",
        maxRange: "month",
        minorTick: {
          visible: false
        }
      },
      sliderMarker: {
        format: "monthAndDay"
      }
      // selectedRange: {
      //   startValue: new Date(2011, 2, 3),
      //   endValue: new Date(2011, 2, 9)
      // }
    };

    /** RANGE SELECTOR SECOND - END **/


    /** PIE CHART CONTAINER - START **/
    vm.ctrlBbtns = {
      placement:{
        btn:'Placement',
        header:'Placement'
      },
      creativeId: {
        btn:'creative_id',
        header:'creative_id'},
      creativeSize: {
        btn:'creative_size',
        header:'creative_size'
      },
      viewability: {
        btn:'viewability',
        header:'viewability'
      },
      os: {
        btn:'OS',
        header:'Operating System used'
      },
      carrier: {
        btn:'carrier',
        header:'carrier'
      },
      networkSeller: {
        btn:'network(seller)',
        header:'network (seller)'
      },
      connectionType: {
        btn:'connection_type',
        header:'connection_type'
      },
      device: {
        btn:'device',
        header:'device'
      },
      seller: {
        btn:'seller',
        header:'Seller'
      }
    };
    vm.pieChartHeader = $localStorage.pieChartHeader || vm.ctrlBbtns.os.header;
    vm.btnsNodesArray = $('.label-container')[0].children;


    /** SELECT SECTION/BTN UNDER LOADING PAGE - START **/
    for(var key in vm.ctrlBbtns) {
      if (vm.ctrlBbtns[key].header == vm.pieChartHeader) {
        vm.selectedSection = vm.ctrlBbtns[key].btn;
        $localStorage.selectedSection = vm.selectedSection;
      }
    }

    Array.prototype.forEach.call(vm.btnsNodesArray, function(node) {
      if (node.name == vm.selectedSection) {
        node.classList.add('nav-btn-active');
      }
    });
    /** SELECT SECTION/BTN UNDER LOADING PAGE - END **/


    vm.selectInfoBtn = function ($event, value) {
      vm.pieChartHeader = value;
      $localStorage.pieChartHeader = vm.pieChartHeader;

      Array.prototype.forEach.call(vm.btnsNodesArray, function(node) {
        if(node.classList.contains('nav-btn-active')){
          node.classList.remove('nav-btn-active');
        }
      });
      $localStorage.pieChartHeader = vm.pieChartHeader;
      $event.currentTarget.classList.add('nav-btn-active');

    };

    if(!vm.targetCpa) {
      vm.targetCpa = $localStorage.targetCpa || 3;
      $localStorage.targetCpa = vm.targetCpa;
    }

    vm.backetsRanges = {
      first:{
        min: 0,
        max: Number(vm.targetCpa).toFixed(1)
      },
      second:{
        min:Number(vm.targetCpa).toFixed(1),
        max:Number(vm.targetCpa*2).toFixed(1)
      },
      third: {
        min: Number(vm.targetCpa * 2).toFixed(1),
        max: Number(vm.targetCpa * 3).toFixed(1)
      },
      fourth: {
        min: Number(vm.targetCpa * 3).toFixed(1),
        max: Number(vm.targetCpa * 1000).toFixed(1)
      }
    };

    vm.targetCpaChange = function($event) {
      var targetCpaInt = Number($event.currentTarget.value);
      $localStorage.targetCpa = targetCpaInt;
      vm.backetsRanges = {
        first: {
          min: 0,
          max: (targetCpaInt).toFixed(1)
        },
        second: {
          min: (targetCpaInt).toFixed(1),
          max: (targetCpaInt * 2).toFixed(1)
        },
        third: {
          min: (targetCpaInt * 2).toFixed(1),
          max: (targetCpaInt * 3).toFixed(1)
        },
        fourth: {
          min: (targetCpaInt * 3).toFixed(1),
          max: (targetCpaInt * 1000).toFixed(1)
        }
      };
      vm.cpaArrayFirst =  Camp.cpaBuckets(vm.backetsRanges.first.min, vm.backetsRanges.first.max);
      vm.cpaArraySecond =  Camp.cpaBuckets(vm.backetsRanges.second.min, vm.backetsRanges.second.max);
      vm.cpaArrayThird =  Camp.cpaBuckets(vm.backetsRanges.third.min, vm.backetsRanges.third.max);
      vm.cpaArrayFourth =  Camp.cpaBuckets(vm.backetsRanges.fourth.min, vm.backetsRanges.fourth.max);


      return vm.backetsRanges;
    };

    vm.cpaArrayFirst =  Camp.cpaBuckets(vm.backetsRanges.first.min, vm.backetsRanges.first.max);
    vm.cpaArraySecond =  Camp.cpaBuckets(vm.backetsRanges.second.min, vm.backetsRanges.second.max);
    vm.cpaArrayThird =  Camp.cpaBuckets(vm.backetsRanges.third.min, vm.backetsRanges.third.max);
    vm.cpaArrayFourth =  Camp.cpaBuckets(vm.backetsRanges.fourth.min, vm.backetsRanges.fourth.max);


    vm.pieChartAll = {
      title: {
        text: "All",
        font: {
          size: 20
        },
        margin: {
          bottom: 1
        }
      },
      bindingOptions: {
        dataSource: 'camp.detailsStoreAll'
      },
      series: [{
        argumentField: 'section',
        valueField: 'data',
        label: {
          visible: true,
          connector: {
            visible: true,
            width: 0.5
          },
          format: "fixedPoint",
          customizeText: function (point) {
            return point.argumentText + ": " + point.valueText + "%";
          }
        },
        smallValuesGrouping: {
          mode: "smallValueThreshold",
          threshold: 4.5
        }
      }],
      legend: {
        horizontalAlignment: "center",
        verticalAlignment: "bottom"
      },
      size: {
        width:370,
        height:300
      }
    };

    vm.pieChartConversions = {
      title: {
        text: "Conversions",
        font: {
          size: 20
        },
        margin: {
          bottom: 1
        }
      },
      bindingOptions: {
        dataSource: 'camp.detailsStoreConversion'
      },
      series: [{
        argumentField: "section",
        valueField: "data",
        label: {
          visible: true,
          connector: {
            visible: true,
            width: 0.5
          },
          format: "fixedPoint",
          customizeText: function (point) {
            return point.argumentText + ": " + point.valueText + "%";
          }
        },
        smallValuesGrouping: {
          mode: "smallValueThreshold",
          threshold: 4.5
        }
      }],
      legend: {
        horizontalAlignment: "center",
        verticalAlignment: "bottom"
      },
      size: {
        width:370,
        height:300
      }
    }
  }
})();

