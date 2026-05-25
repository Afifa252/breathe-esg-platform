from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

import pandas as pd

from normalization.models import NormalizedRecord


class UploadCSVView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        df = pd.read_csv(file)

        for _, row in df.iterrows():

            quantity = row.get("quantity", 0)

            suspicious = quantity > 10000

            NormalizedRecord.objects.create(
                activity_type=row.get("activity_type"),
                quantity=quantity,
                suspicious_flag=suspicious,
                review_status="PENDING"
            )

        return Response(
            {"message": "CSV uploaded successfully"}
        )