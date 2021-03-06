# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-01-10 15:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0125_auto_20170110_1447'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rtbadstarttracker',
            name='AdvId',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbadstarttracker',
            name='CpId',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbclicktracker',
            name='AdvId',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbclicktracker',
            name='CpId',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbconversiontracker',
            name='AdvId',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbconversiontracker',
            name='CpId',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbimpressiontracker',
            name='PlacementId',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
    ]
