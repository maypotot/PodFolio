from django.urls import path
from . import views

urlpatterns = [
    # Student Account endpoints
    path("students/signup/", views.create_student_account, name="create_student_account"),
    path("students/", views.get_student_by_webid, name="get_student_by_webid"),
    path("students/bio/", views.update_student_bio, name="update_student_bio"),
    
    # Employer Account endpoints
    path("employers/signup/", views.create_employer_account, name="create_employer_account"),
    path("employers/", views.get_employer_by_webid, name="get_employer_by_webid"),
    
    # Job Posting endpoints
    path("jobs/", views.list_job_postings, name="list_job_postings"),
    path("employer/jobs/", views.employer_jobs),
    path("employer/jobs/create/", views.create_job),
    path("employer/jobs/<int:job_id>/", views.update_job),
    path("employer/applicants/<int:job_id>/", views.job_applicants),
    path("jobs/<int:job_id>/applicants/", views.job_applicants, name="job_applicants"),
    
    # Request endpoints
    path("requests/", views.create_request, name="create_request"),
    path("requests/", views.requests_by_student, name="requests_by_student"),
    path('requests/all/', views.all_requests, name='all_requests'),
]