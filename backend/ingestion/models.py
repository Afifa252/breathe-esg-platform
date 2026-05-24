from django.db import models
import uuid

from companies.models import Company


class DataSource(models.Model):

    SOURCE_TYPES = [
        ("SAP", "SAP"),
        ("UTILITY", "Utility"),
        ("TRAVEL", "Travel"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="data_sources"
    )

    source_type = models.CharField(
        max_length=50,
        choices=SOURCE_TYPES
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company.name} - {self.source_type}"


class UploadBatch(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PROCESSING", "Processing"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="upload_batches"
    )

    data_source = models.ForeignKey(
        DataSource,
        on_delete=models.CASCADE,
        related_name="upload_batches"
    )

    file_name = models.CharField(max_length=255)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    def __str__(self):
        return self.file_name


class RawRecord(models.Model):

    STATUS_CHOICES = [
        ("VALID", "Valid"),
        ("INVALID", "Invalid"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    upload_batch = models.ForeignKey(
        UploadBatch,
        on_delete=models.CASCADE,
        related_name="raw_records"
    )

    raw_data = models.JSONField()

    validation_errors = models.JSONField(
        default=list,
        blank=True
    )

    processing_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="VALID"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RawRecord {self.id}"