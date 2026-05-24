from rest_framework import serializers

from .models import UploadBatch


class UploadBatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = UploadBatch
        fields = "__all__"