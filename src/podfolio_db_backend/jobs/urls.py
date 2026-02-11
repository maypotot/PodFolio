from django.urls import path
from . import views

urlpatterns = [
    path("jobs/", views.list_job_postings, name="list_job_postings"),
    path("employer/jobs/", views.employer_jobs),
    path("employer/jobs/create/", views.create_job),
    path("employer/jobs/<int:job_id>/", views.update_job),
    path("employer/applicants/<int:job_id>/", views.job_applicants),
    path("jobs/<int:job_id>/applicants/", views.job_applicants, name="job_applicants"),
    path("requests/", views.create_request, name="create_request"),
    path("requests/", views.requests_by_student, name="requests_by_student"),  # Changed from "api/requests/"
    path('requests/all/', views.all_requests, name='all_requests'),  # Changed from 'api/requests/all/'
]