from venv import create
from django.db import models

class StudentAccount(models.Model):
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.EmailField(unique=True)
    webid = models.TextField(unique=True)
    bio = models.TextField(blank=True, null=True, default="Add Bio")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class EmployerAccount(models.Model):
    company_name = models.TextField()
    contact_person = models.TextField()
    email = models.EmailField(unique=True)
    webid = models.TextField(unique=True)
    company_description = models.TextField(blank=True, null=True, default="Add company description")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} - {self.contact_person} ({self.email})"

class JobPosting(models.Model):
    employer_webid = models.TextField()
    title = models.TextField()
    description = models.TextField()
    location = models.TextField()
    employment_type = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    company = models.TextField(default="Unknown Company")

    def __str__(self):
        return self.title
    
class JobApplication(models.Model):
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    applicant_webid = models.TextField()
    resume_pod_url = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'applicant_webid')

class EmployerRequest(models.Model):
    employer_webid = models.TextField()
    applicant_webid = models.TextField()
    summary = models.TextField()
    job_application = models.ForeignKey('JobApplication', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Employer Request: {self.employer_webid} -> {self.applicant_webid}"