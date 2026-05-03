import { bootSolidModels, SolidEngine } from 'soukai-solid';
import { setEngine } from 'soukai';
import { getPodUrlAll, getSolidDataset, getFile } from "@inrupt/solid-client";
import { performResumeCreation, loadResumes, performResumeUpdate, performResumeDeletion } from './solid';

import {
    restoreSession,
    getLoginUrl,
    performLogin,
    performLogout,
    performInformationCreation,
    loadInformation,
    performUpdateInformation,
    getAuthenticatedFetch,
    performInformationDeletion,
    performExperienceCreation,
    performExperienceDeletion,
    performUpdateExperience,
    loadExperience,
    performProjectCreation,
    performProjectDeletion,
    performUpdateProject,
    loadProject,
    performAwardCreation,
    performAwardDeletion,
    performUpdateAward,
    loadAward,
    performTrainingCreation,
    performTrainingDeletion,
    performUpdateTraining,
    loadTraining,
    performReferenceCreation,
    performReferenceDeletion,
    performUpdateReference,
    loadReference,
    performImageCreation,
    performUpdateImage,
    performImageDeletion,
    loadImage,
    performWebsiteCreation,
    performSkillCreation,
    performSkillDeletion,
    performWebsiteDeletion,
    performUpdateWebsite,
    performUpdateSkill,
    createResume,
    updateResume,
    deleteResume,
    loadAllResumes,
    loadWebsite,
    loadSkill
} from './solid';
import Website from './solid/Website';

export { createResume, updateResume, deleteResume, loadAllResumes };

async function main() {
    bootSolidModels();
    setEngine(new SolidEngine(getAuthenticatedFetch()));

    // const user = await restoreSession();

    // const information = await loadInformation();

    // for (const info of information) {
    //     appendInformation(info);
    // }

    // const experience = await loadExperience();

    // for (const exp of experience) {
    //     appendExperience(exp);
    // }


    // const projects = await loadProject();

    // for (const proj of projects) {
    //     appendProject(proj);
    // }

    // const awards = await loadAward();

    // for (const award of awards) {
    //     appendAward(award);
    // }

    // const trainings = await loadTraining();

    // for (const training of trainings) {
    //     appendTraining(training);
    // }

    // const references = await loadReference();

    // for (const reference of references) {
    //     appendReference(reference);
    // }

}

export function login() {
    const loginUrl = getLoginUrl();

    if (!loginUrl) return;

    performLogin(loginUrl);
}

export async function logout() {

    await performLogout();
    alert("You have been logged out.")
}

function getHighestResumeIndex(podInformation) {
    let maxResumeIndex = 0;

    for (let i in podInformation) {
        const infoList = podInformation[i].information || [];

        for (let j in infoList) {
            const value = Number(infoList[j].ResumeIndex);

            if (!Number.isNaN(value) && value > maxResumeIndex) {
                maxResumeIndex = value;
            }
        }
    }

    return maxResumeIndex;
}


export async function createInformation() {
    const FullName = document.getElementById('FullName').value;
    const ProfessionalTitle = document.getElementById('ProfessionalTitle').value;
    const Summary = document.getElementById('Summary').value;
    const Email = document.getElementById('Email').value;
    const ContactNumber = document.getElementById('ContactNumber').value;
    const Location = document.getElementById('Location').value;
    const ProfessionalSummary = document.getElementById('ProfessionalSummary').value;
    const School = document.getElementById('School').value;
    const Degree = document.getElementById('Degree').value;
    const Program = document.getElementById('Program').value;
    const StartDate = document.getElementById('StartDate').value;
    const EndDate = document.getElementById('EndDate').value;
    const RelevantCoursework = document.getElementById('RelevantCoursework').value;
    const Honors = document.getElementById('Honors').value;
    const ThesisTitle = document.getElementById('ThesisTitle').value;

    const uniqueInformationID = Date.now();

    const information = await performInformationCreation({
        FullName,
        ProfessionalTitle,
        Summary,
        Email,
        ContactNumber,
        Location,
        ProfessionalSummary,
        School,
        Degree,
        Program,
        StartDate,
        EndDate,
        RelevantCoursework,
        Honors,
        ThesisTitle,
        InformationIndex: uniqueInformationID
    });

    // Store in session storage
    const sessionInformation = JSON.parse(sessionStorage.getItem("session_information")) || [];
    sessionInformation.push({
        FullName,
        ProfessionalTitle,
        Summary,
        Email,
        ContactNumber,
        Location,
        ProfessionalSummary,
        School,
        Degree,
        Program,
        StartDate,
        EndDate,
        RelevantCoursework,
        Honors,
        ThesisTitle,
        InformationIndex: uniqueInformationID
    });
    sessionStorage.setItem("session_information", JSON.stringify(sessionInformation));

    alert("Information has been created")
}

export async function createExperience() {
    const PositionTitle = document.getElementById('PositionTitle').value;
    const Organization = document.getElementById('Organization').value;
    const Duration = document.getElementById('Duration').value;
    const Description = document.getElementById('Description').value;
    const ExperienceLocation = document.getElementById('ExperienceLocation').value;

    if (!PositionTitle || !Organization || !Duration || !Description || !ExperienceLocation) {
        alert('Please fill in all fields');
        return;
    }

    const uniqueExperienceID = Date.now();

    const experience = await performExperienceCreation({
        PositionTitle,
        Organization,
        Duration,
        Description,
        ExperienceLocation,
        ExperienceIndex: uniqueExperienceID
    });

    // Store in session storage
    const sessionExperiences = JSON.parse(sessionStorage.getItem("session_experiences")) || [];
    sessionExperiences.push({
        PositionTitle,
        Organization,
        Duration,
        Description,
        ExperienceLocation,
        ExperienceIndex: uniqueExperienceID
    });
    sessionStorage.setItem("session_experiences", JSON.stringify(sessionExperiences));

    alert("Experience has been created")
}

export async function createProject() {
    const ProjectName = document.getElementById('ProjectName').value;
    const Summary = document.getElementById('ProjectSummary').value;
    const Tools = document.getElementById('Tools').value;
    const ProjectLink = document.getElementById('ProjectLink').value;

    if (!ProjectName || !Summary || !Tools || !ProjectLink) {
        alert('Please fill in all fields');
        return;
    }

    const uniqueProjectID = Date.now();

    const project = await performProjectCreation({
        ProjectName,
        Summary,
        Tools,
        ProjectLink,
        ProjectIndex: uniqueProjectID
    });

    // Store in session storage
    const sessionProjects = JSON.parse(sessionStorage.getItem("session_projects")) || [];
    sessionProjects.push({
        ProjectName,
        Summary,
        Tools,
        ProjectLink,
        ProjectIndex: uniqueProjectID
    });
    sessionStorage.setItem("session_projects", JSON.stringify(sessionProjects));

    alert("Project has been created")
}

export async function createAward() {
    const AwardTitle = document.getElementById('AwardTitle').value;
    const AwardDate = document.getElementById('AwardDate').value;
    const AwardOrganization = document.getElementById('AwardOrganization').value;

    if (!AwardTitle || !AwardDate || !AwardOrganization) {
        alert('Please fill in all fields');
        return;
    }

    const uniqueAwardID = Date.now();

    const award = await performAwardCreation({
        AwardTitle,
        AwardDate,
        AwardOrganization,
        AwardIndex: uniqueAwardID
    });
    alert("Award has been created")
}

export async function createTraining() {
    const TrainingTitle = document.getElementById('TrainingTitle').value;
    const TrainingOrganization = document.getElementById('TrainingOrganization').value;
    const YearEarned = document.getElementById('YearEarned').value;
    const YearExpire = document.getElementById('YearExpire').value;

    if (!TrainingTitle || !TrainingOrganization || !YearEarned) {
        alert('Please fill in all fields');
        return;
    }

    const uniqueTrainingID = Date.now();

    const training = await performTrainingCreation({
        TrainingTitle,
        TrainingOrganization,
        YearEarned,
        YearExpire,
        TrainingIndex: uniqueTrainingID
    });
    alert("Training has been created")
}

export async function createReference() {
    const Name = document.getElementById('ReferenceName').value;
    const Position = document.getElementById('ReferencePosition').value;
    const Email = document.getElementById('ReferenceEmail').value;
    const ContactNumber = document.getElementById('ReferenceContactNumber').value;

    if (!Name || !Position || !Email || !ContactNumber) {
        alert('Please fill in all fields');
        return;
    }

    const uniqueReferenceID = Date.now();

    const reference = await performReferenceCreation({
        Name,
        Position,
        Email,
        ContactNumber,
        ReferenceIndex: uniqueReferenceID
    });
    alert("Reference has been created")
}

export async function createImage() {
    const fileInput = document.getElementById('ImageFile');
    const File = fileInput.files[0];

    if (!File) {
        alert('Please fill in all fields');
        return;
    }

    
    const user = await restoreSession();

    const podInformation = await loadInformation();

    let podInfoLength = 0;
    for (let podInfo in podInformation){
        podInfoLength = podInfoLength + podInformation[podInfo].information.length;
    }


    const items = await performImageCreation(File);
}

export async function createWebsite() {
    let podResumeID = sessionStorage.getItem("current_resume_id");
    const WebsiteLink = document.getElementById('WebsiteLink').value;

    if (!WebsiteLink) {
        alert('Please fill in all fields');
        return;
    }

    const uniqueWebsiteID = Date.now();

    const items = await performWebsiteCreation({
        WebsiteLink,
        ResumeIndex: podResumeID,
        WebsiteIndex: uniqueWebsiteID
    });

    // Store in session storage
    const sessionWebsites = JSON.parse(sessionStorage.getItem("session_websites")) || [];
    sessionWebsites.push({ WebsiteLink, WebsiteIndex: uniqueWebsiteID });
    sessionStorage.setItem("session_websites", JSON.stringify(sessionWebsites));

    alert("Website has been created")   
}

export async function createSkill() {
    let podResumeID = sessionStorage.getItem("current_resume_id");
    const Skill = document.getElementById('Skill').value;

    if (!Skill) {
        alert('Please fill in all fields');
        return;
    }

    const uniqueSkillID = Date.now();

    const items = await performSkillCreation({
        Skill,
        ResumeIndex: podResumeID,
        SkillIndex: uniqueSkillID
    });

    // Store in session storage
    const sessionSkills = JSON.parse(sessionStorage.getItem("session_skills")) || [];
    sessionSkills.push({ Skill, SkillIndex: uniqueSkillID });
    sessionStorage.setItem("session_skills", JSON.stringify(sessionSkills));

    alert("Skill has been created")   
}


export async function appendImage(itemList) {
    itemList.shift();

    let num = 0;
    itemList.forEach((item) => {
        
        const imageItem = document.createElement('li');
        imageItem.innerHTML = `
            <h3>Reference</h3>

            <button
                type="button"
                onclick="deleteImage('${item.url}', this.parentElement, this)"
            >
                Delete
            </button>
            <br /> <br />
            <img id="imageDisplay${num}" src="" alt="Uploaded Image" />

        `;
        document.getElementById('images').appendChild(imageItem);
        const imageDisplay = document.getElementById(`imageDisplay${num}`);
        imageDisplay.src = URL.createObjectURL(item);
        imageDisplay.style.display = 'block';
        num = num + 1;
    });



    

    



    
}


export async function updateInformation(infoUrl) {
    const FullName = document.getElementById('FullNameInput').value;
    const ProfessionalTitle = document.getElementById('ProfessionalTitleInput').value;
    const Summary = document.getElementById('SummaryInput').value;
    const Email = document.getElementById('EmailInput').value;
    const ContactNumber = document.getElementById('ContactNumberInput').value;
    const Location = document.getElementById('LocationInput').value;
    const ProfessionalSummary = document.getElementById('ProfessionalSummaryInput').value;
    const School = document.getElementById('SchoolInput').value;
    const Degree = document.getElementById('DegreeInput').value;
    const Program = document.getElementById('ProgramInput').value;
    const StartDate = document.getElementById('StartDateInput').value;
    const EndDate = document.getElementById('EndDateInput').value;
    const RelevantCoursework = document.getElementById('RelevantCourseworkInput').value;
    const Honors = document.getElementById('HonorsInput').value;
    const ThesisTitle = document.getElementById('ThesisTitleInput').value;

    performUpdateInformation(infoUrl, {
        FullName: FullName,
        ProfessionalTitle: ProfessionalTitle,
        Summary: Summary,
        Email: Email,
        ContactNumber: ContactNumber,
        Location: Location,
        ProfessionalSummary: ProfessionalSummary,
        School: School,
        Degree: Degree,
        Program: Program,
        StartDate: StartDate,
        EndDate: EndDate,
        RelevantCoursework: RelevantCoursework,
        Honors: Honors,
        ThesisTitle: ThesisTitle
    });
    alert("Information has been updated.")
}

export function updateExperience(experienceUrl) {
    const PositionTitle = document.getElementById('PositionTitle').value;
    const Organization = document.getElementById('Organization').value;
    const Duration = document.getElementById('Duration').value;
    const Description = document.getElementById('Description').value;
    const ExperienceLocation = document.getElementById('Location').value;

    performUpdateExperience(experienceUrl, {
        PositionTitle: PositionTitle,
        Organization: Organization,
        Duration: Duration,
        Description: Description,
        Location: ExperienceLocation
    });
    alert("Experience has been updated.")
}

export function updateProject(projectUrl) {
    const ProjectName = document.getElementById('ProjectName').value;
    const Summary = document.getElementById('ProjectSummary').value;
    const Tools = document.getElementById('Tools').value;
    const ProjectLink = document.getElementById('ProjectLink').value;

    performUpdateProject(projectUrl, {
        ProjectName: ProjectName,
        ProjectSummary: Summary,
        Tools: Tools,
        ProjectLink: ProjectLink
    });
        alert("Project has been updated. Please refresh to see changes.")
    }

export function updateAward(awardUrl) {
    const AwardTitle = document.getElementById('AwardTitle').value;
    const AwardDate = document.getElementById('AwardDate').value;
    const AwardOrganization = document.getElementById('AwardOrganization').value;

    performUpdateAward(awardUrl, {
        AwardTitle: AwardTitle,
        Date: AwardDate,
        Organization: AwardOrganization
    });
    alert("Award has been updated. Please refresh to see changes.")
}

export function updateTraining(trainingUrl) {
    const TrainingTitle = document.getElementById('TrainingTitle').value;
    const TrainingOrganization = document.getElementById('TrainingOrganization').value;
    const YearEarned = document.getElementById('YearEarned').value;
    const YearExpire = document.getElementById('YearExpire').value;

    performUpdateTraining(trainingUrl, {
        TrainingTitle: TrainingTitle,
        Organization: TrainingOrganization,
        YearEarned: YearEarned,
        YearExpire: YearExpire
    });
    alert("Training has been updated.")
}

export function updateReference(referenceUrl) {
    const ReferenceName = document.getElementById('ReferenceName').value;
    const ReferencePosition = document.getElementById('ReferencePosition').value;
    const ReferenceEmail = document.getElementById('ReferenceEmail').value;
    const ReferenceContactNumber = document.getElementById('ReferenceContactNumber').value;

    performUpdateReference(referenceUrl, {
        Name: ReferenceName,
        Position: ReferencePosition,
        Email: ReferenceEmail,
        ContactNumber: ReferenceContactNumber
    });
    alert("Reference has been updated.")
}

export function updateWebsite(websiteUrl) {
    const WebsiteLink = document.getElementById('WebsiteLink').value;

    performUpdateWebsite(websiteUrl, {
        WebsiteLink: WebsiteLink
    });
    alert("Website has been updated.")
}

export function updateSkill(skillUrl) {
    const SkillName = document.getElementById('Skill').value;

    performUpdateSkill(skillUrl, {
        Skill: SkillName
    });
    alert("Skills have been updated.")
}

export function updateImage(imageUrl) {
    const ImageLink = document.getElementById('ImageLink').value;
    performUpdateImage(imageUrl, {
        Link: ImageLink,
    });
    alert("Image has been updated.")
}

export function deleteInformation(infoUrl) {
    performInformationDeletion(infoUrl);
}

export function deleteExperience(experienceUrl) {
    performExperienceDeletion(experienceUrl);
}

export function deleteProject(projectUrl) {
    performProjectDeletion(projectUrl);
}

export function deleteAward(awardUrl) {
    performAwardDeletion(awardUrl);
}

export function deleteTraining(trainingUrl) {
    performTrainingDeletion(trainingUrl);
}

export function deleteReference(referenceUrl) {
    performReferenceDeletion(referenceUrl);
}

export function deleteWebsite(websiteUrl) {
    performWebsiteDeletion(websiteUrl);
}

export function deleteSkill(skillUrl) {
    performSkillDeletion(skillUrl);
}

function deleteImage() {
    performImageDeletion();
}

main();

window.login = login;
window.logout = logout;
window.createInformation = createInformation;
window.updateInformation = updateInformation;
window.deleteInformation = deleteInformation;
window.createExperience = createExperience;
window.updateExperience = updateExperience;
window.deleteExperience = deleteExperience;
window.createProject = createProject;
window.updateProject = updateProject;
window.deleteProject = deleteProject;
window.createAward = createAward;
window.updateAward = updateAward;
window.deleteAward = deleteAward;
window.createTraining = createTraining;
window.updateTraining = updateTraining;
window.deleteTraining = deleteTraining;
window.createReference = createReference;
window.updateReference = updateReference;
window.deleteReference = deleteReference;
window.createImage = createImage;
window.updateImage = updateImage;
window.deleteImage = deleteImage;
window.createWebsite = createWebsite;
window.updateWebsite = updateWebsite;
window.createResume = createResume;
window.updateResume = updateResume;
window.deleteResume = deleteResume;
window.loadAllResumes = loadAllResumes;

export async function completeResume() {
    console.log("Completing resume...");
    const podResumeID = sessionStorage.getItem("current_resume_id");
    const podResumeTitle = sessionStorage.getItem("current_resume_title");

    if (!podResumeTitle || podResumeTitle.trim() === "") {
        alert("Resume title is missing. Please set a title before completing the resume.");
        return;
    }

    console.log("Resume Title:", podResumeTitle);
    const consolidatedResume = {
        ResumeTitle: podResumeTitle,
        InformationIndex: podInformation.length + 1,
        WebsiteIndexes: sessionWebsites.map((website) => website.WebsiteIndex),
        ProjectIndexes: podProjects.map((project) => project.ProjectIndex),
        ExperienceIndexes: podExperiences.map((experience) => experience.ExperienceIndex),
        SkillsIndexes: sessionSkills.map((skill) => skill.SkillIndex),
    };

    await performResumeCreation(consolidatedResume);

    alert("Resume has been successfully completed and saved.");
    sessionStorage.removeItem("current_resume_id");
    sessionStorage.removeItem("current_resume_title");
    sessionStorage.removeItem("session_websites");
    sessionStorage.removeItem("session_skills");
}

export async function setResumeTitle(title) {
    sessionStorage.setItem("current_resume_title", title);
    alert(`Resume title set to: ${title}`);
}