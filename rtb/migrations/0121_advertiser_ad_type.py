# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-01-03 13:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0120_merge_20170103_1235'),
    ]

    operations = [
        migrations.AddField(
            model_name='advertiser',
            name='ad_type',
            field=models.TextField(blank=True, null=True),
        ),
    ]