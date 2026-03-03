from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import JobPosting, JobApplication, EmployerRequest, StudentAccount, EmployerAccount, SkillInterestTag, JobPostingTag, StudentSkillInterest, Resume, ResourcePermission
from .serializers import JobPostingSerializer, JobApplicationSerializer, EmployerRequestSerializer, StudentAccountSerializer, EmployerAccountSerializer, SkillInterestTagSerializer, ResumeSerializer, ResourcePermissionSerializer
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

@api_view(['PATCH'])
def update_student_picture(request):
    """
    Update student profile picture.
    Expects { "profile_picture": "data:image/jpeg;base64,..." }
    """
    try:
        webid = request.query_params.get('webid')
        profile_picture = request.data.get('profile_picture')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if not profile_picture:
            return Response({"error": "profile_picture field is required"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        students = StudentAccount.objects.filter(webid__startswith=webid)
        if not students.exists():
            return Response({"error": "Student account not found"}, status=404)
        
        student = students.first()
        student.profile_picture = profile_picture
        student.save()
        
        return Response(StudentAccountSerializer(student).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_student_name(request):
    """
    Update student name.
    Expects { "first_name": "...", "last_name": "..." }
    """
    try:
        webid = request.query_params.get('webid')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if not first_name or not last_name:
            return Response({"error": "first_name and last_name are required"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        students = StudentAccount.objects.filter(webid__startswith=webid)
        if not students.exists():
            return Response({"error": "Student account not found"}, status=404)
        
        student = students.first()
        student.first_name = first_name.strip()
        student.last_name = last_name.strip()
        student.save()
        
        return Response(StudentAccountSerializer(student).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_student_email(request):
    """
    Update student email.
    Expects { "email": "..." }
    """
    try:
        webid = request.query_params.get('webid')
        email = request.data.get('email')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if not email:
            return Response({"error": "email is required"}, status=400)
        
        email = email.strip().lower()
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return Response({"error": "Invalid email format"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        students = StudentAccount.objects.filter(webid__startswith=webid)
        if not students.exists():
            return Response({"error": "Student account not found"}, status=404)
        
        student = students.first()
        
        # Check if email is already taken by another student
        if StudentAccount.objects.filter(email=email).exclude(id=student.id).exists():
            return Response({"error": "Email already in use"}, status=400)
        
        student.email = email
        student.save()
        
        return Response(StudentAccountSerializer(student).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

# ─── Resume Views ─────────────────────────────────────────────────────────────

@api_view(['GET'])
def list_student_resumes(request):
    """Get all resumes for a student by webid"""
    try:
        webid = request.query_params.get('webid')
        if not webid:
            return Response({"error": "webid parameter is required"}, status=400)
        webid = unquote(webid).split('#')[0]
        resumes = Resume.objects.filter(student_webid=webid)
        return Response(ResumeSerializer(resumes, many=True).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def create_resume(request):
    """Create a new resume for a student"""
    try:
        webid = request.query_params.get('webid')
        title = request.data.get('title')
        
        if not webid:
            return Response({"error": "webid parameter is required"}, status=400)
        if not title:
            return Response({"error": "title is required"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        
        # Generate placeholder URL
        import uuid
        resume_id = str(uuid.uuid4())[:8]
        pod_url = f"https://placeholder.pod/resumes/{resume_id}"
        
        resume = Resume.objects.create(
            student_webid=webid,
            title=title.strip(),
            pod_url=pod_url
        )
        
        return Response(ResumeSerializer(resume).data, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_resume(request, resume_id):
    """Update resume title"""
    try:
        resume = Resume.objects.get(id=resume_id)
        title = request.data.get('title')
        
        if title:
            resume.title = title.strip()
            resume.save()
        
        return Response(ResumeSerializer(resume).data)
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['DELETE'])
def delete_resume(request, resume_id):
    """Delete a resume"""
    try:
        resume = Resume.objects.get(id=resume_id)
        resume.delete()
        return Response({"message": "Resume deleted successfully"}, status=200)
    except Resume.DoesNotExist:
        return Response({"error": "Resume not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

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

@api_view(['PATCH'])
def update_employer_name(request):
    """Update employer company name"""
    try:
        webid = request.query_params.get('webid')
        company_name = request.data.get('company_name')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if not company_name:
            return Response({"error": "company_name is required"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        employers = EmployerAccount.objects.filter(webid__startswith=webid)
        if not employers.exists():
            return Response({"error": "Employer account not found"}, status=404)
        
        employer = employers.first()
        employer.company_name = company_name.strip()
        employer.save()
        
        return Response(EmployerAccountSerializer(employer).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_employer_contact_person(request):
    """Update employer contact person"""
    try:
        webid = request.query_params.get('webid')
        contact_person = request.data.get('contact_person')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if not contact_person:
            return Response({"error": "contact_person is required"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        employers = EmployerAccount.objects.filter(webid__startswith=webid)
        if not employers.exists():
            return Response({"error": "Employer account not found"}, status=404)
        
        employer = employers.first()
        employer.contact_person = contact_person.strip()
        employer.save()
        
        return Response(EmployerAccountSerializer(employer).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_employer_email(request):
    """Update employer email"""
    try:
        webid = request.query_params.get('webid')
        email = request.data.get('email')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if not email:
            return Response({"error": "email is required"}, status=400)
        
        email = email.strip().lower()
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return Response({"error": "Invalid email format"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        employers = EmployerAccount.objects.filter(webid__startswith=webid)
        if not employers.exists():
            return Response({"error": "Employer account not found"}, status=404)
        
        employer = employers.first()
        
        # Check if email is already taken by another employer
        if EmployerAccount.objects.filter(email=email).exclude(id=employer.id).exists():
            return Response({"error": "Email already in use"}, status=400)
        
        employer.email = email
        employer.save()
        
        return Response(EmployerAccountSerializer(employer).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_employer_description(request):
    """Update employer company description"""
    try:
        webid = request.query_params.get('webid')
        company_description = request.data.get('company_description')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if company_description is None:
            return Response({"error": "company_description is required"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        employers = EmployerAccount.objects.filter(webid__startswith=webid)
        if not employers.exists():
            return Response({"error": "Employer account not found"}, status=404)
        
        employer = employers.first()
        employer.company_description = company_description
        employer.save()
        
        return Response(EmployerAccountSerializer(employer).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['PATCH'])
def update_employer_picture(request):
    """Update employer profile picture"""
    try:
        webid = request.query_params.get('webid')
        profile_picture = request.data.get('profile_picture')
        
        if not webid:
            return Response({"error": "WebID parameter is required"}, status=400)
        if not profile_picture:
            return Response({"error": "profile_picture field is required"}, status=400)
        
        webid = unquote(webid).split('#')[0]
        employers = EmployerAccount.objects.filter(webid__startswith=webid)
        if not employers.exists():
            return Response({"error": "Employer account not found"}, status=404)
        
        employer = employers.first()
        employer.profile_picture = profile_picture
        employer.save()
        
        return Response(EmployerAccountSerializer(employer).data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

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

@api_view(['GET'])
def employer_applications(request):
    """Get all applications for an employer's job postings"""
    try:
        employer_webid = request.query_params.get('employer_webid')
        if not employer_webid:
            return Response({"error": "employer_webid parameter is required"}, status=400)
        
        employer_webid = unquote(employer_webid).split('#')[0]
        
        # Get all jobs for this employer
        jobs = JobPosting.objects.filter(employer_webid=employer_webid)
        job_ids = [job.id for job in jobs]
        
        # Get all applications for these jobs
        applications = JobApplication.objects.filter(job_id__in=job_ids).order_by('-submitted_at')
        
        # Build response with student info and job title
        results = []
        for app in applications:
            # Get student data
            student = StudentAccount.objects.filter(webid__startswith=app.applicant_webid).first()
            
            result = {
                'id': app.id,
                'job_id': app.job.id,
                'job_title': app.job.title,
                'applicant_webid': app.applicant_webid,
                'resume_pod_url': app.resume_pod_url,
                'submitted_at': app.submitted_at,
                'student': {
                    'first_name': student.first_name if student else 'Unknown',
                    'last_name': student.last_name if student else 'Unknown',
                    'email': student.email if student else '',
                    'profile_picture': student.profile_picture if student else None,
                } if student else None
            }
            results.append(result)
        
        return Response(results)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

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
    
    # Use select_related to include job_application data
    reqs = EmployerRequest.objects.filter(
        applicant_webid=student_webid
    ).select_related('job_application', 'job_application__job').order_by('-created_at')
    
    return Response(EmployerRequestSerializer(reqs, many=True).data)

@api_view(['GET'])
def all_requests(request):
    reqs = EmployerRequest.objects.all()
    return Response(EmployerRequestSerializer(reqs, many=True).data)

# ─── Resource Permission Views ────────────────────────────────────────────────

@api_view(['POST'])
def grant_permission(request):
    """
    Grant permission: Create a ResourcePermission entry
    Expected body: {employer_webid, student_webid, resource_url, resume_id (optional)}
    """
    try:
        employer_webid = request.data.get('employer_webid')
        student_webid = request.data.get('student_webid')
        resource_url = request.data.get('resource_url')
        resume_id = request.data.get('resume_id')

        if not employer_webid or not student_webid or not resource_url:
            return Response({
                "error": "employer_webid, student_webid, and resource_url are required"
            }, status=400)

        # Create or get existing permission (idempotent)
        permission, created = ResourcePermission.objects.get_or_create(
            employer_webid=employer_webid,
            student_webid=student_webid,
            resource_url=resource_url,
            defaults={'resume_id': resume_id}
        )

        return Response({
            "message": "Permission granted" if created else "Permission already exists",
            "permission": ResourcePermissionSerializer(permission).data,
            "created": created
        }, status=201 if created else 200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['DELETE'])
def revoke_permission(request):
    """
    Revoke permission: Delete a ResourcePermission entry
    Expected body: {employer_webid, student_webid, resource_url}
    """
    try:
        employer_webid = request.data.get('employer_webid')
        student_webid = request.data.get('student_webid')
        resource_url = request.data.get('resource_url')

        if not employer_webid or not student_webid or not resource_url:
            return Response({
                "error": "employer_webid, student_webid, and resource_url are required"
            }, status=400)

        # Delete the permission if it exists
        deleted_count, _ = ResourcePermission.objects.filter(
            employer_webid=employer_webid,
            student_webid=student_webid,
            resource_url=resource_url
        ).delete()

        if deleted_count > 0:
            return Response({
                "message": "Permission revoked",
                "deleted_count": deleted_count
            }, status=200)
        else:
            return Response({
                "message": "No permission found to revoke"
            }, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def list_permissions(request):
    """
    List all permissions for a student-employer pair
    Query params: student_webid, employer_webid (both optional)
    """
    try:
        student_webid = request.query_params.get('student_webid')
        employer_webid = request.query_params.get('employer_webid')

        permissions = ResourcePermission.objects.all()

        if student_webid:
            permissions = permissions.filter(student_webid=student_webid)
        if employer_webid:
            permissions = permissions.filter(employer_webid=employer_webid)

        return Response(ResourcePermissionSerializer(permissions, many=True).data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def student_applications(request):
    """
    Get all applications for a student with job details
    Query param: student_webid (required)
    """
    try:
        student_webid = request.query_params.get('student_webid')
        
        if not student_webid:
            return Response({"error": "student_webid parameter is required"}, status=400)
        
        student_webid = unquote(student_webid).split('#')[0]
        
        # Get all applications for this student
        applications = JobApplication.objects.filter(
            applicant_webid=student_webid
        ).select_related('job').order_by('-submitted_at')
        
        # Build response with job details
        results = []
        for app in applications:
            result = {
                'id': app.id,
                'job_id': app.job.id,
                'job_title': app.job.title,
                'company': app.job.company,
                'company_logo': app.job.company_logo,
                'employer_webid': app.job.employer_webid,
                'location': app.job.location,
                'employment_type': app.job.employment_type,
                'applicant_webid': app.applicant_webid,
                'resume_pod_url': app.resume_pod_url,
                'submitted_at': app.submitted_at,
            }
            results.append(result)
        
        return Response(results)
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)