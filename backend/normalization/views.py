from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from audit.models import AuditLog

from .models import NormalizedRecord
from .serializers import NormalizedRecordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


# LIST RECORDS
class NormalizedRecordListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    serializer_class = NormalizedRecordSerializer

    def get_queryset(self):

        queryset = NormalizedRecord.objects.all().order_by("created_at")

        suspicious_only = self.request.GET.get("suspicious")

        if suspicious_only == "true":
            queryset = queryset.filter(suspicious_flag=True)

        return queryset


# APPROVE RECORD
class ApproveRecordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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


# REJECT RECORD
class RejectRecordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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


# LOCK RECORD
class LockRecordView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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