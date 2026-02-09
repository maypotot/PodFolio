from rest_framework import serializers
from .models import JobPosting, JobApplication, EmployerRequest

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'

class EmployerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerRequest
        fields = '__all__'