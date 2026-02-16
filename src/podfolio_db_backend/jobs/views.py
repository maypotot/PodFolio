from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import JobPosting, JobApplication, EmployerRequest, StudentAccount, EmployerAccount
from .serializers import JobPostingSerializer, JobApplicationSerializer, EmployerRequestSerializer, StudentAccountSerializer, EmployerAccountSerializer
from rest_framework import status
from urllib.parse import unquote

# Student Account Views
@api_view(['POST'])
def create_student_account(request):
    """
    Create a new student account
    """
    try:
        serializer = StudentAccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_student_by_webid(request):
    """
    Get student account by WebID from query parameter
    Handles WebID with or without #fragment
    """
    try:
        webid = request.query_params.get('webid')
        if not webid:
            return Response(
                {"error": "WebID parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # URL decode the webid
        webid = unquote(webid)
        
        print(f"Searching for student WebID: {webid}")
        
        # Try exact match first
        try:
            student = StudentAccount.objects.get(webid=webid)
            serializer = StudentAccountSerializer(student)
            return Response(serializer.data)
        except StudentAccount.DoesNotExist:
            # If not found, try matching without fragment (#me part)
            webid_without_fragment = webid.split('#')[0]
            
            print(f"Trying to match base URL: {webid_without_fragment}")
            
            # Search for any WebID that starts with the base URL
            students = StudentAccount.objects.filter(webid__startswith=webid_without_fragment)
            
            if students.exists():
                student = students.first()
                serializer = StudentAccountSerializer(student)
                return Response(serializer.data)
            else:
                print(f"No student found matching: {webid_without_fragment}")
                return Response(
                    {"error": "Student account not found", "searched_webid": webid}, 
                    status=status.HTTP_404_NOT_FOUND
                )
                
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PATCH'])
def update_student_bio(request):
    """
    Update student bio by WebID
    """
    try:
        webid = request.query_params.get('webid')
        bio = request.data.get('bio')
        
        if not webid:
            return Response(
                {"error": "WebID parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if bio is None:
            return Response(
                {"error": "Bio field is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # URL decode the webid
        webid = unquote(webid)
        webid_without_fragment = webid.split('#')[0]
        
        # Find student
        students = StudentAccount.objects.filter(webid__startswith=webid_without_fragment)
        
        if not students.exists():
            return Response(
                {"error": "Student account not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        student = students.first()
        student.bio = bio
        student.save()
        
        serializer = StudentAccountSerializer(student)
        return Response(serializer.data)
        
    except Exception as e:
        print(f"Error updating bio: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Employer Account Views
@api_view(['POST'])
def create_employer_account(request):
    """
    Create a new employer account
    """
    try:
        serializer = EmployerAccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_employer_by_webid(request):
    """
    Get employer account by WebID from query parameter
    Handles WebID with or without #fragment
    """
    try:
        webid = request.query_params.get('webid')
        if not webid:
            return Response(
                {"error": "WebID parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # URL decode the webid
        webid = unquote(webid)
        
        print(f"Searching for employer WebID: {webid}")
        
        # Try exact match first
        try:
            employer = EmployerAccount.objects.get(webid=webid)
            serializer = EmployerAccountSerializer(employer)
            return Response(serializer.data)
        except EmployerAccount.DoesNotExist:
            # If not found, try matching without fragment
            webid_without_fragment = webid.split('#')[0]
            
            print(f"Trying to match base URL: {webid_without_fragment}")
            
            # Search for any WebID that starts with the base URL
            employers = EmployerAccount.objects.filter(webid__startswith=webid_without_fragment)
            
            if employers.exists():
                employer = employers.first()
                serializer = EmployerAccountSerializer(employer)
                return Response(serializer.data)
            else:
                print(f"No employer found matching: {webid_without_fragment}")
                return Response(
                    {"error": "Employer account not found", "searched_webid": webid}, 
                    status=status.HTTP_404_NOT_FOUND
                )
                
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Job Posting Views
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

# Request Views
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