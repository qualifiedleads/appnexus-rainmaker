# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-07 08:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('rtb', '0028_yieldmanagementprofile_fetch_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentrule',
            name='fetch_date',
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
    ]
