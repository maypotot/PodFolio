import { bootSolidModels, SolidEngine } from 'soukai-solid';
import { setEngine } from 'soukai';
import { getPodUrlAll, getSolidDataset, getFile } from "@inrupt/solid-client";


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
    performSkillCreation
    
} from './solid';


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
    
    const user = await restoreSession();

    const podInformation = await loadInformation();
    alert(podInformation.length)
    // if (!FullName || !ProfessionalTitle || !Summary || !Email || !ContactNumber || !Location || !School || !Degree || !Program || !StartDate || !EndDate) {
    //     alert('Please fill in all fields');
    //     return;
    // }

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
        ThesisTitle
    });
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

    const experience = await performExperienceCreation({
        PositionTitle,
        Organization,
        Duration,
        Description,
        ExperienceLocation
    });
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

    const project = await performProjectCreation({
        ProjectName,
        Summary,
        Tools,
        ProjectLink
    });
    alert("Project has been created")
}

export async function createAward() {
    const AwardTitle = document.getElementById('AwardTitle').value;
    const Date = document.getElementById('AwardDate').value;
    const Organization = document.getElementById('AwardOrganization').value;

    if (!AwardTitle || !Date || !Organization) {
        alert('Please fill in all fields');
        return;
    }
    
    const award = await performAwardCreation({
        AwardTitle,
        Date,
        Organization
    });

}

async function createTraining() {
    const TrainingTitle = document.getElementById('TrainingTitle').value;
    const Organization = document.getElementById('TrainingOrganization').value;
    const YearEarned = document.getElementById('YearEarned').value;
    const YearExpire = document.getElementById('YearExpire').value;

    if (!TrainingTitle || !Organization || !YearEarned) {
        alert('Please fill in all fields');
        return;
    }

    const training = await performTrainingCreation({
        TrainingTitle,
        Organization,
        YearEarned,
        YearExpire
    });

}

async function createReference() {
    const Name = document.getElementById('ReferenceName').value;
    const Position = document.getElementById('ReferencePosition').value;
    const Email = document.getElementById('ReferenceEmail').value;
    const ContactNumber = document.getElementById('ReferenceContactNumber').value;

    if (!Name || !Position || !Email || !ContactNumber) {
        alert('Please fill in all fields');
        return;
    }

    const reference = await performReferenceCreation({
        Name,
        Position,
        Email,
        ContactNumber
    });

}

async function createImage() {
    const fileInput = document.getElementById('ImageFile');
    const File = fileInput.files[0];

    if (!File) {
        alert('Please fill in all fields');
        return;
    }
    const items = await performImageCreation(File);
}

export async function createWebsite() {
    const WebsiteLink = document.getElementById('WebsiteLink').value;

    if (!WebsiteLink) {
        alert('Please fill in all fields');
        return;
    }
    const items = await performWebsiteCreation({WebsiteLink});
    alert("Website has been created")   
}

export async function createSkill() {
    const Skill = document.getElementById('Skill').value;

    if (!Skill) {
        alert('Please fill in all fields');
        return;
    }
    const items = await performSkillCreation({Skill});
    alert("Skill has been created")   
}

export function appendInformation(info) {
    const infoItem = document.createElement('li');

    infoItem.innerHTML = `
        <h3>Personal Information</h3>

        <button
            type="button"
            onclick="deleteInformation('${info.url}', this.parentElement, this)"
        >
            Delete
        </button>
        <br /> <br />

        <span>${info.FullName}</span><br /> <br />
        <button
            type="button"
            onclick="updateInformation('${info.url}')"
        >
            Update
        </button>

        <h4>Professional Title</h4>
        <span>${info.ProfessionalTitle}</span>

        <h4>Summary</h4>
        <span>${info.Summary}</span>

        <h4>Contact Details</h4>
        <span>${info.Email}</span>
        <span>${info.ContactNumber}</span>
        <span>${info.Location}</span>
        <span>${info.WebsiteLink}</span>

        <h4>Professional Summary</h4>
        <span>${info.ProfessionalSummary}</span>


        <h4>Education</h4>
        <span>${info.School}</span>
        <span>${info.Degree}</span>
        <span>${info.Program}</span>
        <span>${info.StartDate}</span>
        <span>${info.EndDate}</span>
        <span>${info.RelevantCoursework}</span>
        <span>${info.Honors}</span>
        <span>${info.ThesisTitle}</span>
    `;

    document.getElementById('information').appendChild(infoItem);
}

export function appendExperience(experience) {
    const experienceItem = document.createElement('li');

    experienceItem.innerHTML = `
        <h3>Experience</h3>

        <button
            type="button"
            onclick="deleteExperience('${experience.url}', this.parentElement, this)"
        >
            Delete
        </button>
        <br /> <br />

        <button
            type="button"
            onclick="updateExperience('${experience.url}', this.parentElement, this)"
        >
            Update
        </button>
        <br /> <br />

        <span>${experience.PositionTitle}</span><br /> <br />

        <h4>Organization</h4>
        <span>${experience.Organization}</span>

        <h4>Duration</h4>
        <span>${experience.Duration}</span>

        <h4>Description</h4>
        <span>${experience.Description}</span>
    `;

    document.getElementById('experience').appendChild(experienceItem);
}

export function appendProject(project) {
    const projectItem = document.createElement('li');

    projectItem.innerHTML = `
        <h3>Project</h3>

        <button
            type="button"
            onclick="deleteProject('${project.url}', this.parentElement, this)"
        >
            Delete
        </button>
        <br /> <br />

        <button
            type="button"
            onclick="updateProject('${project.url}', this.parentElement, this)"
        >
            Update
        </button>
        <br /> <br />

        <span>${project.ProjectName}</span><br /> <br />

        <h4>Summary</h4>
        <span>${project.Summary}</span>

        <h4>Tools</h4>
        <span>${project.Tools}</span>

        <h4>Link</h4>
        <span>${project.ProjectLink}</span>
    `;

    document.getElementById('projects').appendChild(projectItem);
}

export function appendAward(award) {
    const awardItem  = document.createElement('li');

    awardItem.innerHTML = `
        <h3>Award</h3>

        <button
            type="button"
            onclick="deleteAward('${award.url}', this.parentElement, this)"
        >
            Delete
        </button>
        <br /> <br />

        <button
            type="button"
            onclick="updateAward('${award.url}', this.parentElement, this)"
        >
            Update
        </button>
        <br /> <br />

        <h4>Award Title</h4>
        <span>${award.AwardTitle}</span><br /> <br />

        <h4>Date</h4>
        <span>${award.Date}</span>

        <h4>Organization</h4>
        <span>${award.Organization}</span>
    `;

    document.getElementById('awards').appendChild(awardItem);
}

export function appendTraining(training) {
    const trainingItem = document.createElement('li');

    trainingItem.innerHTML = `
        <h3>Training</h3>

        <button
            type="button"
            onclick="deleteTraining('${training.url}', this.parentElement, this)"
        >
            Delete
        </button>
        <br /> <br />

        <button
            type="button"
            onclick="updateTraining('${training.url}', this.parentElement, this)"
        >
            Update
        </button>
        <br /> <br />

        <span>${training.TrainingTitle}</span><br /> <br />

        <h4>Organization</h4>
        <span>${training.Organization}</span>

        <h4>Year Earned</h4>
        <span>${training.YearEarned}</span>

        <h4>Year Expire</h4>
        <span>${training.YearExpire}</span>

    `;

    document.getElementById('trainings').appendChild(trainingItem);
}

export function appendReference(reference) {
    const referenceItem = document.createElement('li');

    referenceItem.innerHTML = `
        <h3>Reference</h3>

        <button
            type="button"
            onclick="deleteReference('${reference.url}', this.parentElement, this)"
        >
            Delete
        </button>
        <br /> <br />

        <button
            type="button"
            onclick="updateReference('${reference.url}', this.parentElement, this)"
        >
            Update
        </button>
        <br /> <br />

        <span>${reference.Name}</span><br /> <br />

        <h4>Position</h4>
        <span>${reference.Position}</span>

        <h4>Organization</h4>
        <span>${reference.Email}</span>

        <h4>Email</h4>
        <span>${reference.ContactNumber}</span>

    `;

    document.getElementById('references').appendChild(referenceItem);
}

export async function appendImage(itemList) {
    itemList.shift();

    let num = 0;
    itemList.forEach((item) => {
        
        console.log(item);
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
        console.log(num)
    });



    

    



    
}


function updateInformation(infoUrl) {
    const FullName = document.getElementById('FullName').value;
    const ProfessionalTitle = document.getElementById('ProfessionalTitle').value;
    const Summary = document.getElementById('Summary').value;
    const Email = document.getElementById('Email').value;
    const ContactNumber = document.getElementById('ContactNumber').value;
    const Location = document.getElementById('Location').value;
    const WebsiteLink = document.getElementById('WebsiteLink').value;
    const ProfessionalSummary = document.getElementById('ProfessionalSummary').value;
    const School = document.getElementById('School').value;
    const Degree = document.getElementById('Degree').value;
    const Program = document.getElementById('Program').value;
    const StartDate = document.getElementById('StartDate').value;
    const EndDate = document.getElementById('EndDate').value;
    const RelevantCoursework = document.getElementById('RelevantCoursework').value;
    const Honors = document.getElementById('Honors').value;
    const ThesisTitle = document.getElementById('ThesisTitle').value;

    if (!FullName || !ProfessionalTitle || !Summary || !Email || !ContactNumber || !Location || !WebsiteLink || !School || !Degree || !Program || !StartDate || !EndDate) {
        alert('Please fill in all fields');
        return;
    }
    performUpdateInformation(infoUrl, {
        FullName: FullName,
        ProfessionalTitle: ProfessionalTitle,
        Summary: Summary,
        Email: Email,
        ContactNumber: ContactNumber,
        Location: Location,
        WebsiteLink: WebsiteLink,
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
    alert("Information has been updated. Please Refresh")
}

function updateExperience(experienceUrl) {
    const PositionTitle = document.getElementById('PositionTitle').value;
    const Organization = document.getElementById('Organization').value;
    const Duration = document.getElementById('Duration').value;
    const Description = document.getElementById('Description').value;

    performUpdateExperience(experienceUrl, {
        PositionTitle: PositionTitle,
        Organization: Organization,
        Duration: Duration,
        Description: Description
    });
    alert("Experience has been updated. Please refresh to see changes.")
}

function updateProject(projectUrl) {
    const ProjectName = document.getElementById('ProjectName').value;
    const ProjectSummary = document.getElementById('ProjectSummary').value;
    const Tools = document.getElementById('Tools').value;
    const ProjectLink = document.getElementById('ProjectLink').value;

    performUpdateProject(projectUrl, {
        ProjectName: ProjectName,
        ProjectSummary: ProjectSummary,
        Tools: Tools,
        ProjectLink: ProjectLink
    });
    alert("Project has been updated. Please refresh to see changes.")
}

function updateAward(awardUrl) {
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

function updateTraining(trainingUrl) {
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
    alert("Training has been updated. Please refresh to see changes.")
}

function updateReference(referenceUrl) {
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
    alert("Reference has been updated. Please refresh to see changes.")
}


function updateImage(imageUrl) {
    const ImageLink = document.getElementById('ImageLink').value;
    performUpdateImage(imageUrl, {
        Link: ImageLink,
    });
    alert("Image has been updated. Please refresh to see changes.")
}

function deleteInformation(infoUrl) {
    performInformationDeletion(infoUrl);
}

function deleteExperience(experienceUrl) {
    performExperienceDeletion(experienceUrl);
}

function deleteProject(projectUrl) {
    performProjectDeletion(projectUrl);
}

function deleteAward(awardUrl) {
    performAwardDeletion(awardUrl);
}

function deleteTraining(trainingUrl) {
    performTrainingDeletion(trainingUrl);
}

function deleteReference(referenceUrl) {
    performReferenceDeletion(referenceUrl);
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