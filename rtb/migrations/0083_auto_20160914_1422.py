# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-14 14:22
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0082_networkanalyticsreport_byplacement_test_geo_country_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='MLClustersCentroidsKmeans',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('cluster', models.IntegerField()),
                ('day', models.IntegerField(db_index=True)),
                ('centroid', django.contrib.postgres.fields.ArrayField(base_field=models.DecimalField(decimal_places=10, max_digits=35), size=None)),
            ],
            options={
                'db_table': 'clusters_centroids_kmeans',
            },
        ),
        migrations.CreateModel(
            name='MLPlacementDailyFeatures',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('day', models.IntegerField(db_index=True)),
                ('imps', models.IntegerField()),
                ('clicks', models.IntegerField()),
                ('total_convs', models.IntegerField()),
                ('imps_viewed', models.IntegerField()),
                ('view_measured_imps', models.IntegerField()),
                ('cost', models.DecimalField(decimal_places=10, max_digits=35)),
                ('view_rate', models.FloatField(db_index=True)),
                ('view_measurement_rate', models.FloatField(db_index=True)),
                ('cpa', models.FloatField()),
                ('ctr', models.FloatField(db_index=True)),
                ('placement', models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Placement')),
            ],
            options={
                'db_table': 'ml_placement_daily_features',
            },
        ),
        migrations.CreateModel(
            name='MLPlacementsClustersKmeans',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('day', models.IntegerField(db_index=True)),
                ('cluster', models.IntegerField(db_index=True)),
                ('placement', models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Placement')),
            ],
            options={
                'db_table': 'ml_placements_clusters_kmeans',
            },
        ),
        migrations.AlterUniqueTogether(
            name='mlclusterscentroidskmeans',
            unique_together=set([('cluster', 'day')]),
        ),
        migrations.AlterUniqueTogether(
            name='mlplacementsclusterskmeans',
            unique_together=set([('placement', 'day')]),
        ),
        migrations.AlterUniqueTogether(
            name='mlplacementdailyfeatures',
            unique_together=set([('placement', 'day')]),
        ),
    ]