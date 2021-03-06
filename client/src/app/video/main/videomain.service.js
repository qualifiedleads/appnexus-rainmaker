(function () {
  'use strict';

  angular
  .module('pjtLayout')
  .service('VideoMain', VideoMain);

  /** @ngInject */
  function VideoMain($http, $window, $cookies) {
    var _this = this;
    var _multipleTotalCount = 0;

    function chartStore(id, dataStart, dataEnd, by) {
      return new $window.DevExpress.data.CustomStore({
        totalCount: function () {
          return 0;
        },

        load: function () {
          return _statsChart(id, dataStart, dataEnd, by)
          .then(function (result) {
            return result;
          });
        }
      });
    }

    function _statsChart(advertiser_id, from_date, to, by) {
      return $http({
        method: 'GET',
        url: '/api/v1/videostatistics',
        headers: { Authorization: 'Token ' + $cookies.get('token') },
        params: { advertiser_id: advertiser_id, from_date: from_date, to_date: to, by: by }
      })
      .then(function (res) {
        for (var index in res.data) {
          res.data[index].day = $window.moment(res.data[index].day).format('DD/MM');
        }

        return res.data;
      })
      .catch(function (err) {
        $window.DevExpress.ui.notify(err.data.detail, 'error', 4000);
      });
    }

    function multipleStore(id, dataStart, dataEnd, by) {
      return new $window.DevExpress.data.CustomStore({
        totalCount: function () {
          return _multipleTotalCount;
        },

        load: function (loadOptions) {
          if (loadOptions.searchOperation && loadOptions.dataField) {
            loadOptions.take = 99999999;
          }

          return _statsCampaigns(id, dataStart, dataEnd, loadOptions.skip,
              loadOptions.take, loadOptions.sort, loadOptions.order,
              by, loadOptions.filter, loadOptions.totalSummary)
          .then(function (result) {
            _multipleTotalCount = result.total_count || 0;
            return result.campaigns;
          });
        }
      });
    }

    function _statsCampaigns(advertiser_id, from_date, to, skip, take, sort, order, stat_by, filters, totalSummary) {
      if (sort) {
        if (sort[0].desc === true) {
          order = 'desc';
        } else {
          order = 'asc';
        }

        sort = sort[0].selector;
      } else {
        sort = 'campaign';
        order = 'DESC';
      }

      if (take == null) {
        take = 20;
      }

      if (skip == null) {
        skip = 0;
      }

      return $http({
        method: 'GET',
        url: '/api/v1/videocampaigns',
        headers: { Authorization: 'Token ' + $cookies.get('token') },
        params: {
          advertiser_id: advertiser_id,
          from_date: from_date,
          to_date: to,
          skip: skip,
          take: take,
          sort: sort,
          order: order,
          stat_by: stat_by,
          filter: filters,
          totalSummary: totalSummary
        }
      })
      .then(function (res) {

        _this.totalSummary = {
          campaign: res.data.total_count || 0,
          ad_starts: res.data.total_ad_starts || 0,
          cpm: res.data.total_cpm || 0,
          fill_rate: res.data.total_fill_rate || 0,
          fill_rate_hour: res.data.total_fill_rate_hour || 0,
          profit_loss: res.data.total_profit_loss || 0,
          profit_loss_hour: res.data.total_profit_loss_hour || 0,
          spent: res.data.total_spent || 0,
          sum_imps: res.data.total_sum_imps || 0
        };
        return res.data;
      })
      .catch(function (err) {
        $window.DevExpress.ui.notify(err.data.detail, 'error', 4000);
      });
    }

    function statsMap(advertiser_id, from_date, to) {
      return $http({
        method: 'GET',
        url: '/api/v1/map/imps',
        headers: { Authorization: 'Token ' + $cookies.get('token') },
        params: { advertiser_id: advertiser_id, from_date: from_date, to_date: to }
      })
      .then(function (res) {
        return res.data;
      })
      .catch(function (err) {
        $window.DevExpress.ui.notify(err.data.detail, 'error', 4000);
      });
    }

    function updateCampaign(advertiserId) {
      return $http({
        method: 'GET',
        url: '/api/v1/advertiser/' + advertiserId + '/update',
        headers: { Authorization: 'Token ' + $cookies.get('token') },
      })
      .then(function (res) {
        return res.status;
      })
      .catch(function (err) {
        $window.DevExpress.ui.notify(err.data.detail, 'error', 4000);
      });
    }

    _this.updateCampaign = updateCampaign;
    _this.multipleStore = multipleStore;
    _this.chartStore = chartStore;
    _this.statsMap = statsMap;

  }
})();
