# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-16 15:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0057_auto_20160716_0913'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='start_date',
            field=models.DateTimeField(db_index=True, default=django.utils.timezone.now, null=True),
        ),
    ]
