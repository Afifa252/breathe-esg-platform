import csv
import io

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from companies.models import Company
from normalization.models import NormalizedRecord

from .models import (
    DataSource,
    UploadBatch,
    RawRecord,
)


class SAPUploadView(APIView):

    def post(self, request):

        csv_file = request.FILES.get("file")

        if not csv_file:
            return Response(
                {"error": "CSV file is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        company, _ = Company.objects.get_or_create(
            name="Demo Company"
        )

        data_source, _ = DataSource.objects.get_or_create(
            company=company,
            source_type="SAP"
        )

        upload_batch = UploadBatch.objects.create(
            company=company,
            data_source=data_source,
            file_name=csv_file.name,
            status="PROCESSING"
        )

        decoded_file = csv_file.read().decode("utf-8")

        io_string = io.StringIO(decoded_file)

        reader = csv.DictReader(io_string)

        records_created = 0

        for row in reader:

            raw_record = RawRecord.objects.create(
                upload_batch=upload_batch,
                raw_data=row,
                processing_status="VALID"
            )

            try:

                quantity = float(row.get("Quantity", 0))

                unit = row.get("Unit", "L")

                fuel_type = row.get("FuelType", "Unknown")

                occurred_on = row.get("Date")

                suspicious = quantity > 10000

                NormalizedRecord.objects.create(
                    company=company,
                    raw_record=raw_record,
                    activity_type=fuel_type,
                    scope_category="SCOPE_1",
                    quantity=quantity,
                    normalized_unit=unit,
                    occurred_on=occurred_on,
                    suspicious_flag=suspicious,
                )

                records_created += 1

            except Exception as e:

                raw_record.processing_status = "INVALID"

                raw_record.validation_errors = [str(e)]

                raw_record.save()

        upload_batch.status = "COMPLETED"

        upload_batch.save()

        return Response(
            {
                "message": "SAP CSV uploaded successfully",
                "records_created": records_created
            },
            status=status.HTTP_201_CREATED
        )