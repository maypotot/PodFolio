from django.urls import path
from . import views

urlpatterns = [
    # Student Account endpoints
    path("students/signup/", views.create_student_account, name="create_student_account"),
    path("students/bio/", views.update_student_bio, name="update_student_bio"),
    path("students/tags/", views.update_student_tags, name="update_student_tags"),
    path("students/tags/get/", views.get_student_tags, name="get_student_tags"),
    path("students/search/", views.search_students_by_tag, name="search_students_by_tag"),  # GET ?q=
    path("students/", views.get_student_by_webid, name="get_student_by_webid"),

    # Employer Account endpoints
    path("employers/signup/", views.create_employer_account, name="create_employer_account"),
    path("employers/", views.get_employer_by_webid, name="get_employer_by_webid"),

    # Skill/Interest Tag endpoints
    path("tags/", views.list_all_tags, name="list_all_tags"),
    path("tags/get-or-create/", views.get_or_create_tags, name="get_or_create_tags"),

    # Job Posting endpoints
    # ⚠️ IMPORTANT: specific paths MUST come before parameterized paths
    path("jobs/", views.list_job_postings, name="list_job_postings"),
    path("employer/jobs/create/", views.create_job, name="create_job"),        # <-- before <job_id>
    path("employer/jobs/<int:job_id>/delete/", views.delete_job, name="delete_job"),
    path("employer/jobs/<int:job_id>/", views.update_job, name="update_job"),
    path("employer/jobs/", views.employer_jobs, name="employer_jobs"),

    # Applicant endpoints
    path("employer/applicants/<int:job_id>/", views.job_applicants),
    path("jobs/<int:job_id>/applicants/", views.job_applicants, name="job_applicants"),

    # Request endpoints
    path("requests/create/", views.create_request, name="create_request"),
    path("requests/student/", views.requests_by_student, name="requests_by_student"),
    path("requests/all/", views.all_requests, name="all_requests"),
]