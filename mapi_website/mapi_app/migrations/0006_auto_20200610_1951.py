# Generated by Django 3.0.5 on 2020-06-10 23:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapi_app', '0005_auto_20200527_2011'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entertainment_areas',
            name='area_description',
            field=models.TextField(blank=True, default='Sin descripción', null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='event_description',
            field=models.TextField(blank=True, default='Sin descripción', null=True),
        ),
        migrations.AlterField(
            model_name='event_type',
            name='event_type_description',
            field=models.TextField(default='', null=True),
        ),
        migrations.AlterField(
            model_name='logs',
            name='description',
            field=models.TextField(blank=True, default='Sin descripción', null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='address',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='workshop',
            name='workshop_description',
            field=models.TextField(blank=True, default='Sin descripción', null=True),
        ),
        migrations.AlterField(
            model_name='workshop_type',
            name='workshop_type_description',
            field=models.TextField(default='', null=True),
        ),
    ]
