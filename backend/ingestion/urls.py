from django.urls import path
from .views import SAPUploadView

urlpatterns = [
    path("", SAPUploadView.as_view(), name="csv-upload"),
]