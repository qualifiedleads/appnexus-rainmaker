# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-30 17:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0081_networkanalyticsreport_byplacement_geo_country_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='networkanalyticsreport_byplacement_test',
            name='geo_country_name',
            field=models.TextField(blank=True, null=True),
        ),
    ]
