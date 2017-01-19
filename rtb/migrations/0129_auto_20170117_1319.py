# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-01-17 13:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0128_sitedomainperformancereport_hour'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='videoadcampaigns',
            name='advertiser_id',
        ),
        migrations.RemoveField(
            model_name='videoadcampaigns',
            name='campaign_id',
        ),
        migrations.AddField(
            model_name='videoadcampaigns',
            name='advertiser',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Advertiser'),
        ),
        migrations.AddField(
            model_name='videoadcampaigns',
            name='campaign',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Campaign'),
        ),
        migrations.AddField(
            model_name='videoadcampaigns',
            name='campaign_name',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='videoadcampaigns',
            name='hour',
            field=models.DateTimeField(db_index=True, null=True),
        ),
    ]
