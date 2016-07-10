# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-05 09:11
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0018_deal_dealallowedmediasubtype_dealallowedmediatype_dealbrand_dealcategory_dealcreative_deallanguage_d'),
    ]

    operations = [
        migrations.CreateModel(
            name='DemographicArea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, db_index=True, null=True)),
            ],
            options={
                'db_table': 'demographic_area',
            },
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(blank=True, db_index=True, null=True)),
                ('code', models.TextField(blank=True, null=True)),
                ('country', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rtb.Country')),
            ],
            options={
                'db_table': 'region',
            },
        ),
        migrations.RenameField(
            model_name='geoanaliticsreport',
            old_name='pixel_id',
            new_name='pixel',
        ),
        migrations.RemoveField(
            model_name='geoanaliticsreport',
            name='geo_country_code',
        ),
        migrations.RemoveField(
            model_name='geoanaliticsreport',
            name='geo_country_id',
        ),
        migrations.RemoveField(
            model_name='geoanaliticsreport',
            name='geo_dma_id',
        ),
        migrations.RemoveField(
            model_name='geoanaliticsreport',
            name='geo_dma_name',
        ),
        migrations.RemoveField(
            model_name='geoanaliticsreport',
            name='geo_region_code',
        ),
        migrations.RemoveField(
            model_name='geoanaliticsreport',
            name='geo_region_id',
        ),
        migrations.RemoveField(
            model_name='networkanalyticsreport',
            name='deal_id',
        ),
        migrations.RemoveField(
            model_name='sitedomainperformancereport',
            name='deal_id',
        ),
        migrations.AddField(
            model_name='networkanalyticsreport',
            name='deal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rtb.Deal'),
        ),
        migrations.AddField(
            model_name='sitedomainperformancereport',
            name='deal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rtb.Deal'),
        ),
        migrations.AlterField(
            model_name='geoanaliticsreport',
            name='geo_dma',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rtb.DemographicArea'),
        ),
    ]
