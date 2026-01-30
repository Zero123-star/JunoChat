from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_character_favorited_by"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="profile_picture_data",
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="customuser",
            name="profile_picture_mime",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="character",
            name="avatar_data",
            field=models.BinaryField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="character",
            name="avatar_mime",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
