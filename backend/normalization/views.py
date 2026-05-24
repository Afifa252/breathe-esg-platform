from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from audit.models import AuditLog

from .models import NormalizedRecord
from .serializers import NormalizedRecordSerializer


class NormalizedRecordListView(APIView):

    def get(self, request):

        suspicious_only = request.GET.get("suspicious")

        records = NormalizedRecord.objects.all()

        if suspicious_only == "true":
            records = records.filter(suspicious_flag=True)

        serializer = NormalizedRecordSerializer(
            records,
            many=True
        )

        return Response(serializer.data)


class ApproveRecordView(APIView):

    def post(self, request, record_id):

        try:
            record = NormalizedRecord.objects.get(id=record_id)

        except NormalizedRecord.DoesNotExist:

            return Response(
                {"error": "Record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        old_status = record.review_status

        record.review_status = "APPROVED"

        record.save()

        AuditLog.objects.create(
            record=record,
            action="APPROVED",
            old_value={"review_status": old_status},
            new_value={"review_status": "APPROVED"},
        )

        return Response(
            {"message": "Record approved successfully"}
        )


class RejectRecordView(APIView):

    def post(self, request, record_id):

        try:
            record = NormalizedRecord.objects.get(id=record_id)

        except NormalizedRecord.DoesNotExist:

            return Response(
                {"error": "Record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        old_status = record.review_status

        record.review_status = "REJECTED"

        record.save()

        AuditLog.objects.create(
            record=record,
            action="REJECTED",
            old_value={"review_status": old_status},
            new_value={"review_status": "REJECTED"},
        )

        return Response(
            {"message": "Record rejected successfully"}
        )


class LockRecordView(APIView):

    def post(self, request, record_id):

        try:
            record = NormalizedRecord.objects.get(id=record_id)

        except NormalizedRecord.DoesNotExist:

            return Response(
                {"error": "Record not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        old_status = record.review_status

        record.review_status = "LOCKED"

        record.save()

        AuditLog.objects.create(
            record=record,
            action="LOCKED",
            old_value={"review_status": old_status},
            new_value={"review_status": "LOCKED"},
        )

        return Response(
            {"message": "Record locked successfully"}
        )