from django.contrib import admin
from .models import DataSource, UploadBatch, RawRecord

admin.site.register(DataSource)
admin.site.register(UploadBatch)
admin.site.register(RawRecord)