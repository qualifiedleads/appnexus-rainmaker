# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-31 17:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0099_auto_20161031_0936'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='last_modified',
            field=models.DateTimeField(),
        ),
    ]
