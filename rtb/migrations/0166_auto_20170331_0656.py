# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-31 06:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0165_view_for_unsuspend_placement'),
    ]

    operations = [
        migrations.AddField(
            model_name='placementstateunsuspend',
            name='rule_id',
            field=models.IntegerField(db_index=True, null=True),
        ),
        migrations.AddField(
            model_name='placementstateunsuspend',
            name='rule_index',
            field=models.IntegerField(db_index=True, null=True),
        ),
    ]