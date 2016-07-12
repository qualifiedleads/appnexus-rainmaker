# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-12 10:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('rtb', '0043_auto_20160712_1042'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='fetch_date',
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='fetch_date',
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='company',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]