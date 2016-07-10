# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-04 21:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0013_auto_20160704_2135'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlatformMember',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.TextField(blank=True, db_index=True, null=True)),
                ('primary_type', models.TextField(blank=True, choices=[(b'network', b'network'), (b'buyer', b'buyer'), (b'seller', b'seller'), (b'data_provider', b'data_provider')], null=True)),
                ('platform_exposure', models.TextField(blank=True, choices=[(b'public', b'public'), (b'private', b'private')], null=True)),
                ('email', models.TextField(blank=True, null=True)),
                ('daily_imps_any_audit_status', models.IntegerField(blank=True, null=True)),
                ('daily_imps_appnexus_reviewed', models.IntegerField(blank=True, null=True)),
                ('daily_imps_appnexus_seller_reviewed', models.IntegerField(blank=True, null=True)),
                ('is_iash_compliant', models.NullBooleanField()),
                ('has_resold', models.NullBooleanField()),
                ('visibility_rules', models.TextField(blank=True, null=True)),
                ('bidder_id', models.IntegerField(blank=True, null=True)),
                ('seller_type', models.TextField(blank=True, choices=[(b'platform', b'platform'), (b'partner', b'partner')], null=True)),
                ('contact_info', models.TextField(blank=True, null=True)),
                ('active', models.NullBooleanField()),
                ('last_modified', models.DateTimeField(blank=True, null=True)),
                ('default_discrepancy_pct', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'platform_member',
            },
        ),
        migrations.RemoveField(
            model_name='networkanalyticsreport',
            name='entity_member',
        ),
        migrations.AddField(
            model_name='networkanalyticsreport',
            name='entity_member_id',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='networkanalyticsreport',
            name='buyer_member',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='buyer_member_id', to='rtb.PlatformMember'),
        ),
        migrations.AlterField(
            model_name='networkanalyticsreport',
            name='seller_member',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='seller_member_id', to='rtb.PlatformMember'),
        ),
        migrations.AlterField(
            model_name='networkanalyticsreport',
            name='seller_type',
            field=models.TextField(blank=True, choices=[(b'platform', b'platform'), (b'partner', b'partner')], null=True),
        ),
    ]
