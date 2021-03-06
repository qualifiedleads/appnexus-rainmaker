# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-25 14:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0094_placementstate_change'),
    ]

    operations = [
        migrations.CreateModel(
            name='MLExpertsPlacementsMarks',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('day', models.IntegerField(db_index=True)),
                ('expert_decision', models.TextField(db_index=True)),
                ('date', models.DateField()),
                ('placement', models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Placement')),
            ],
            options={
                'db_table': 'ml_experts_placements_marks',
            },
        ),
        migrations.CreateModel(
            name='RtbImpressionTrackerPlacementDomain',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('domain', models.TextField(blank=True, db_index=True, null=True)),
                ('placement', models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Placement', unique=True)),
            ],
            options={
                'db_table': 'rtb_impression_tracker_placement_domain',
            },
        ),
        migrations.AlterField(
            model_name='rtbimpressiontrackerplacement',
            name='domain',
            field=models.TextField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='rtbimpressiontrackerplacement',
            name='placement',
            field=models.ForeignKey(db_constraint=False, default=0, on_delete=django.db.models.deletion.DO_NOTHING, to='rtb.Placement'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='rtbimpressiontrackerplacement',
            unique_together=set([('placement', 'domain')]),
        ),
    ]
