from rest_framework.views import APIView
from rest_framework.response import Response

from normalization.models import NormalizedRecord


class DashboardStatsView(APIView):

    def get(self, request):

        total_records = NormalizedRecord.objects.count()

        approved_records = NormalizedRecord.objects.filter(
            review_status="APPROVED"
        ).count()

        rejected_records = NormalizedRecord.objects.filter(
            review_status="REJECTED"
        ).count()

        locked_records = NormalizedRecord.objects.filter(
            review_status="LOCKED"
        ).count()

        pending_records = NormalizedRecord.objects.filter(
            review_status="PENDING"
        ).count()

        suspicious_records = NormalizedRecord.objects.filter(
            suspicious_flag=True
        ).count()

        data = {
            "total_records": total_records,
            "approved_records": approved_records,
            "rejected_records": rejected_records,
            "locked_records": locked_records,
            "pending_records": pending_records,
            "suspicious_records": suspicious_records,
        }

        return Response(data)