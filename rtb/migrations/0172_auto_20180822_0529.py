# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2018-08-22 05:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0171_auto_20171115_1156'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mlvideoimpstracker',
            name='SegIds',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbimpressiontracker',
            name='SegIds',
            field=models.TextField(blank=True, null=True),
        ),
    ]