import datetime
from django.db import models
from pytz import utc
from ..report import nexus_get_objects_by_id
from .models import Placement

class NetworkAnalyticsReport_ByPlacement(models.Model):
    hour = models.DateTimeField(null=True, blank=True, db_index=True)
    placement = models.ForeignKey("Placement", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    campaign = models.ForeignKey("Campaign", null=True, blank=True, db_constraint=False, on_delete = models.DO_NOTHING)
    imps = models.IntegerField(null=True, blank=True)
    clicks = models.IntegerField(null=True, blank=True)
    cost = models.DecimalField(null=True, blank=True, max_digits=35, decimal_places=10)
    total_convs = models.IntegerField(null=True, blank=True)

    api_report_name = "network_analytics"

    @classmethod
    def post_load(self, day):
        from_date = datetime.datetime(day.year, day.month, day.day, tzinfo=utc)
        to_date = datetime.datetime(day.year, day.month, day.day, 23, tzinfo=utc)
        placements_mising = self.objects.filter(
            hour__gte=from_date,
            hour__lte=to_date,
            placement__id=None
        ).values_list('placement_id', flat=True)
        print placements_mising
        # load all missing placements
        saved_ids = nexus_get_objects_by_id(None,Placement,placements_mising)
        if saved_ids !=placements_mising:
            print 'Some objects not saved'

    class Meta:
        app_label = 'rtb'
        db_table = "network_analytics_report_by_placement"
        index_together = ["campaign", "hour"]