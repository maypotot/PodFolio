from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import JobPosting, JobApplication, EmployerRequest
from .serializers import JobPostingSerializer, JobApplicationSerializer, EmployerRequestSerializer
from rest_framework import status

@api_view(['GET'])
def list_job_postings(request):
    job_postings = JobPosting.objects.filter(is_active=True)
    serializer = JobPostingSerializer(job_postings, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def employer_jobs(request):
    job_postings = JobPosting.objects.filter(is_active=True)
    serializer = JobPostingSerializer(job_postings, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def create_job(request):
    serializer = JobPostingSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)

@api_view(["PATCH"])
def update_job(request, job_id):
    try:
        job = JobPosting.objects.get(id=job_id)
    except JobPosting.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    serializer = JobPostingSerializer(job, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)

@api_view(['GET'])
def job_applicants(request, job_id):
    """
    Returns all applicants for a given job posting ID
    """
    applications = JobApplication.objects.filter(job_id=job_id)
    serializer = JobApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def apply_to_job(request):
    serializer = JobApplicationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)

@api_view(['POST'])
def create_request(request):
    try:
        print("Received data:", request.data)
        
        serializer = EmployerRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("Error creating request:", str(e))
        import traceback
        traceback.print_exc()
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def requests_by_student(request):
    student_webid = request.query_params.get('student_webid')
    if not student_webid:
        return Response({"error": "Missing student_webid"}, status=400)
    requests = EmployerRequest.objects.filter(applicant_webid=student_webid)
    serializer = EmployerRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def all_requests(request):
    requests = EmployerRequest.objects.all()
    serializer = EmployerRequestSerializer(requests, many=True)
    return Response(serializer.data)
