# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-12 14:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0117_rtbclicktracker_rtbconversiontracker'),
    ]

    operations = [
        migrations.AddField(
            model_name='rtbimpressiontracker',
            name='AdvId',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='rtbimpressiontracker',
            name='CreativeId',
            field=models.TextField(blank=True, null=True),
        ),
    ]