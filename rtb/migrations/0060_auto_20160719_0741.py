# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-19 07:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('rtb', '0059_frameworkuser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='platformmember',
            name='daily_imps_any_audit_status',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='platformmember',
            name='daily_imps_appnexus_reviewed',
            field=models.BigIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='platformmember',
            name='daily_imps_appnexus_seller_reviewed',
            field=models.BigIntegerField(blank=True, null=True),
        ),
    ]