# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-31 09:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0098_campaignrules'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaignrules',
            name='campaign',
            field=models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Campaign', unique=True),
        ),
    ]
