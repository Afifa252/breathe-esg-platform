from django.db import models
import uuid

from companies.models import Company
from ingestion.models import RawRecord


class NormalizedRecord(models.Model):

    REVIEW_STATUS = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("LOCKED", "Locked"),
    ]

    SCOPE_TYPES = [
        ("SCOPE_1", "Scope 1"),
        ("SCOPE_2", "Scope 2"),
        ("SCOPE_3", "Scope 3"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="normalized_records"
    )

    raw_record = models.OneToOneField(
        RawRecord,
        on_delete=models.CASCADE,
        related_name="normalized_record"
    )

    activity_type = models.CharField(
        max_length=100
    )

    scope_category = models.CharField(
        max_length=20,
        choices=SCOPE_TYPES
    )

    quantity = models.FloatField()

    normalized_unit = models.CharField(
        max_length=50
    )

    occurred_on = models.DateField()

    suspicious_flag = models.BooleanField(
        default=False
    )

    review_status = models.CharField(
        max_length=20,
        choices=REVIEW_STATUS,
        default="PENDING"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.activity_type} - {self.quantity}"