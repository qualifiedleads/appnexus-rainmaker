# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-12 07:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('rtb', '0039_auto_20160710_1023'),
    ]

    operations = [
        migrations.AddField(
            model_name='adqualityrule',
            name='fetch_date',
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
    ]
