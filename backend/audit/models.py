from django.db import models
import uuid

from normalization.models import NormalizedRecord


class AuditLog(models.Model):

    ACTIONS = [
        ("CREATED", "Created"),
        ("UPDATED", "Updated"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("LOCKED", "Locked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    record = models.ForeignKey(
        NormalizedRecord,
        on_delete=models.CASCADE,
        related_name="audit_logs"
    )

    action = models.CharField(
        max_length=50,
        choices=ACTIONS
    )

    old_value = models.JSONField(
        null=True,
        blank=True
    )

    new_value = models.JSONField(
        null=True,
        blank=True
    )

    performed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} - {self.record.id}"