import datetime
from django.db import models, transaction
from pytz import utc
from ..report import nexus_get_objects_by_id
from .models import Placement, Campaign, Site, PlatformMember, Publisher, \
     DEAL_PAYMENT_TYPE_CHOICES, REVENUE_TYPE_CHOICES, BID_TYPE_CHOICES, IMPRESSION_TYPE_CHOICES, \
     DEVICE_TYPE_INREPORT_CHOICES, CONNECTION_TYPE_CHOICES, BUYER_TYPE_NetworkDeviceReport_CHOICES, \
     SELLER_TYPE_NetworkDeviceReport_CHOICES
from common import PostLoadMix, load_foreign_objects

class TransformMix(object):
    def TransformFields(self, data, metadata={}):
        if 'media_type' in data:
            self.media_type_name = data['media_type']

class Carrier(models.Model):
    """
    https://wiki.appnexus.com/display/api/Carrier+Service
    """
    id = models.IntegerField(primary_key=True) # The ID of the mobile carrier.
    name = models.TextField(null=True, blank=True) # The name of the mobile carrier.
    country_code = models.CharField(max_length=2, null=True, blank=True) # The ISO code for the country in which the carrier operates.
    country_name = models.TextField(null=True, blank=True) # The name of the country in which the carrier operates.
    codes = models.TextField(null=True, blank=True) # Third-party representations for the mobile carrier. See Codes below for more details.

    api_endpoint = 'carrier'

    class Meta:
        app_label = 'rtb'
        db_table = "carrier"


class NetworkAnalyticsReport_ByPlacement(models.Model):
    hour = models.DateTimeField(null=True, blank=True, db_index=True)
    publisher = models.ForeignKey("Publisher", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    publisher_name = models.TextField(null=True, blank=True)
    placement = models.ForeignKey("Placement", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    placement_name = models.TextField(null=True, blank=True)
    campaign = models.ForeignKey("Campaign", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    campaign_name = models.TextField(null=True, blank=True)
    seller_member = models.ForeignKey("PlatformMember", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    seller_member_name = models.TextField(null=True, blank=True)
    creative = models.ForeignKey("Creative", null=True, blank=True,db_constraint=False, on_delete = models.DO_NOTHING)
    creative_name = models.TextField(null=True, blank=True)
    size = models.TextField(null=True, blank=True)
    imps = models.IntegerField(null=True, blank=True)
    clicks = models.IntegerField(null=True, blank=True)
    cost = models.DecimalField(null=True, blank=True, max_digits=35, decimal_places=10)
    total_convs = models.IntegerField(null=True, blank=True)
    imps_viewed = models.IntegerField(null=True, blank=True)
    view_measured_imps = models.IntegerField(null=True, blank=True)
    view_rate = models.FloatField(null=True, blank=True)
    view_measurement_rate = models.FloatField(null=True, blank=True)
    site = models.ForeignKey("Site", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    site_name = models.TextField(null=True, blank=True)
    geo_country = models.ForeignKey("Country", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    geo_country_name = models.TextField(null=True, blank=True)
    bid_type = models.TextField(
        choices=BID_TYPE_CHOICES,
        null=True, blank=True)
    imp_type_id = models.IntegerField(
        choices=IMPRESSION_TYPE_CHOICES,
        null=True, blank=True)

    api_report_name = "network_analytics"
    direct_csv = True

    @classmethod
    def post_load(self, day):
        from_date = datetime.datetime(day.year, day.month, day.day, tzinfo=utc)
        to_date = datetime.datetime(day.year, day.month, day.day, 23, tzinfo=utc)
        load_foreign_objects(self, 'campaign', Campaign, from_date, to_date)
        load_foreign_objects(self, 'seller_member', PlatformMember, from_date, to_date)
        load_foreign_objects(self, 'publisher', Publisher, from_date, to_date)

        with transaction.atomic():
            placements_mising=load_foreign_objects(self, 'placement', Placement, from_date, to_date)
            sites_missing = Placement.objects.filter(
                pk__in=placements_mising,
                site__name=None
            ).values_list('site_id', flat=True)
            sites_missing = set(sites_missing)
            sites_missing.discard(None)
            sites_missing.discard(0)
            saved_ids = nexus_get_objects_by_id(None,Site,sites_missing)
            if saved_ids != sites_missing:
                print 'Some sites not saved'

    class Meta:
        app_label = 'rtb'
        db_table = "network_analytics_report_by_placement"
        index_together = ["campaign", "hour"]

class NetworkCarrierReport_Simple(models.Model, PostLoadMix, TransformMix):
    # https://wiki.appnexus.com/display/api/Network+Carrier+Analytics
    fetch_date = models.DateTimeField(null=True, blank=True, db_index=True)
    # month = time
    day = models.DateTimeField(null=True, blank=True, db_index=True)
    carrier = models.ForeignKey("Carrier", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    carrier_name = models.TextField(null=True, blank=True)
    device_type = models.TextField(
        choices=DEVICE_TYPE_INREPORT_CHOICES,
        null=True, blank=True)
    connection_type = models.TextField(
        choices=CONNECTION_TYPE_CHOICES,
        null=True, blank=True)
    seller_member = models.ForeignKey("PlatformMember", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    seller_member_name = models.TextField(null=True, blank=True)
    seller_type = models.TextField(
        choices=SELLER_TYPE_NetworkDeviceReport_CHOICES,
        null=True, blank=True)
    campaign = models.ForeignKey("Campaign", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    campaign_name = models.TextField(null=True, blank=True)
    media_type = models.ForeignKey("MediaType", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    media_type_name = models.TextField(null=True, blank=True,db_column= 'media_type') # Need special loading
    size = models.TextField(null=True, blank=True)
    geo_country = models.ForeignKey("Country", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    geo_country_name = models.TextField(null=True, blank=True)
    publisher = models.ForeignKey("Publisher", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    publisher_name = models.TextField(null=True, blank=True)
    imps = models.IntegerField(null=True, blank=True)
    clicks = models.IntegerField(null=True, blank=True)
    total_convs = models.IntegerField(null=True, blank=True)
    cost = models.DecimalField(null=True, blank=True, max_digits=35, decimal_places=10)

    api_report_name='network_carrier_analytics'
    add_api_columns = ('media_type',)
    direct_csv = True

    class Meta:
        db_table = "network_carrier_report_simple"
        app_label = 'rtb'

class NetworkDeviceReport_Simple(models.Model, PostLoadMix, TransformMix):
    # https://wiki.appnexus.com/display/api/Network+Device+Analytics
    fetch_date = models.DateTimeField(null=True, blank=True, db_index=True)
    # month = time
    day = models.DateTimeField(null=True, blank=True, db_index=True)
    device_make = models.ForeignKey("DeviceMake", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    device_make_name = models.TextField(null=True, blank=True)
    device_model = models.ForeignKey("DeviceModel", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    device_model_name = models.TextField(null=True, blank=True)
    device_type = models.TextField(
        choices=DEVICE_TYPE_INREPORT_CHOICES,
        null=True, blank=True)
    connection_type = models.TextField(
        choices=CONNECTION_TYPE_CHOICES,
        null=True, blank=True)
    operating_system = models.ForeignKey("OperatingSystemExtended", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    operating_system_name = models.TextField(null=True, blank=True)
    browser = models.ForeignKey("Browser", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    browser_name = models.TextField(null=True, blank=True)
    seller_member = models.ForeignKey("PlatformMember", related_name='+', null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    seller_member_name = models.TextField(null=True, blank=True)
    seller_type = models.TextField(
        choices=SELLER_TYPE_NetworkDeviceReport_CHOICES,
        null=True, blank=True)
    campaign = models.ForeignKey("Campaign", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    campaign_name = models.TextField(null=True, blank=True)
    media_type = models.ForeignKey("MediaType", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    media_type_name = models.TextField(null=True, blank=True,db_column='media_type') # Need special loading
    geo_country = models.ForeignKey("Country", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    geo_country_name = models.TextField(null=True, blank=True)
    publisher = models.ForeignKey("Publisher", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    publisher_name = models.TextField(null=True, blank=True)
    imps = models.IntegerField(null=True, blank=True)
    clicks = models.IntegerField(null=True, blank=True)
    total_convs = models.IntegerField(null=True, blank=True)
    cost = models.DecimalField(null=True, blank=True, max_digits=35, decimal_places=10)

    api_report_name = 'network_device_analytics'
    # add_api_columns = ('media_type',)
    direct_csv = True

    class Meta:
        db_table = "network_device_report_simple"
        app_label = 'rtb'
