# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-16 10:14
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0016_auto_20160616_1002'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sitedomainperformancereport',
            name='conversion_pixel_id',
        ),
        migrations.AddField(
            model_name='sitedomainperformancereport',
            name='conversion_pixel',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rtb.ConversionPixel'),
        ),
        migrations.AlterField(
            model_name='sitedomainperformancereport',
            name='campaign_group',
            field=models.TextField(blank=True, db_index=True, null=True),
        ),
    ]