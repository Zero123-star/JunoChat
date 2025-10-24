from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql='ALTER TABLE django.base_character RENAME TO api_character;',
            reverse_sql='ALTER TABLE django.api_character RENAME TO base_character;',
        ),
        migrations.RunSQL(
            sql='ALTER TABLE django.base_customuser RENAME TO api_customuser;',
            reverse_sql='ALTER TABLE django.api_customuser RENAME TO base_customuser;',
        ),
        migrations.RunSQL(
            sql='ALTER TABLE django.base_chat RENAME TO api_chat;',
            reverse_sql='ALTER TABLE django.api_chat RENAME TO base_chat;',
        ),
        migrations.RunSQL(
            sql='ALTER TABLE django.base_message RENAME TO api_message;',
            reverse_sql='ALTER TABLE django.api_message RENAME TO base_message;',
        ),
        migrations.RunSQL(
            sql='ALTER TABLE django.base_follow RENAME TO api_follow;',
            reverse_sql='ALTER TABLE django.api_follow RENAME TO base_follow;',
        ),
        migrations.RunSQL(
            sql='ALTER TABLE django.base_tag RENAME TO api_tag;',
            reverse_sql='ALTER TABLE django.api_tag RENAME TO base_tag;',
        ),
    ]