from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from normalization.models import NormalizedRecord


class DashboardStatsView(APIView):

    def get(self, request):

        records = NormalizedRecord.objects.all()

        data = {
            "total": records.count(),
            "approved": records.filter(
                review_status="APPROVED"
            ).count(),

            "rejected": records.filter(
                review_status="REJECTED"
            ).count(),

            "locked": records.filter(
                review_status="LOCKED"
            ).count(),

            "suspicious": records.filter(
                suspicious_flag=True
            ).count(),
        }

        return Response(data)


class RecordListView(APIView):

    def get(self, request):

        records = NormalizedRecord.objects.all()

        data = []

        for record in records:

            data.append({

                "id": str(record.id),

                "activity_type":
                record.activity_type,

                "quantity":
                record.quantity,

                "suspicious_flag":
                record.suspicious_flag,

                "review_status":
                record.review_status,

            })

        return Response(data)
    
class UpdateRecordStatusView(APIView):

    def patch(self, request, pk):

        try:

            record = NormalizedRecord.objects.get(id=pk)

            new_status = request.data.get("status")

            if new_status not in [
                "APPROVED",
                "REJECTED",
                "LOCKED"
            ]:

                return Response(
                    {"error": "Invalid status"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            record.review_status = new_status

            record.save()

            return Response({
                "message": "Status updated"
            })

        except NormalizedRecord.DoesNotExist:

            return Response(
                {"error": "Record not found"},
                status=status.HTTP_404_NOT_FOUND
            )