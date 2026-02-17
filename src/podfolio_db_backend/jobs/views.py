from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import JobPosting, JobApplication, EmployerRequest, StudentAccount, EmployerAccount, SkillInterestTag, JobPostingTag, StudentSkillInterest
from .serializers import JobPostingSerializer, JobApplicationSerializer, EmployerRequestSerializer, StudentAccountSerializer, EmployerAccountSerializer, SkillInterestTagSerializer
from rest_framework import status
from urllib.parse import unquote

# ─── Student Account Views ────────────────────────────────────────────────────

@api_view(['POST'])
def create_student_account(request):
    try:
        serializer = StudentAccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_student_by_webid(request):
    try:
        webid = request.query_params.get('webid')
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        webid = unquote(webid)
        try:
            student = StudentAccount.objects.get(webid=webid)
        except StudentAccount.DoesNotExist:
            webid_base = webid.split('#')[0]
            students = StudentAccount.objects.filter(webid__startswith=webid_base)
            if not students.exists():
                return Response({"error": "Student account not found"}, status=status.HTTP_404_NOT_FOUND)
            student = students.first()
        return Response(StudentAccountSerializer(student).data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
def update_student_bio(request):
    try:
        webid = request.query_params.get('webid')
        bio = request.data.get('bio')
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        if bio is None:
            return Response({"error": "Bio field is required"}, status=status.HTTP_400_BAD_REQUEST)
        webid = unquote(webid)
        webid_base = webid.split('#')[0]
        students = StudentAccount.objects.filter(webid__startswith=webid_base)
        if not students.exists():
            return Response({"error": "Student account not found"}, status=status.HTTP_404_NOT_FOUND)
        student = students.first()
        student.bio = bio
        student.save()
        return Response(StudentAccountSerializer(student).data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ─── Employer Account Views ───────────────────────────────────────────────────

@api_view(['POST'])
def create_employer_account(request):
    try:
        serializer = EmployerAccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_employer_by_webid(request):
    try:
        webid = request.query_params.get('webid')
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        webid = unquote(webid)
        try:
            employer = EmployerAccount.objects.get(webid=webid)
        except EmployerAccount.DoesNotExist:
            webid_base = webid.split('#')[0]
            employers = EmployerAccount.objects.filter(webid__startswith=webid_base)
            if not employers.exists():
                return Response({"error": "Employer account not found"}, status=status.HTTP_404_NOT_FOUND)
            employer = employers.first()
        return Response(EmployerAccountSerializer(employer).data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ─── Tag Views ────────────────────────────────────────────────────────────────

@api_view(['GET'])
def list_all_tags(request):
    from .serializers import SkillInterestTagSerializer
    tags = SkillInterestTag.objects.all()
    return Response(SkillInterestTagSerializer(tags, many=True).data)

@api_view(['POST'])
def get_or_create_tags(request):
    try:
        tag_names = request.data.get('tag_names', [])
        result = []
        for name in tag_names:
            name = name.strip()
            if name:
                tag, _ = SkillInterestTag.objects.get_or_create(
                    tag_name__iexact=name,
                    defaults={'tag_name': name}
                )
                result.append({'id': tag.id, 'tag_name': tag.tag_name})
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ─── Helper: sync tags for a job ─────────────────────────────────────────────

def sync_job_tags(job, tag_names):
    JobPostingTag.objects.filter(job=job).delete()
    for name in tag_names:
        name = name.strip()
        if name:
            tag, _ = SkillInterestTag.objects.get_or_create(
                tag_name__iexact=name,
                defaults={'tag_name': name}
            )
            JobPostingTag.objects.get_or_create(job=job, tag=tag)

# ─── Helper: sync tags for a student ─────────────────────────────────────────

def sync_student_tags(student_webid, tag_names):
    StudentSkillInterest.objects.filter(student_webid=student_webid).delete()
    for name in tag_names:
        name = name.strip()
        if name:
            tag, _ = SkillInterestTag.objects.get_or_create(
                tag_name__iexact=name,
                defaults={'tag_name': name}
            )
            StudentSkillInterest.objects.get_or_create(student_webid=student_webid, tag=tag)

# ─── Student Skill/Interest Views ─────────────────────────────────────────────

@api_view(['GET'])
def get_student_tags(request):
    """Get all skill/interest tags for a student by webid"""
    try:
        webid = request.query_params.get('webid')
        if not webid:
            return Response({"error": "webid parameter is required"}, status=400)
        webid = unquote(webid).split('#')[0]
        student_tags = StudentSkillInterest.objects.filter(
            student_webid=webid
        ).select_related('tag')
        return Response([{'id': st.tag.id, 'tag_name': st.tag.tag_name} for st in student_tags])
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def update_student_tags(request):
    """Replace a student's tags with a new list of tag names"""
    try:
        webid = request.query_params.get('webid')
        if not webid:
            return Response({"error": "webid parameter is required"}, status=400)
        webid = unquote(webid).split('#')[0]
        tag_names = request.data.get('tags', [])
        sync_student_tags(webid, tag_names)
        # Return updated list
        student_tags = StudentSkillInterest.objects.filter(
            student_webid=webid
        ).select_related('tag')
        return Response([{'id': st.tag.id, 'tag_name': st.tag.tag_name} for st in student_tags])
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# ─── Student Search by Skill/Interest ────────────────────────────────────────

@api_view(['GET'])
def search_students_by_tag(request):
    """
    Search for students who have a given skill/interest tag.
    GET /api/students/search/?q=python
    Returns list of students with matching tag, including their full tag list.
    """
    try:
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"error": "q parameter is required"}, status=400)

        # Find all student webids that have a tag matching the query (case-insensitive)
        matching = StudentSkillInterest.objects.filter(
            tag__tag_name__icontains=query
        ).select_related('tag').values_list('student_webid', flat=True).distinct()

        # Fetch the actual StudentAccount records
        students = StudentAccount.objects.filter(webid__in=list(matching))

        # Build response: student info + their full tag list
        results = []
        for student in students:
            student_tags = StudentSkillInterest.objects.filter(
                student_webid=student.webid
            ).select_related('tag')
            results.append({
                'id': student.id,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'email': student.email,
                'webid': student.webid,
                'bio': student.bio,
                'tags': [{'id': st.tag.id, 'tag_name': st.tag.tag_name} for st in student_tags],
            })

        return Response(results)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# ─── Job Posting Views ────────────────────────────────────────────────────────

@api_view(['GET'])
def list_job_postings(request):
    jobs = JobPosting.objects.filter(is_active=True)
    return Response(JobPostingSerializer(jobs, many=True).data)

@api_view(['GET'])
def employer_jobs(request):
    employer_webid = request.query_params.get('employer_webid')
    if employer_webid:
        employer_webid = unquote(employer_webid)
        print(f"Filtering jobs for employer: {employer_webid}")
        jobs = JobPosting.objects.filter(employer_webid=employer_webid)
        print(f"Found {jobs.count()} jobs")
    else:
        jobs = JobPosting.objects.filter(is_active=True)
    return Response(JobPostingSerializer(jobs, many=True).data)

@api_view(['POST'])
def create_job(request):
    try:
        data = request.data.copy()
        tag_names = data.pop('tags', [])

        serializer = JobPostingSerializer(data=data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)

        job = serializer.save()

        if tag_names:
            sync_job_tags(job, tag_names)

        return Response(JobPostingSerializer(job).data, status=201)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_job(request, job_id):
    try:
        job = JobPosting.objects.get(id=job_id)
    except JobPosting.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)

    try:
        data = request.data.copy()
        tag_names = data.pop('tags', None)

        serializer = JobPostingSerializer(job, data=data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        job = serializer.save()

        if tag_names is not None:
            sync_job_tags(job, tag_names)

        return Response(JobPostingSerializer(job).data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)

@api_view(['DELETE'])
def delete_job(request, job_id):
    try:
        job = JobPosting.objects.get(id=job_id)
        job.delete()
        return Response({"message": "Job deleted successfully"}, status=200)
    except JobPosting.DoesNotExist:
        return Response({"error": "Job not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def job_applicants(request, job_id):
    applications = JobApplication.objects.filter(job_id=job_id)
    return Response(JobApplicationSerializer(applications, many=True).data)

@api_view(['POST'])
def apply_to_job(request):
    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# ─── Request Views ────────────────────────────────────────────────────────────

@api_view(['POST'])
def create_request(request):
    try:
        serializer = EmployerRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def requests_by_student(request):
    student_webid = request.query_params.get('student_webid')
    if not student_webid:
        return Response({"error": "Missing student_webid"}, status=400)
    reqs = EmployerRequest.objects.filter(applicant_webid=student_webid)
    return Response(EmployerRequestSerializer(reqs, many=True).data)

@api_view(['GET'])
def all_requests(request):
    reqs = EmployerRequest.objects.all()
    return Response(EmployerRequestSerializer(reqs, many=True).data)