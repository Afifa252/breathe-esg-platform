from django.urls import path

from .views import (
    DashboardStatsView,
    RecordListView,
    UpdateRecordStatusView,
)

urlpatterns = [

    path(
        "stats/",
        DashboardStatsView.as_view(),
        name="dashboard-stats"
    ),

    path(
        "records/",
        RecordListView.as_view(),
        name="record-list"
    ),

    path(
        "records/<uuid:pk>/",
        UpdateRecordStatusView.as_view(),
        name="update-record-status"
    ),
]