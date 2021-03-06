(function () {
  'use strict';

  angular
    .module('pjtLayout')
    .controller('CampaignOptimiserController', CampaignOptimiserController);

  /** @ngInject */
  function CampaignOptimiserController($window, $state, $rootScope, $localStorage, $scope, $translate, $compile, CampaignOptimiser, Home) {
    var vm = this;
    var LC = $translate.instant;
    var dataSuspend = null;
    var tempSespendRow = {};
    var oneSuspend = false;
    vm.campName = Home.AdverInfo.campaign;
    vm.campId = Home.AdverInfo.id;
    vm.line_item = Home.AdverInfo.line_item;
    vm.line_item_id = Home.AdverInfo.line_item_id;
    vm.object = CampaignOptimiser.campaignTargeting(1, 1, 1);
    vm.popUpIf = false;
    vm.arrayDiagram = [];

    vm.popUpHide = popUpHide;

    function popUpHide() {
      vm.popUpIf = false;
    }

    //region DATE PIKER
    /** DATE PIKER - START **/
    if ($localStorage.SelectedTime == null) {
      $localStorage.SelectedTime = 0;
      $localStorage.dataStart = $window.moment({ hour: '00' }).subtract(1, 'day').unix();
      $localStorage.dataEnd = $window.moment({ hour: '00' }).subtract(1, 'day').endOf('day').unix();
      $localStorage.type = 'yesterday';
      vm.dataStart = $window.moment({ hour: '00' }).subtract(1, 'day').unix();
      vm.dataEnd = $window.moment({ hour: '00' }).subtract(1, 'day').endOf('day').unix();
      vm.type = 'yesterday';
    } else {
      if ($localStorage.dataStart == undefined || !$localStorage.dataEnd || !$localStorage.type) {
        $localStorage.SelectedTime = 0;
        $localStorage.dataStart = $window.moment({ hour: '00' }).subtract(1, 'day').unix();
        $localStorage.dataEnd = $window.moment({ hour: '00' }).subtract(1, 'day').endOf('day').unix();
        $localStorage.type = 'yesterday';
        vm.dataStart = $window.moment({ hour: '00' }).subtract(1, 'day').unix();
        vm.dataEnd = $window.moment({ hour: '00' }).subtract(1, 'day').endOf('day').unix();
        vm.type = 'yesterday';
      } else {
        vm.dataStart = $localStorage.dataStart;
        vm.dataEnd = $localStorage.dataEnd;
        vm.type = $localStorage.type;
      }
    }

    var products = [
      {
        ID: 0,
        Name: LC('MAIN.DATE_PICKER.YESTERDAY'),
        dataStart: $window.moment({ hour: '00' }).subtract(1, 'day').unix(),
        dataEnd: $window.moment().unix(),
        type: 'yesterday'
      }, {
        ID: 1,
        Name: LC('MAIN.DATE_PICKER.LAST_3_DAYS'),
        dataStart: $window.moment({ hour: '00' }).subtract(3, 'day').unix(),
        dataEnd: $window.moment().unix(),
        type: 'last_3_days'
      }, {
        ID: 2,
        Name: LC('MAIN.DATE_PICKER.LAST_7_DAYS'),
        dataStart: $window.moment({ hour: '00' }).subtract(7, 'day').unix(),
        dataEnd: $window.moment().unix(),
        type: 'last_7_days'
      }, {
        ID: 3,
        Name: LC('MAIN.DATE_PICKER.LAST_14_DAYS'),
        dataStart: $window.moment({ hour: '00' }).subtract(14, 'day').unix(),
        dataEnd: $window.moment().unix(),
        type: 'last_14_days'
      }, {
        ID: 4,
        Name: LC('MAIN.DATE_PICKER.LAST_21_DAYS'),
        dataStart: $window.moment({ hour: '00' }).subtract(21, 'day').unix(),
        dataEnd: $window.moment().unix(),
        type: 'last_21_days'
      }, {
        ID: 5,
        Name: LC('MAIN.DATE_PICKER.CURRENT_MONTH'),
        dataStart: $window.moment().startOf('month').unix(),
        dataEnd: $window.moment().unix(),
        type: 'cur_month'
      }, {
        ID: 6,
        Name: LC('MAIN.DATE_PICKER.LAST_MONTH'),
        dataStart: $window.moment().subtract(1, 'month').startOf('month').unix(),
        dataEnd: $window.moment().unix(),
        type: 'last_month'
      }, {
        ID: 7,
        Name: LC('MAIN.DATE_PICKER.LAST_90_DAYS'),
        dataStart: $window.moment({ hour: '00' }).subtract(90, 'day').unix(),
        dataEnd: $window.moment().unix(),
        type: 'last_90_days'
      }, {
        ID: 8,
        Name: LC('MAIN.DATE_PICKER.ALL_TIME'),
        dataStart: 0,
        dataEnd: $window.moment().unix(),
        type: 'all'
      }];

    //endregion

    //region MULTIPLE
    vm.selectedItems = [];
    vm.state = '';

    function headerFilterColumn(source, dataField) {
      return source.dataSource.postProcess = function (data) {
        var list = $window._.uniqBy(data, dataField);
        return list.map(function (item) {
          return {
            text: item[dataField],
            value: item[dataField]
          };
        });
      };
    }

    //endregion

    //region STORE
    vm.gridStore = CampaignOptimiser.getGridCampaignStore(vm.campId, vm.dataStart, vm.dataEnd, vm.type);
    //endregion

    var startDate = new Date(1981, 3, 27),
      now = new Date();

    vm.UI = {
      showGridWhiteList: {
        text: LC('CO.WHITELIST'),
        onClick: function (e) {
          vm.grindIf = 1;
          $scope.$apply();
        }
      },
      showGridBlackList: {
        text: LC('CO.BLACKLISTED'),
        onClick: function (e) {
          vm.grindIf = 2;
          $scope.$apply();
        }
      },
      showGridTempSuspendList: {
        text: LC('CO.TEMP-SUSPEND'),
        onClick: function (e) {
          vm.grindIf = 3;
          $scope.$apply();
        }
      },
      dateFormatPop: {
        disabled: true,
        type: 'date',
        value: now,
        onValueChanged: function (e) {
          dataSuspend = e.value;
        }
      },
      radioGroupMain: {
        items: [LC('CO.24-HRS'), LC('CO.3-DAYS'), LC('CO.7-DAYS'), LC('CO.SPECIFIC-DATE')],
        value: LC('CO.24-HRS'),
        onValueChanged: function (e) {
          var radioGroupSend = $('#radioGroupSend')
            .dxRadioGroup('instance');
          if (!e.value) return;
          radioGroupSend.option('value', false);

          if (e.value == LC('CO.SPECIFIC-DATE')) {
            //e;
            var datePik = $('#dateFormatPop')
              .dxDateBox('instance');
            datePik.option('disabled', false);
          } else {
            var datePik = $('#dateFormatPop')
              .dxDateBox('instance');
            datePik.option('disabled', true);
            dataSuspend = null;
          }
        }
      },
      radioGroupSend: {
        items: [LC('CO.SEND-TO-SUSPEND-LIST')],
        onValueChanged: function (e) {
          dataSuspend = null;
          var datePik = $('#dateFormatPop')
            .dxDateBox('instance');
          datePik.option('disabled', true);

          var radioGroupMain = $('#radioGroupMain')
            .dxRadioGroup('instance');
          if (!e.value) return;
          radioGroupMain.option('value', false);
        }
      },
      confirmPopup: {
        onInitialized: function (data) {
          vm.confirmPopup = data.component;
        },

        bindingOptions: {
          visible: 'crc.confirmPopupVisible'
        },
        showTitle: false,
        width: 320,
        height: 300
      },
      confirmPopupOk: {
        width: 110,
        text: 'OK',
        disabled: false,
        onClick: function () {
          oneSuspend = true;

          var suspendPlacement;
          var radioGroupMain = $('#radioGroupMain').dxRadioGroup('instance');
          var radioGroupSend = $('#radioGroupSend').dxRadioGroup('instance');

          if (radioGroupMain._options.value !== false) {
            if (radioGroupMain._options.value == LC('CO.24-HRS')) {
              suspendPlacement = $window.moment().add(1, 'day').unix();
            }

            if (radioGroupMain._options.value == LC('CO.3-DAYS')) {
              suspendPlacement = $window.moment().add(3, 'day').unix();
            }

            if (radioGroupMain._options.value == LC('CO.7-DAYS')) {
              suspendPlacement = $window.moment().add(7, 'day').unix();
            }

          }

          if (radioGroupSend._options.value !== false) {
            suspendPlacement = 'unlimited';
          }

          if (dataSuspend !== null) {
            suspendPlacement = $window.moment(dataSuspend).unix();
          }

          if ((radioGroupSend._options.value == null) && (radioGroupMain._options.value == LC('CO.24-HRS'))) {
            suspendPlacement = $window.moment().add(1, 'day').unix();
          }

          for (var i = 0; i < tempSespendRow.placement.length; i++) {
            var w = $window.$('div.state-white' + tempSespendRow.placement[i]);
            var b = $window.$('div.state-black' + tempSespendRow.placement[i]);
            var s = $window.$('div.state-suspended' + tempSespendRow.placement[i]);
            w.dxButton('instance').option('disabled', true);
            b.dxButton('instance').option('disabled', true);
            s.dxButton('instance').option('disabled', true);
            w.removeClass('active');
            b.removeClass('active');
            s.removeClass('active');
          }

          CampaignOptimiser.editCampaignDomains(vm.campId, tempSespendRow.placement, 1, suspendPlacement)
            .then(function (res) {
              for (var i = 0; i < tempSespendRow.placement.length; i++) {
                var b = $window.$('div.state-black' + tempSespendRow.placement[i]);
                var w = $window.$('div.state-white' + tempSespendRow.placement[i]);
                var s = $window.$('div.state-suspended' + tempSespendRow.placement[i]);
                w.dxButton('instance').option('disabled', false);
                b.dxButton('instance').option('disabled', false);
                s.dxButton('instance').option('disabled', false);
                if (res == 404) {
                  $window.DevExpress.ui.notify('Not found', 'warning', 4000);
                  $window.$('.gridContainerWhite').dxDataGrid('instance').refresh();
                  return res;
                }

                if (res == 503) {
                  $window.DevExpress.ui.notify('Not connect to appnexus server, please try again later', 'warning', 4000);
                  $window.$('.gridContainerWhite').dxDataGrid('instance').refresh();
                  return res;
                }

                if (res !== 'Unactive') {
                  s.addClass('active');
                }
              }

              oneSuspend = false;
            });

          vm.confirmPopupVisible = false;
          vm.confirmPopup.option('visible', false);
          $scope.$apply();
        }
      },
      confirmPopupCancel: {
        width: 120,
        text: LC('COMMON.CANCEL'),
        onClick: function () {
          oneSuspend = false;
          vm.confirmPopup.option('visible', false);
          $scope.$apply();
        }
      },
      navCamp: {
        text: LC('CO.CAMPAIGN-HOME'),
        onClick: function () {
          $state.go('home.campaign.details', { id: vm.campId });
        }
      },
      datePiker: {
        items: products,
        displayExpr: 'Name',
        valueExpr: 'ID',
        value: products[$localStorage.SelectedTime].ID,
        onValueChanged: function (e) {
          $localStorage.SelectedTime = e.value;
          $localStorage.dataStart = products[e.value].dataStart;
          $localStorage.dataEnd = products[e.value].dataEnd;
          $localStorage.type = products[e.value].type;
          $state.reload();
        }
      },
      dataGridOptionsCampaign: {
        editing: {
          mode: 'batch',
          allowUpdating: true
        },
        loadPanel: {
          shadingColor: 'rgba(0,0,0,0.4)',
          visible: false,
          showIndicator: true,
          showPane: true,
          shading: true,
          closeOnOutsideClick: false,
        },
        alignment: 'left',
        headerFilter: {
          visible: true
        },
        filterRow: {
          visible: true,
          applyFilter: 'auto'
        },
        bindingOptions: {
          dataSource: 'CO.gridStore'
        },
        paging: {
          pageSize: 10
        },
        remoteOperations: true,
        pager: {
          showPageSizeSelector: true,
          allowedPageSizes: [10, 30, 50],
          visible: true,
          showNavigationButtons: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        wordWrapEnabled: true,
        showBorders: true,
        showRowLines: true,
        columns: [
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.PLACEMENT'),
            dataField: 'placement',
            alignment: 'center',
            dataType: 'number',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'placement');
              }
            }
          }, {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.DOMAIN'),
            dataField: 'placement__rtbimpressiontrackerplacementdomain__domain',
            alignment: 'center',
            dataType: 'string',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'domain');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.NETWORK'),
            dataField: 'NetworkPublisher',
            alignment: 'center',
            dataType: 'string',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'NetworkPublisher');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.CONV'),
            dataField: 'conv',
            alignment: 'center',
            dataType: 'number',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'conv');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.IMP'),
            dataField: 'imp',
            dataType: 'number',
            sortOrder: 'desc',
            format: 'fixedPoint',
            alignment: 'center',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'imp');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.CPA') + ' ,$',
            dataField: 'cpa',
            dataType: 'number',
            alignment: 'center',
            format: 'currency',
            precision: 4,
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'cpa');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.COST') + ' ,$',
            dataField: 'cost',
            alignment: 'center',
            format: 'currency',
            precision: 2,
            dataType: 'number',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'cost');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.CLICKS'),
            dataField: 'clicks',
            alignment: 'center',
            dataType: 'number',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'clicks');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.CPC') + ' ,$',
            dataField: 'cpc',
            alignment: 'center',
            dataType: 'number',
            format: 'currency',
            precision: 4,
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'cpc');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.CPM') + ' ,$',
            dataField: 'cpm',
            alignment: 'center',
            dataType: 'number',
            format: 'currency',
            precision: 4,
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'cpm');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.CVR') + ' ,%',
            dataField: 'cvr',
            alignment: 'center',
            dataType: 'number',
            format: 'percent',
            precision: 2,
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'cvr');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.CTR') + ' ,%',
            dataField: 'ctr',
            alignment: 'center',
            dataType: 'number',
            format: 'percent',
            precision: 2,
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'ctr');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.IMPS_VIEWED'),
            dataField: 'imps_viewed',
            alignment: 'center',
            visible: false,
            width: 80,
            format: 'fixedPoint',
            dataType: 'number',
            allowEditing: false,
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'imps_viewed');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.VIEW_MEASURED_IMPS'),
            dataField: 'view_measured_imps',
            alignment: 'center',
            format: 'fixedPoint',
            visible: false,
            width: 100,
            dataType: 'number',
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'view_measured_imps');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.VIEW_MEASUREMENT_RATE') + ' ,%',
            dataField: 'view_measurement_rate',
            alignment: 'center',
            format: 'percent',
            precision: 1,
            visible: false,
            width: 120,
            dataType: 'number',
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'view_measurement_rate');
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.VIEW_RATE') + ' ,%',
            dataField: 'view_rate',
            alignment: 'center',
            format: 'percent',
            precision: 1,
            visible: false,
            width: 80,
            dataType: 'number',
            headerFilter: {
              dataSource: function (source) {
                return headerFilterColumn(source, 'view_rate');
              }
            }
          },
          {
            caption: 'Prediction',
            width: 115,
            dataField: 'analytics',
            allowEditing: false,
            cellTemplate: function (container, options) {
              if (options.column.caption === 'Prediction') {
                vm.dataGridOptionsMultipleFunc.columnOption('analytics', 'caption', CampaignOptimiser.titlePrediction);
              }

              vm.arrayDiagram.push(options.data);
              if (options.data.analitics !== null) {
                var bad = options.data.analitics.bad;
                var good = options.data.analitics.good;
                var badOpasity = options.data.analitics.badOpasity;
                var goodOpasity = options.data.analitics.goodOpasity;
                var k = options.data.analitics.k;
                var goodDiagram = options.data.analitics.goodDiagram;
                var badDiagram = options.data.analitics.badDiagram;
                var tpl = $compile(
                  '<div class="analiticCO">' +
                  '<div class="diagramCO">' +
                  '<div class="badDiagramCO" style="width:' + badDiagram + ';opacity:' + badOpasity + ';"></div>' +
                  '<div class="goodDiagramCO" style="width:' + goodDiagram + ';opacity:' + goodOpasity + ';"></div>' +
                  '<p class="textBadDiagramCO" >' + k.toFixed(1) + '%</p>' +
                  '<p class="textGoodDiagramCO">' + (100 - k).toFixed(1) + '%</p>' +
                  '</div>' +
                  '<div class="buttonAnaliticCO' + options.data.placement + '">' +
                  '<div class="trueButtonAnaliticCO' + options.data.placement + '"></div>' +
                  '<div class="falseButtonAnaliticCO' + options.data.placement + '"></div>' +
                  '</div>' +
                  '</div>;')($scope);
                tpl.appendTo(container);

                var trueButton = $window.$('.trueButtonAnaliticCO' + options.data.placement).dxButton({
                  text: 'True',
                  disabled: false,
                  onClick: function () {
                    $window.$('.falseButtonAnaliticCO' + options.data.placement).removeClass('active-white');
                    $window.$('.trueButtonAnaliticCO' + options.data.placement).addClass('active-white');
                    CampaignOptimiser.decisionML(vm.campId, options.data.placement, true, 'kmeans')
                      .then(function (res) {
                        return res;
                      });
                  }
                });

                var falseButton = $window.$('.falseButtonAnaliticCO' + options.data.placement).dxButton({
                  text: 'False',
                  disabled: false,
                  onClick: function () {
                    $window.$('.falseButtonAnaliticCO' + options.data.placement).addClass('active-white');
                    $window.$('.trueButtonAnaliticCO' + options.data.placement).removeClass('active-white');
                    CampaignOptimiser.decisionML(vm.campId, options.data.placement, false, 'kmeans')
                      .then(function (res) {
                        return res;
                      });
                  }
                });

                if (options.data.analitics.checked == true) {
                  trueButton.addClass('active-white').append();
                } else {
                  trueButton.append();
                }

                if (options.data.analitics.checked == false) {
                  falseButton.addClass('active-white').append();
                } else {
                  falseButton.append();
                }

                vm.showAllDiagram = function (item) {
                  vm.popUpIf = true;
                  CampaignOptimiser.showAllMLDiagram(vm.campId, item)
                    .then(function (res) {
                      vm.arraytoPopup = res;
                    });
                };
              }
            }
          },
          {
            caption: LC('CAMP.CAMPAIGN.COLUMNS.STATE'),
            width: 300,
            columnIndex: 16,
            dataField: 'state',
            allowEditing: false,
            headerFilter: {
              dataSource: [{
                text: 'White',
                value: ['state', '=', 4]
              }, {
                text: 'Black',
                value: ['state', '=', 2]
              }, {
                text: 'Suspended',
                value: ['state', '=', 1]
              }]
            },
            cellTemplate: function (container, options) {
              var white = $window.$('<div />').dxButton({
                text: 'white',
                height: 30,
                width: 89,
                disabled: false,
                onClick: function (e) {
                  var w = $window.$('div.state-white' + options.data.placement);
                  var b = $window.$('div.state-black' + options.data.placement);
                  var s = $window.$('div.state-suspended' + options.data.placement);
                  w.dxButton('instance').option('disabled', true);
                  b.dxButton('instance').option('disabled', true);
                  s.dxButton('instance').option('disabled', true);
                  w.removeClass('active');
                  b.removeClass('active');
                  s.removeClass('active');
                  CampaignOptimiser.editCampaignDomains(vm.campId, [options.data.placement], 4)
                    .then(function (res) {
                      w.dxButton('instance').option('disabled', false);
                      b.dxButton('instance').option('disabled', false);
                      s.dxButton('instance').option('disabled', false);
                      if (res == 404) {
                        $window.DevExpress.ui.notify('Not found', 'warning', 4000);
                        $('#gridContainerWhite').dxDataGrid('instance').refresh();
                        return res;
                      }

                      if (res == 503) {
                        $window.DevExpress.ui.notify('Not connect to appnexus server, please try again later', 'warning', 4000);
                        $window.$('.gridContainerWhite').dxDataGrid('instance').refresh();
                        return res;
                      }

                      if (res !== 'Unactive') {
                        w.addClass('active');
                      }

                      return res;
                    })
                    .catch(function (err) {
                      return err;
                    });
                }
              });

              if (options.data.state.whiteList == 4) {
                white.addClass('state-white' + options.data.placement).addClass('active').appendTo(container);
              } else {
                white.addClass('state-white' + options.data.placement).appendTo(container);
              }

              var black = $window.$('<div />').dxButton({
                text: 'black',
                height: 30,
                width: 89,
                disabled: false,
                onClick: function (e) {
                  var w = $window.$('div.state-white' + options.data.placement);
                  var b = $window.$('div.state-black' + options.data.placement);
                  var s = $window.$('div.state-suspended' + options.data.placement);
                  w.dxButton('instance').option('disabled', true);
                  b.dxButton('instance').option('disabled', true);
                  s.dxButton('instance').option('disabled', true);
                  w.removeClass('active');
                  b.removeClass('active');
                  s.removeClass('active');
                  CampaignOptimiser.editCampaignDomains(vm.campId, [options.data.placement], 2)
                    .then(function (res) {
                      w.dxButton('instance').option('disabled', false);
                      b.dxButton('instance').option('disabled', false);
                      s.dxButton('instance').option('disabled', false);
                      if (res == 404) {
                        $window.DevExpress.ui.notify('Not found', 'warning', 4000);
                        $window.$('.gridContainerWhite').dxDataGrid('instance').refresh();
                        return res;
                      }

                      if (res == 503) {
                        $window.DevExpress.ui.notify('Not connect to appnexus server, please try again later', 'warning', 4000);
                        $window.$('.gridContainerWhite').dxDataGrid('instance').refresh();
                        return res;
                      }

                      if (res !== 'Unactive') {
                        b.addClass('active');
                      }

                      return res;
                    })
                    .catch(function (err) {
                      return err;
                    });
                }
              });

              if (options.data.state.blackList == 2) {
                black.addClass('state-black' + options.data.placement).addClass('active').appendTo(container);
              } else {
                black.addClass('state-black' + options.data.placement).appendTo(container);
              }

              var suspended = $window.$('<div />').dxButton({
                text: 'suspend',
                height: 30,
                width: 95,
                disabled: false,
                onClick: function () {
                  if (oneSuspend == true) {
                    $window.DevExpress.ui.notify('Wait please', 'warning', 4000);
                    return 0;
                  }

                  tempSespendRow.placement = [options.data.placement];
                  tempSespendRow.suspend = 1;
                  vm.confirmPopup.option('visible', true);
                }
              });

              if (options.data.state.suspended == 1) {
                suspended.addClass('state-suspended' + options.data.placement).addClass('active').appendTo(container);
              } else {
                suspended.addClass('state-suspended' + options.data.placement).appendTo(container);
              }

            }
          }
        ],
        summary: {
          totalItems: [
            {
              column: 'placement',
              summaryType: 'count',
              customizeText: function (data) {
                data.valueText = 'Count: ' + vm.dataGridOptionsMultipleFunc.totalCount();
                return data.valueText;
              }
            },
            {
              column: 'conv',
              summaryType: 'sum',
              customizeText: function (data) {
                data.valueText = 'Conv: ' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.conv : '0');
                return data.valueText;
              }
            },
            {
              column: 'imp',
              summaryType: 'sum',
              customizeText: function (data) {
                data.valueText = 'Imp: ' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.imp.toString().split(/(?=(?:\d{3})+(?!\d))/).join() : '0');
                return data.valueText;
              }
            },
            {
              column: 'cpa',
              summaryType: 'sum',
              valueFormat: 'currency',
              customizeText: function (data) {
                data.valueText = 'CPA: $' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.cpa.toFixed(4) : '0');
                return data.valueText;
              }
            },
            {
              column: 'cost',
              summaryType: 'sum',
              valueFormat: 'currency',
              customizeText: function (data) {
                data.valueText = 'Cost: $' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.cost.toFixed(2) : '0');
                return data.valueText;
              }
            },
            {
              column: 'clicks',
              summaryType: 'sum',
              customizeText: function (data) {
                data.valueText = 'Clicks: ' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.clicks : '0');
                return data.valueText;
              }
            },
            {
              column: 'cpc',
              summaryType: 'sum',
              customizeText: function (data) {
                data.valueText = 'CPC: $' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.cpc.toFixed(4) : '0');
                return data.valueText;
              }
            },
            {
              column: 'cpm',
              summaryType: 'sum',
              customizeText: function (data) {
                data.valueText = 'CPM: $' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.cpm.toFixed(4) : '0');
                return data.valueText;
              }
            },
            {
              column: 'cvr',
              summaryType: 'sum',
              customizeText: function (data) {
                data.valueText = 'CVR: %' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.cvr.toFixed(4) : '0');
                return data.valueText;
              }
            },
            {
              column: 'ctr',
              summaryType: 'sum',
              customizeText: function (data) {
                data.valueText = 'CTR: %' + ((CampaignOptimiser.totalSummary != null) ? CampaignOptimiser.totalSummary.ctr.toFixed(4) : '0');
                return data.valueText;
              }
            }
          ]
        },
        columnChooser: {
          enabled: true,
          height: 180,
          width: 400,
          emptyPanelText: 'A place to hide the columns'
        },
        selection: {
          mode: 'multiple',
          allowSelectAll: false,
          showCheckBoxesMode: 'always'
        },
        onInitialized: function (data) {
          vm.dataGridOptionsMultipleFunc = data.component;
          vm.dataGridOptionsMultipleFunc._controllers.columns._commandColumns[1].visibleIndex = 9;
          vm.dataGridOptionsMultipleFunc._controllers.columns._commandColumns[1].width = 35;
        },
        onEditorPreparing: function (info) {
          if ((info.parentType == 'filterRow') && (info.dataField == 'state')) {
            info.editorElement.dxSelectBox({
              dataSource: [
                {
                  name: 'White List',
                  state: 4
                },
                {
                  name: 'Black List',
                  state: 2
                },
                {
                  name: 'Suspended',
                  state: 1
                },
                {
                  name: 'Clear state',
                  state: 0
                }
              ],
              placeholder: 'Select a state',
              displayExpr: 'name',
              valueExpr: vm.state,
              onSelectionChanged: function (e) {
                var selectedRows = $window.$('.gridContainerWhite')[0].querySelectorAll('[aria-selected="true"]');
                if (selectedRows[0]) {
                  var selectedArr = [];
                  for (var i = 0; i < selectedRows.length; i++) {
                    selectedArr.push(selectedRows[i].firstChild.innerText);
                  }

                  if (e.selectedItem.state == 1) {
                    if (selectedArr != '[]') {
                      tempSespendRow.placement = selectedArr;
                      tempSespendRow.suspend = 'suspend';
                      vm.confirmPopupVisible = true;
                      vm.confirmPopup.option('visible', true);
                    }
                  } else {
                    if (selectedArr != '[]') {
                      for (var i = 0; i < selectedArr.length; i++) {
                        var w = $window.$('div.state-white' + selectedArr[i]);
                        var b = $window.$('div.state-black' + selectedArr[i]);
                        var s = $window.$('div.state-suspended' + selectedArr[i]);
                        w.dxButton('instance').option('disabled', true);
                        b.dxButton('instance').option('disabled', true);
                        s.dxButton('instance').option('disabled', true);
                        w.removeClass('active');
                        b.removeClass('active');
                        s.removeClass('active');
                      }

                      CampaignOptimiser.editCampaignDomains(vm.campId, selectedArr, e.selectedItem.state).then(function (res) {
                        for (var i = 0; i < selectedArr.length; i++) {
                          var b = $window.$('div.state-black' + selectedArr[i]);
                          var w = $window.$('div.state-white' + selectedArr[i]);
                          var s = $window.$('div.state-suspended' + selectedArr[i]);
                          w.dxButton('instance').option('disabled', false);
                          b.dxButton('instance').option('disabled', false);
                          s.dxButton('instance').option('disabled', false);
                          if (res == 404) {
                            $window.DevExpress.ui.notify('Not found', 'warning', 4000);
                            $window.$('.gridContainerWhite').dxDataGrid('instance').refresh();
                            return res;
                          }

                          if (res == 503) {
                            $window.DevExpress.ui.notify('Not connect to appnexus server, please try again later', 'warning', 4000);
                            $window.$('.gridContainerWhite').dxDataGrid('instance').refresh();
                            return res;
                          }

                          if (e.selectedItem.state == 2) {
                            b.addClass('active');
                          }

                          if (e.selectedItem.state == 4) {
                            w.addClass('active');
                          }
                        }
                      });
                    }
                  }
                } else {
                  return $window.DevExpress.ui.notify(LC('CO.NO-ITEMS-CHOSEN'), 'warning', 4000);
                }

                $('.gridContainerWhite').dxDataGrid('instance').refresh();
              }
            });
            info.cancel = true;
          }
        },

        onSelectionChanged: function (data) {
          vm.selectedItems = data.selectedRowsData;
          vm.disabled = !vm.selectedItems.length;
        }
      }
    };

  }
})();
