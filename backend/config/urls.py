from django.contrib import admin
from django.urls import path

from normalization.views import (
    NormalizedRecordListView,
    ApproveRecordView,
    RejectRecordView,
    LockRecordView,
)

from dashboard.views import DashboardStatsView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # RECORDS
    path("api/records/", NormalizedRecordListView.as_view()),
    path("api/records/<uuid:record_id>/approve/", ApproveRecordView.as_view()),
    path("api/records/<uuid:record_id>/reject/", RejectRecordView.as_view()),
    path("api/records/<uuid:record_id>/lock/", LockRecordView.as_view()),

    # DASHBOARD STATS
    path("api/dashboard/stats/", DashboardStatsView.as_view()),

    # JWT
    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
]