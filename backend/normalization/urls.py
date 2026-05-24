from django.urls import path

from .views import (
    NormalizedRecordListView,
    ApproveRecordView,
    RejectRecordView,
    LockRecordView,
)


urlpatterns = [

    path(
        "records/",
        NormalizedRecordListView.as_view(),
        name="record-list"
    ),

    path(
        "records/<uuid:record_id>/approve/",
        ApproveRecordView.as_view(),
        name="approve-record"
    ),

    path(
        "records/<uuid:record_id>/reject/",
        RejectRecordView.as_view(),
        name="reject-record"
    ),

    path(
        "records/<uuid:record_id>/lock/",
        LockRecordView.as_view(),
        name="lock-record"
    ),
]