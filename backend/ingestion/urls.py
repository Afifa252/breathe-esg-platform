from django.urls import path

from .views import SAPUploadView


urlpatterns = [
    path(
        "upload/sap/",
        SAPUploadView.as_view(),
        name="sap-upload"
    ),
    path("upload/", UploadCSVView.as_view()),

]