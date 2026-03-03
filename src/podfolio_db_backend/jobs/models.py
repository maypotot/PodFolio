from django.db import models

class StudentAccount(models.Model):
    first_name = models.TextField()
    last_name = models.TextField()
    email = models.EmailField(unique=True)
    webid = models.TextField(unique=True)
    bio = models.TextField(blank=True, null=True, default="Add Bio")
    profile_picture = models.TextField(blank=True, null=True)  # Base64-encoded image
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class Resume(models.Model):
    """
    Stores resume information for students. Each student can have multiple resumes.
    """
    student_webid = models.TextField()  # Links to StudentAccount
    title = models.TextField()  # Resume title (e.g., "Software Engineer Resume")
    pod_url = models.TextField()  # Placeholder URL to Solid Pod resume resource
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} - {self.student_webid}"

class EmployerAccount(models.Model):
    company_name = models.TextField()
    contact_person = models.TextField()
    email = models.EmailField(unique=True)
    webid = models.TextField(unique=True)
    company_description = models.TextField(blank=True, null=True, default="Add company description")
    profile_picture = models.TextField(blank=True, null=True)  # Base64-encoded image
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} - {self.contact_person} ({self.email})"

class SkillInterestTag(models.Model):
    """
    Global vocabulary of skills and interests used across the platform.
    Shared by jobs, students, portfolios, and endorsements.
    """
    tag_name = models.TextField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['tag_name']

    def __str__(self):
        return self.tag_name

class JobPosting(models.Model):
    employer_webid = models.TextField()
    title = models.TextField()
    description = models.TextField()
    location = models.TextField()
    employment_type = models.TextField()
    proposed_salary = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    company = models.TextField(default="Unknown Company")
    company_logo = models.TextField(blank=True, null=True)  # Base64-encoded image

    def __str__(self):
        return self.title

class JobPostingTag(models.Model):
    """
    Connects job postings to required or relevant skills.
    Many-to-many relationship between jobs and tags.
    """
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='tags')
    tag = models.ForeignKey(SkillInterestTag, on_delete=models.CASCADE, related_name='job_postings')

    class Meta:
        unique_together = ('job', 'tag')
        ordering = ['tag__tag_name']

    def __str__(self):
        return f"{self.job.title} - {self.tag.tag_name}"
    
class StudentSkillInterest(models.Model):
    """
    Connects students to their skills and interests.
    Shares the same SkillInterestTag vocabulary used by job postings.
    """
    student_webid = models.TextField()
    tag = models.ForeignKey(SkillInterestTag, on_delete=models.CASCADE, related_name='student_skills')

    class Meta:
        unique_together = ('student_webid', 'tag')
        ordering = ['tag__tag_name']

    def __str__(self):
        return f"{self.student_webid} - {self.tag.tag_name}"

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

class ResourcePermission(models.Model):
    """Track permissions granted by students to employers for specific resources"""
    employer_webid = models.TextField()
    student_webid = models.TextField()
    resource_url = models.TextField()  # The Solid Pod resource URL
    resume_id = models.IntegerField(blank=True, null=True)  # Link to which resume this permission is for
    granted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('employer_webid', 'student_webid', 'resource_url')
        ordering = ['-granted_at']

    def __str__(self):
        return f"Permission: {self.student_webid} → {self.employer_webid} for {self.resource_url}"