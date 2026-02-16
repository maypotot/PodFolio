from rest_framework import serializers
from .models import JobPosting, JobApplication, EmployerRequest, StudentAccount, EmployerAccount

class StudentAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAccount
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class EmployerAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerAccount
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'

class EmployerRequestSerializer(serializers.ModelSerializer):
    # Accept job_application_id as input
    job_application_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = EmployerRequest
        fields = ['id', 'employer_webid', 'applicant_webid', 'summary', 'job_application_id', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # Extract job_application_id and get the actual JobApplication object
        job_application_id = validated_data.pop('job_application_id')
        
        try:
            job_application = JobApplication.objects.get(id=job_application_id)
        except JobApplication.DoesNotExist:
            raise serializers.ValidationError({"job_application_id": "Job application not found"})
        
        # Create the EmployerRequest with the job_application object
        employer_request = EmployerRequest.objects.create(
            job_application=job_application,
            **validated_data
        )
        return employer_request