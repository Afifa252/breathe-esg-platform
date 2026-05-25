import pandas as pd
from datetime import date

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from companies.models import Company
from ingestion.models import (
    DataSource,
    UploadBatch,
    RawRecord
)
from normalization.models import NormalizedRecord


class SAPUploadView(APIView):

    def post(self, request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No CSV uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            df = pd.read_csv(file)

            # DEMO COMPANY
            company, _ = Company.objects.get_or_create(
                name="Demo Company"
            )

            # DATA SOURCE
            data_source, _ = DataSource.objects.get_or_create(
                company=company,
                source_type="SAP"
            )

            # UPLOAD BATCH
            upload_batch = UploadBatch.objects.create(
                company=company,
                data_source=data_source,
                file_name=file.name,
                status="COMPLETED"
            )

            for _, row in df.iterrows():

                quantity = float(row["quantity"])

                suspicious = quantity > 10000

                # RAW RECORD
                raw_record = RawRecord.objects.create(
                    upload_batch=upload_batch,
                    raw_data=row.to_dict(),
                    validation_errors=[],
                    processing_status="VALID"
                )

                # NORMALIZED RECORD
                NormalizedRecord.objects.create(
                    company=company,
                    raw_record=raw_record,
                    activity_type=row["activity_type"],
                    scope_category="SCOPE_1",
                    quantity=quantity,
                    normalized_unit="kgCO2e",
                    occurred_on=date.today(),
                    suspicious_flag=suspicious,
                    review_status="PENDING"
                )

            return Response(
                {"message": "Upload successful"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:

            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )