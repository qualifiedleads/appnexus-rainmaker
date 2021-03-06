# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-22 12:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rtb', '0161_advertiser_rules_type'),
    ]

    operations = [
        migrations.RunSQL("""
CREATE VIEW view_rule_type_tracker AS SELECT na.campaign_id,
    na.placement_id,
    na.impressions,
    na.clicks,
    na.spent,
    na.cpa,
    na.ctr,
    na.cvr,
    na.cpc,
    kmeans.good AS prediction1,
    logreg.good AS prediction2
   FROM ((ml_logistic_regression_results logreg
     RIGHT JOIN ( SELECT ui_usual_placements_grid_data_all_tracker.campaign_id,
            ui_usual_placements_grid_data_all_tracker.placement_id,
            sum(ui_usual_placements_grid_data_all_tracker.imps) AS impressions,
            sum(ui_usual_placements_grid_data_all_tracker.clicks) AS clicks,
            sum(ui_usual_placements_grid_data_all_tracker.spent) AS spent,
            CASE sum(ui_usual_placements_grid_data_all_tracker.conversions)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all_tracker.spent))::double precision / (sum(ui_usual_placements_grid_data_all_tracker.conversions))::double precision)
            END AS cpa,
            CASE sum(ui_usual_placements_grid_data_all_tracker.imps)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all_tracker.clicks))::double precision / (sum(ui_usual_placements_grid_data_all_tracker.imps))::double precision)
            END AS ctr,
            CASE sum(ui_usual_placements_grid_data_all_tracker.imps)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all_tracker.conversions))::double precision / (sum(ui_usual_placements_grid_data_all_tracker.imps))::double precision)
            END AS cvr,
            CASE sum(ui_usual_placements_grid_data_all_tracker.clicks)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all_tracker.spent))::double precision / (sum(ui_usual_placements_grid_data_all_tracker.clicks))::double precision)
            END AS cpc
           FROM ui_usual_placements_grid_data_all_tracker
          GROUP BY ui_usual_placements_grid_data_all_tracker.campaign_id, ui_usual_placements_grid_data_all_tracker.placement_id) na ON ((logreg.placement_id = na.placement_id)))
     LEFT JOIN ( SELECT ml_placements_clusters_kmeans.placement_id,
            ml_placements_clusters_kmeans.good
           FROM ml_placements_clusters_kmeans
          WHERE ((ml_placements_clusters_kmeans.day = 7) AND (ml_placements_clusters_kmeans.test_number = 2))) kmeans ON ((na.placement_id = kmeans.placement_id)))
          """),

        migrations.RunSQL("""
CREATE VIEW view_rule_type_usual AS SELECT na.campaign_id,
    na.placement_id,
    na.impressions,
    na.clicks,
    na.spent,
    na.cpa,
    na.ctr,
    na.cvr,
    na.cpc,
    kmeans.good AS prediction1,
    logreg.good AS prediction2
   FROM ((ml_logistic_regression_results logreg
     RIGHT JOIN ( SELECT ui_usual_placements_grid_data_all.campaign_id,
            ui_usual_placements_grid_data_all.placement_id,
            sum(ui_usual_placements_grid_data_all.imps) AS impressions,
            sum(ui_usual_placements_grid_data_all.clicks) AS clicks,
            sum(ui_usual_placements_grid_data_all.spent) AS spent,
            CASE sum(ui_usual_placements_grid_data_all.conversions)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all.spent))::double precision / (sum(ui_usual_placements_grid_data_all.conversions))::double precision)
            END AS cpa,
            CASE sum(ui_usual_placements_grid_data_all.imps)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all.clicks))::double precision / (sum(ui_usual_placements_grid_data_all.imps))::double precision)
            END AS ctr,
            CASE sum(ui_usual_placements_grid_data_all.imps)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all.conversions))::double precision / (sum(ui_usual_placements_grid_data_all.imps))::double precision)
            END AS cvr,
            CASE sum(ui_usual_placements_grid_data_all.clicks)
                WHEN 0 THEN (0)::double precision
                ELSE ((sum(ui_usual_placements_grid_data_all.spent))::double precision / (sum(ui_usual_placements_grid_data_all.clicks))::double precision)
            END AS cpc
           FROM ui_usual_placements_grid_data_all
          GROUP BY ui_usual_placements_grid_data_all.campaign_id, ui_usual_placements_grid_data_all.placement_id) na ON ((logreg.placement_id = na.placement_id)))
     LEFT JOIN ( SELECT ml_placements_clusters_kmeans.placement_id,
            ml_placements_clusters_kmeans.good
           FROM ml_placements_clusters_kmeans
          WHERE ((ml_placements_clusters_kmeans.day = 7) AND (ml_placements_clusters_kmeans.test_number = 2))) kmeans ON ((na.placement_id = kmeans.placement_id)));
        """),
        migrations.RunSQL("""
            DROP MATERIALIZED VIEW view_rules_campaign_placements;
        """)
    ]
