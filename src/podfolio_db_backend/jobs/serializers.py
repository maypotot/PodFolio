from rest_framework import serializers
from .models import JobPosting, JobApplication, EmployerRequest, StudentAccount, EmployerAccount, SkillInterestTag, JobPostingTag, StudentSkillInterest, Resume, ResourcePermission

class StudentAccountSerializer(serializers.ModelSerializer):
    # Include student's tags in the response
    tags = serializers.SerializerMethodField()

    class Meta:
        model = StudentAccount
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def get_tags(self, obj):
        student_tags = StudentSkillInterest.objects.filter(student_webid=obj.webid).select_related('tag')
        return [{'id': st.tag.id, 'tag_name': st.tag.tag_name} for st in student_tags]

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class ResourcePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourcePermission
        fields = ['id', 'employer_webid', 'student_webid', 'resource_url', 'resume_id', 'granted_at']
        read_only_fields = ['id', 'granted_at']

class EmployerAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerAccount
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class SkillInterestTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillInterestTag
        fields = ['id', 'tag_name']

class JobPostingSerializer(serializers.ModelSerializer):
    # Read-only: returns tags as list of {id, tag_name} when fetching
    tags = serializers.SerializerMethodField()

    class Meta:
        model = JobPosting
        fields = '__all__'

    def get_tags(self, obj):
        job_tags = JobPostingTag.objects.filter(job=obj).select_related('tag')
        return [{'id': jt.tag.id, 'tag_name': jt.tag.tag_name} for jt in job_tags]

class JobApplicationSerializer(serializers.ModelSerializer):
    resume_id = serializers.SerializerMethodField()
    
    class Meta:  # ← Make sure this is properly indented
        model = JobApplication
        fields = ['id', 'job', 'applicant_webid', 'resume_pod_url', 'resume_id', 'submitted_at']
        read_only_fields = ['submitted_at']
    
    def get_resume_id(self, obj):
        """Return the resume ID if resume foreign key is set"""
        return obj.resume.id if obj.resume else None
    
    def create(self, validated_data):
        """Handle resume_id when creating application"""
        # Get resume_id from the request data
        resume_id = self.initial_data.get('resume_id')
        
        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id)
                validated_data['resume'] = resume
            except Resume.DoesNotExist:
                pass  # Continue without setting resume if not found
        
        return super().create(validated_data)

class EmployerRequestSerializer(serializers.ModelSerializer):
    job_application_id = serializers.IntegerField(write_only=True, required=False)
    job_application = JobApplicationSerializer(read_only=True)  # Include full job application in response

    class Meta:
        model = EmployerRequest
        fields = ['id', 'employer_webid', 'applicant_webid', 'summary', 'job_application_id', 'job_application', 'created_at']
        read_only_fields = ['id', 'created_at', 'job_application']

    def create(self, validated_data):
        job_application_id = validated_data.pop('job_application_id', None)
        if job_application_id:
            try:
                job_application = JobApplication.objects.get(id=job_application_id)
            except JobApplication.DoesNotExist:
                raise serializers.ValidationError({"job_application_id": "Job application not found"})
            return EmployerRequest.objects.create(job_application=job_application, **validated_data)
        else:
            raise serializers.ValidationError({"job_application_id": "Job application ID is required"})