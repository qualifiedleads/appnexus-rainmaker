# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-08-13 14:46
from __future__ import unicode_literals

from django.db import migrations, models

def delete_report_archive(apps, schema_editor):
    MyModel = apps.get_model('rtb', 'networkanalyticsreport_byplacement')
    MyModel.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0068_auto_20160813_0820'),
    ]

    operations = [
        migrations.RunPython(delete_report_archive, hints={'model_name': "networkanalyticsreport_byplacement"},
                             reverse_code=migrations.RunPython.noop),

        migrations.AddField(
            model_name='networkanalyticsreport_byplacement',
            name='imps_viewed',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='networkanalyticsreport_byplacement',
            name='view_measured_imps',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='networkanalyticsreport_byplacement',
            name='view_measurement_rate',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='networkanalyticsreport_byplacement',
            name='view_rate',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
