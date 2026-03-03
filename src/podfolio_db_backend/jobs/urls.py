from django.urls import path
from . import views

urlpatterns = [
    # Student Account endpoints
    path("students/signup/", views.create_student_account, name="create_student_account"),
    path("students/bio/", views.update_student_bio, name="update_student_bio"),
    path("students/picture/", views.update_student_picture, name="update_student_picture"),
    path("students/name/", views.update_student_name, name="update_student_name"),
    path("students/email/", views.update_student_email, name="update_student_email"),
    path("students/tags/", views.update_student_tags, name="update_student_tags"),
    path("students/tags/get/", views.get_student_tags, name="get_student_tags"),
    path("students/search/", views.search_students_by_tag, name="search_students_by_tag"),  # GET ?q=
    path("students/", views.get_student_by_webid, name="get_student_by_webid"),

    # Resume endpoints
    path("resumes/", views.list_student_resumes, name="list_student_resumes"),  # GET ?webid=
    path("resumes/create/", views.create_resume, name="create_resume"),  # POST ?webid= body:{title}
    path("resumes/<int:resume_id>/", views.update_resume, name="update_resume"),  # PATCH
    path("resumes/<int:resume_id>/delete/", views.delete_resume, name="delete_resume"),  # DELETE

    # Employer Account endpoints
    path("employers/signup/", views.create_employer_account, name="create_employer_account"),
    path("employers/name/", views.update_employer_name, name="update_employer_name"),
    path("employers/contact/", views.update_employer_contact_person, name="update_employer_contact_person"),
    path("employers/email/", views.update_employer_email, name="update_employer_email"),
    path("employers/description/", views.update_employer_description, name="update_employer_description"),
    path("employers/picture/", views.update_employer_picture, name="update_employer_picture"),
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
    path("jobs/apply/", views.apply_to_job, name="apply_to_job"),  # POST - create job application
    path("employer/applications/", views.employer_applications, name="employer_applications"),  # GET ?employer_webid=
    path("employer/applicants/<int:job_id>/", views.job_applicants),
    path("jobs/<int:job_id>/applicants/", views.job_applicants, name="job_applicants"),

    # Request endpoints
    path("requests/create/", views.create_request, name="create_request"),
    path("requests/student/", views.requests_by_student, name="requests_by_student"),
    path("requests/all/", views.all_requests, name="all_requests"),

    # Resource permissions endpoints
    path("permissions/grant/", views.grant_permission, name="grant_permission"),
    path("permissions/revoke/", views.revoke_permission, name="revoke_permission"),
    path("permissions/list/", views.list_permissions, name="list_permissions"),
]

