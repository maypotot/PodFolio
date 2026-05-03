import { fetch, getDefaultSession, handleIncomingRedirect, login, logout } from '@inrupt/solid-client-authn-browser';
import { saveFileInContainer, getSourceUrl, getFile, getSolidDataset, getThingAll, removeThing, deleteFile} from "@inrupt/solid-client";

import {
  getThing,
  setThing,
  addInteger, 
  saveSolidDatasetAt,
} from "@inrupt/solid-client";

import User from './User';
import InformationList from './solid/InformationList';
import ExperienceList from './solid/ExperienceList';
import ProjectList from './solid/ProjectList';
import AwardList from './solid/AwardList';
import TrainingList from './solid/TrainingList';
import ReferenceList from './solid/ReferenceList';
import ImageList from './solid/ImageList';
import WebsiteList from './solid/WebsiteList';
import SkillList from './solid/SkillList';
import Resume from './solid/Resume';
import ResumeList from './solid/ResumeList';

let list, user;
let infoList;
let experienceList;
let projectList;
let awardList;
let trainingList;
let referenceList;
let imageList;
let websiteList;
let skillList;
let resumeList;


export async function restoreSession() {
    // This function uses Inrupt's authentication library to restore a previous session. If you were
    // already logged into the application last time that you used it, this will trigger a redirect that
    // takes you back to the application. This usually happens without user interaction, but if you hadn't
    // logged in for a while, your identity provider may ask for your credentials again.
    //
    // After a successful login, this will also read the profile from your POD.
    //
    // @see https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/authenticate-browser/

    try {
        await handleIncomingRedirect({ restorePreviousSession: true });

        const session = getDefaultSession();

        if (!session.info.isLoggedIn) return false;

        user = await fetchUserProfile(session.info.webId);

        return user;
    } catch (error) {
        alert(error.message);

        return false;
    }
}

export function getLoginUrl() {
    // Asking for a login url in Solid is kind of tricky. In a real application, you should be
    // asking for a user's webId, and reading the user's profile you would be able to obtain
    // the url of their identity provider. However, most users may not know what their webId is,
    // and they introduce the url of their issue provider directly. In order to simplify this
    // example, we just use the base domain of the url they introduced, and this should work
    // most of the time.
    const url = prompt('Introduce your Solid login url');

    if (!url) return null;

    const loginUrl = new URL(url);
    loginUrl.hash = '';
    loginUrl.pathname = '';

    return loginUrl.href;
}

export function performLogin(loginUrl) {
    login({
        oidcIssuer: loginUrl,
        redirectUrl: window.location.href,
        clientName: 'Hello World',
    });
}

export async function performLogout() {
    await logout();
}

// Creation
export async function performInformationCreation(info) {
    infoList = await InformationList.find(`${user.storageUrl}information/`);
    if (!infoList) {
        infoList = await InformationList.at(user.storageUrl).create({ url: `${user.storageUrl}information/` });
    }

    await infoList.loadRelation('information');
    const information = infoList.relatedInformation.create(info);
    return information;
}

export async function performExperienceCreation(exp) {
    experienceList = await ExperienceList.find(`${user.storageUrl}experience/`);
    if (!experienceList) {
        experienceList = await ExperienceList.at(user.storageUrl).create({ url: `${user.storageUrl}experience/` });
    }

    await experienceList.loadRelation('experience');
    const experience = experienceList.relatedExperience.create(exp);
    return experience;
}

export async function performProjectCreation(project) {
    projectList = await ProjectList.find(`${user.storageUrl}projects/`);
    if (!projectList) {
        projectList = await ProjectList.at(user.storageUrl).create({ url: `${user.storageUrl}projects/` });
    }

    await projectList.loadRelation('projects');
    const newProject = projectList.relatedProjects.create(project);
    return newProject;
}

export async function performAwardCreation(award) {
    awardList = await AwardList.find(`${user.storageUrl}awards/`);
    if (!awardList) {
        awardList = await AwardList.at(user.storageUrl).create({ url: `${user.storageUrl}awards/` });
    }

    await awardList.loadRelation('awards');
    const newAward = awardList.relatedAward.create(award);
    return newAward;
}

export async function performTrainingCreation(training) {
    trainingList = await TrainingList.find(`${user.storageUrl}training/`);
    if (!trainingList) {
        trainingList = await TrainingList.at(user.storageUrl).create({ url: `${user.storageUrl}training/` });
    }

    await trainingList.loadRelation('training');
    const newTraining = trainingList.relatedTraining.create(training);
    return newTraining;
}

export async function performReferenceCreation(reference) {
    referenceList = await ReferenceList.find(`${user.storageUrl}references/`);
    if (!referenceList) {
        referenceList = await ReferenceList.at(user.storageUrl).create({ url: `${user.storageUrl}references/` });
    }

    await referenceList.loadRelation('references');
    const newReference = referenceList.relatedReference.create(reference);
    return newReference;
}

export async function performWebsiteCreation(website) {
    websiteList = await WebsiteList.find(`${user.storageUrl}websites/`);
    if (!websiteList) {
        websiteList = await WebsiteList.at(user.storageUrl).create({ url: `${user.storageUrl}websites/` });
    }

    await websiteList.loadRelation('website');
    const newWebsite = websiteList.relatedWebsite.create(website);
    return newWebsite;
}

export async function performSkillCreation(skill) {
    skillList = await SkillList.find(`${user.storageUrl}skills/`);
    if (!skillList) {
        skillList = await SkillList.at(user.storageUrl).create({ url: `${user.storageUrl}skills/` });
    }

    await skillList.loadRelation('skill');
    const newSkill = skillList.relatedSkill.create(skill);
    return newSkill;
}

export async function performResumeCreation(resume) {
    resumeList = await ResumeList.find(`${user.storageUrl}resumes/`);
    if (!resumeList) {
        resumeList = await ResumeList.at(user.storageUrl).create({ url: `${user.storageUrl}resumes/` });
    }

    await resumeList.loadRelation('resume');
    const newResume = resumeList.relatedResume.create(resume);
    return newResume;
}

export { performResumeCreation as createResume, performUpdateResume as updateResume, performResumeDeletion as deleteResume, loadResumes as loadAllResumes };

async function uploadImage(image) {
  try {
    const savedFile = await saveFileInContainer(
      `${user.storageUrl}images/`,           // Container URL
      image,                         // File 
      { slug: image , contentType: image.type, fetch: fetch }
    );
    console.log(`File saved at ${getSourceUrl(savedFile)}`);

    return getSourceUrl(savedFile);
  } catch (error) {
    console.error(error);
  }
}

export async function performImageCreation(image) {
    if (!imageList) {
        imageList = await ImageList.at(user.storageUrl).create({ url: `${user.storageUrl}images/` });
    }
    
    
    const imageUrl = await uploadImage(image)
    alert("Image created successfully");
    
    let myImageList = await getSolidDataset(`${user.storageUrl}images/`, { fetch: fetch });
    let items = getThingAll(myImageList);
    let itemListPromises = [];

    items.forEach( (item) => {
        itemListPromises.push(getFile(item.url, { fetch: fetch }))
        // deleteFile(item.url, { fetch: fetch})
    });

    const itemList = await Promise.all(itemListPromises);

    return itemList

}

// Loading
export async function loadInformation() {
    let podInfo;
    let podInfoList = [];
    const allContainers = await InformationList.find(user.storageUrl);
    infoList = allContainers.resourceUrls.filter(c => c.includes("information"));


    if (!infoList) {
        return [];
    }
    
    for (let url in infoList){
        podInfo = await InformationList.find(infoList[url])
        podInfoList.push(podInfo)
    }
    for (let info in podInfoList){
        await podInfoList[info].loadRelation('information');
    }

    return podInfoList;
}

export async function loadExperience() {
    let podExperience;
    let podExperienceList = [];
    const allContainers = await ExperienceList.find(user.storageUrl);
    experienceList = allContainers.resourceUrls.filter(c => c.includes("experience"));

    if (!experienceList) {
        return [];
    }

    for (let url in experienceList) {
        podExperience = await ExperienceList.find(experienceList[url]);
        podExperienceList.push(podExperience);
    }
    for (let exp in podExperienceList) {
        await podExperienceList[exp].loadRelation('experience');
    }

    return podExperienceList;
}

export async function loadProject() {
    let podProject;
    let podProjectList = [];
    const allContainers = await ProjectList.find(user.storageUrl);
    projectList = allContainers.resourceUrls.filter(c => c.includes("projects"));

    
    if (!projectList) {
        return [];
    }

    for (let url in projectList) {
        podProject = await ProjectList.find(projectList[url]);
        podProjectList.push(podProject);
    }
    for (let proj in podProjectList) {
        await podProjectList[proj].loadRelation('projects');
    }
    return podProjectList;
}

export async function loadAward() {
    let podAward;
    let podAwardList = [];
    const allContainers = await AwardList.find(user.storageUrl);
    awardList = allContainers.resourceUrls.filter(c => c.includes("awards"));

    if (!awardList) {
        return [];
    }

    for (let url in awardList) {
        podAward = await AwardList.find(awardList[url]);
        podAwardList.push(podAward);
    }
    for (let award in podAwardList) {
        await podAwardList[award].loadRelation('award');
    }

    return podAwardList;
}

export async function loadTraining() {
    let podTraining;
    let podTrainingList = [];
    const allContainers = await TrainingList.find(user.storageUrl);
    trainingList = allContainers.resourceUrls.filter(c => c.includes("training"));

    if (!trainingList) {
        return [];
    }

    for (let url in trainingList) {
        podTraining = await TrainingList.find(trainingList[url]);
        podTrainingList.push(podTraining);
    }
    for (let training in podTrainingList) {
        await podTrainingList[training].loadRelation('training');
    }

    return podTrainingList;
}

export async function loadReference() {
    let podReference;
    let podReferenceList = [];
    const allContainers = await ReferenceList.find(user.storageUrl);
    referenceList = allContainers.resourceUrls.filter(c => c.includes("references"));

    if (!referenceList) {
        return [];
    }

    for (let url in referenceList) {
        podReference = await ReferenceList.find(referenceList[url]);
        podReferenceList.push(podReference);
    }
    for (let reference in podReferenceList) {
        await podReferenceList[reference].loadRelation('reference');
    }

    return podReferenceList;
}


export async function loadImage() {
    let podImage;
    let podImageList = [];
    const allContainers = await ImageList.find(user.storageUrl);
    imageList = allContainers.resourceUrls.filter(c => c.includes("images"));

    if (!imageList) {
        return [];
    }

    for (let url in imageList) {
        podImage = await ImageList.find(imageList[url]);
        podImageList.push(podImage);
    }
    for (let image in podImageList) {
        await podImageList[image].loadRelation('image');
    }

    return podImageList;
}

export async function loadWebsite() {
    let podWebsite;
    let podWebsiteList = [];
    const allContainers = await WebsiteList.find(user.storageUrl);
    websiteList = allContainers.resourceUrls.filter(c => c.includes("websites"));

    if (!websiteList) {
        return [];
    }

    for (let url in websiteList) {
        podWebsite = await WebsiteList.find(websiteList[url]);
        podWebsiteList.push(podWebsite);
    }
    for (let website in podWebsiteList) {
        await podWebsiteList[website].loadRelation('website');
    }

    return podWebsiteList;
}

export async function loadSkill() {
    let podSkill;
    let podSkillList = [];
    const allContainers = await SkillList.find(user.storageUrl);
    skillList = allContainers.resourceUrls.filter(c => c.includes("skills"));

    if (!skillList) {
        return [];
    }

    for (let url in skillList) {
        podSkill = await SkillList.find(skillList[url]);
        podSkillList.push(podSkill);
    }
    for (let skill in podSkillList) {
        await podSkillList[skill].loadRelation('skill');
    }

    return podSkillList;
}

export async function loadResumes() {
    resumeList = await ResumeList.find(`${user.storageUrl}resumes/`);
    if (!resumeList) {
        return [];
    }

    await resumeList.loadRelation('resume');
    return resumeList.relatedResume;
}

// Updating Information
export async function performUpdateInformation(infoUrl, inputInfo) {
    let podInfo;
    let podInformationList = [];
    const allContainers = await InformationList.find(user.storageUrl);
    infoList = allContainers.resourceUrls.filter(c => c.includes("information"));

    if (!infoList) {
        return;
    }

    for (let url in infoList) {
        podInfo = await InformationList.find(infoList[url]);
        podInformationList.push(podInfo);
    }
    for (let info in podInformationList) {
        await podInformationList[info].loadRelation('information');
    }

    for (let i in podInformationList) {
        let information = podInformationList[i].information;
        for (let j in information) {
            console.log("Checking information with URL:", information[j].url);
            if (information[j].url === infoUrl) {
                await information[j].update({ FullName: inputInfo.FullName
                    , ProfessionalTitle: inputInfo.ProfessionalTitle
                    , Summary: inputInfo.Summary
                    , Email: inputInfo.Email
                    , ContactNumber: inputInfo.ContactNumber
                    , Location: inputInfo.Location
                    , WebsiteLink: inputInfo.WebsiteLink
                    , ProfessionalSummary: inputInfo.ProfessionalSummary
                    , School: inputInfo.School
                    , Degree: inputInfo.Degree
                    , Program: inputInfo.Program
                    , StartDate: inputInfo.StartDate
                    , EndDate: inputInfo.EndDate
                    , RelevantCoursework: inputInfo.RelevantCoursework
                    , Honors: inputInfo.Honors
                    , ThesisTitle: inputInfo.ThesisTitle
                 });
            alert('Information updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}


export async function performUpdateExperience(expUrl, inputExp) {
    let podExperience;
    let podExperienceList = [];
    const allContainers = await ExperienceList.find(user.storageUrl);
    experienceList = allContainers.resourceUrls.filter(c => c.includes("experience"));

    if (!experienceList) {
        return;
    }

    for (let url in experienceList) {
        podExperience = await ExperienceList.find(experienceList[url]);
        podExperienceList.push(podExperience);
    }
    for (let exp in podExperienceList) {
        await podExperienceList[exp].loadRelation('experience');
    }

    for (let i in podExperienceList) {
        let experiences = podExperienceList[i].experience;
        for (let j in experiences) {
            console.log("Checking experience with URL:", experiences[j].url);
            if (experiences[j].url === expUrl) {
                await experiences[j].update({ 
                    PositionTitle: inputExp.PositionTitle,
                    Organization: inputExp.Organization,
                    Duration: inputExp.Duration,
                    Description: inputExp.Description
                 });
            alert('Experience updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performUpdateProject(projectUrl, inputProject) {
    let podProject;
    let podProjectList = [];
    const allContainers = await ProjectList.find(user.storageUrl);
    projectList = allContainers.resourceUrls.filter(c => c.includes("projects"));

    if (!projectList) {
        return;
    }

    for (let url in projectList) {
        podProject = await ProjectList.find(projectList[url]);
        podProjectList.push(podProject);
    }
    for (let proj in podProjectList) {
        await podProjectList[proj].loadRelation('projects');
    }

    for (let i in podProjectList) {
        let projects = podProjectList[i].projects;
        for (let j in projects) {
            console.log("Checking project with URL:", projects[j].url);
            if (projects[j].url === projectUrl) {
                await projects[j].update({ 
                    ProjectName: inputProject.ProjectName,
                    Tools: inputProject.Tools,
                    Summary: inputProject.ProjectSummary,
                    ProjectLink: inputProject.ProjectLink
                 });
            alert('Project updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performUpdateAward(awardUrl, inputAward) {
    let podAward;
    let podAwardList = [];
    const allContainers = await AwardList.find(user.storageUrl);
    awardList = allContainers.resourceUrls.filter(c => c.includes("awards"));

    if (!awardList) {
        return;
    }

    for (let url in awardList) {
        podAward = await AwardList.find(awardList[url]);
        podAwardList.push(podAward);
    }
    for (let award in podAwardList) {
        await podAwardList[award].loadRelation('award');
    }

    for (let i in podAwardList) {
        let awards = podAwardList[i].award;
        for (let j in awards) {
            console.log("Checking award with URL:", awards[j].url);
            if (awards[j].url === awardUrl) {
                await awards[j].update({ 
                    AwardTitle: inputAward.AwardTitle,
                    Date: inputAward.Date,
                    Organization: inputAward.Organization
                 });
            alert('Award updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performUpdateTraining(trainingUrl, inputTraining) {
    let podTraining;
    let podTrainingList = [];
    const allContainers = await TrainingList.find(user.storageUrl);
    trainingList = allContainers.resourceUrls.filter(c => c.includes("training"));

    if (!trainingList) {
        return;
    }

    for (let url in trainingList) {
        podTraining = await TrainingList.find(trainingList[url]);
        podTrainingList.push(podTraining);
    }
    for (let training in podTrainingList) {
        await podTrainingList[training].loadRelation('training');
    }

    for (let i in podTrainingList) {
        let trainings = podTrainingList[i].training;
        for (let j in trainings) {
            console.log("Checking training with URL:", trainings[j].url);
            if (trainings[j].url === trainingUrl) {
                await trainings[j].update({ 
                    TrainingTitle: inputTraining.TrainingTitle,
                    Organization: inputTraining.Organization,
                    YearEarned: inputTraining.YearEarned,
                    YearExpire: inputTraining.YearExpire
                 });
            alert('Training updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performUpdateReference(referenceUrl, inputReference) {
    let podReference;
    let podReferenceList = [];
    const allContainers = await ReferenceList.find(user.storageUrl);
    referenceList = allContainers.resourceUrls.filter(c => c.includes("references"));

    if (!referenceList) {
        return;
    }

    for (let url in referenceList) {
        podReference = await ReferenceList.find(referenceList[url]);
        podReferenceList.push(podReference);
    }
    for (let reference in podReferenceList) {
        await podReferenceList[reference].loadRelation('reference');
    }

    for (let i in podReferenceList) {
        let references = podReferenceList[i].reference;
        for (let j in references) {
            console.log("Checking reference with URL:", references[j].url);
            if (references[j].url === referenceUrl) {
                await references[j].update({ 
                    Name: inputReference.Name,
                    Position: inputReference.Position,
                    Email: inputReference.Email,
                    ContactNumber: inputReference.ContactNumber
                 });
            alert('Reference updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performUpdateImage(imageUrl, inputImage) {
    let podImage;
    let podImageList = [];
    const allContainers = await ImageList.find(user.storageUrl);
    imageList = allContainers.resourceUrls.filter(c => c.includes("images"));

    if (!imageList) {
        return;
    }

    for (let url in imageList) {
        podImage = await ImageList.find(imageList[url]);
        podImageList.push(podImage);
    }
    for (let image in podImageList) {
        await podImageList[image].loadRelation('image');
    }

    for (let i in podImageList) {
        let images = podImageList[i].image;
        for (let j in images) {
            console.log("Checking image with URL:", images[j].url);
            if (images[j].url === imageUrl) {
                await images[j].update({ 
                    Link: inputImage.Link,
                 });
            alert('Image updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performUpdateWebsite(websiteUrl, inputWebsite) {
    let podWebsite;
    let podWebsiteList = [];
    const allContainers = await WebsiteList.find(user.storageUrl);
    websiteList = allContainers.resourceUrls.filter(c => c.includes("website"));

    if (!websiteList) {
        return;
    }

    for (let url in websiteList) {
        podWebsite = await WebsiteList.find(websiteList[url]);
        podWebsiteList.push(podWebsite);
    }
    for (let exp in podWebsiteList) {
        await podWebsiteList[exp].loadRelation('website');
    }

    for (let i in podWebsiteList) {
        let websites = podWebsiteList[i].website;
        for (let j in websites) {
            console.log("Checking website with URL:", websites[j].url);
            if (websites[j].url === websiteUrl) {
                await websites[j].update({ 
                    WebsiteLink: inputWebsite.WebsiteLink,
                });
            alert('Website updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performUpdateSkill(skillUrl, inputSkill) {
    let podSkill;
    let podSkillList = [];
    const allContainers = await SkillList.find(user.storageUrl);
    skillList = allContainers.resourceUrls.filter(c => c.includes("skills"));

    if (!skillList) {
        return;
    }

    for (let url in skillList) {
        podSkill = await SkillList.find(skillList[url]);
        podSkillList.push(podSkill);
    }
    for (let skill in podSkillList) {
        await podSkillList[skill].loadRelation('skill');
    }

    for (let i in podSkillList) {
        let skills = podSkillList[i].skill;
        for (let j in skills) {
            console.log("Checking skill with URL:", skills[j].url);
            if (skills[j].url === skillUrl) {
                await skills[j].update({ 
                    Skill: inputSkill.Skill,
                 });
            alert('Skill updated successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}


export async function performUpdateResume(resumeUrl, inputResume) {
    let podResume;
    let podResumeList = [];
    const allContainers = await ResumeList.find(user.storageUrl);
    resumeList = allContainers.resourceUrls.filter(c => c.includes("resumes"));

    if (!resumeList) {
        return;
    }

    for (let url in resumeList) {
        podResume = await ResumeList.find(resumeList[url]);
        podResumeList.push(podResume);
    }
    for (let resume in podResumeList) {
        await podResumeList[resume].loadRelation('resume');
    }

    for (let i in podResumeList) {
        let resumes = podResumeList[i].resumes;
        for (let j in resumes) {
            console.log("Checking resume with URL:", resumes[j].url);
            if (resumes[j].url === resumeUrl) {
                await resumes[j].delete();
                alert('Resume deleted successfully. Please refresh the page to see the changes.');
                return;
            }
        }
    }
}

// Deletion
export async function performInformationDeletion(infoUrl) {
    let podInfo;
    let podInformationList = [];
    const allContainers = await InformationList.find(user.storageUrl);
    infoList = allContainers.resourceUrls.filter(c => c.includes("information"));

    if (!infoList) {
        return [];
    }

    for (let url in infoList) {
        podInfo = await InformationList.find(infoList[url]);
        podInformationList.push(podInfo);
    }
    for (let info in podInformationList) {
        await podInformationList[info].loadRelation('information');
    }

    for (let i in podInformationList) {
        let information = podInformationList[i].information;
        for (let j in information) {
            console.log("Checking information with URL:", information[j].url);
            if (information[j].url === infoUrl) {
                await information[j].delete();
            alert('Information deleted successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performExperienceDeletion(expUrl) {
    let podExperience;
    let podExperienceList = [];
    const allContainers = await ExperienceList.find(user.storageUrl);
    experienceList = allContainers.resourceUrls.filter(c => c.includes("experience"));

    if (!experienceList) {
        return [];
    }

    for (let url in experienceList) {
        podExperience = await ExperienceList.find(experienceList[url]);
        podExperienceList.push(podExperience);
    }
    for (let exp in podExperienceList) {
        await podExperienceList[exp].loadRelation('experience');
    }

    for (let i in podExperienceList) {
        let experiences = podExperienceList[i].experience;
        for (let j in experiences) {
            console.log("Checking experience with URL:", experiences[j].url);
            if (experiences[j].url === expUrl) {
                await experiences[j].delete();
            alert('Experience deleted successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performProjectDeletion(projectUrl) {
    let podProject;
    let podProjectList = [];
    const allContainers = await ProjectList.find(user.storageUrl);
    projectList = allContainers.resourceUrls.filter(c => c.includes("project"));

    if (!projectList) {
        return [];
    }

    for (let url in projectList) {
        podProject = await ProjectList.find(projectList[url]);
        podProjectList.push(podProject);
    }
    for (let exp in podProjectList) {
        await podProjectList[exp].loadRelation('projects');
    }

    console.log("Checking projectlist:", podProjectList)
    for (let i in podProjectList) {
        let projects = podProjectList[i].projects;
        for (let j in projects) {
            console.log("Checking project with URL:", projects[j].url);
            if (projects[j].url === projectUrl) {
                await projects[j].delete();
            alert('Project deleted successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performAwardDeletion(awardUrl) {
    await awardList?.relatedAward.delete(awardUrl);
    alert('Award deleted successfully. Please refresh the page to see the changes.');
}

export async function performTrainingDeletion(trainingUrl) {
    await trainingList?.relatedTraining.delete(trainingUrl);
    alert('Training deleted successfully. Please refresh the page to see the changes.');
}

export async function performReferenceDeletion(referenceUrl) {
    await referenceList?.relatedReference.delete(referenceUrl);
    alert('Reference deleted successfully. Please refresh the page to see the changes.');
}

export async function performWebsiteDeletion(websiteUrl) {
    let podWebsite;
    let podWebsiteList = [];
    const allContainers = await WebsiteList.find(user.storageUrl);
    websiteList = allContainers.resourceUrls.filter(c => c.includes("website"));

    if (!websiteList) {
        return [];
    }

    for (let url in websiteList) {
        podWebsite = await WebsiteList.find(websiteList[url]);
        podWebsiteList.push(podWebsite);
    }
    for (let exp in podWebsiteList) {
        await podWebsiteList[exp].loadRelation('website');
    }

    for (let i in podWebsiteList) {
        let websites = podWebsiteList[i].website;
        for (let j in websites) {
            console.log("Checking website with URL:", websites[j].url);
            if (websites[j].url === websiteUrl) {
                await websites[j].delete();
            alert('Website deleted successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performSkillDeletion(skillUrl) {
    let podSkill;
    let podSkillList = [];
    const allContainers = await SkillList.find(user.storageUrl);
    skillList = allContainers.resourceUrls.filter(c => c.includes("skill"));

    if (!skillList) {
        return [];
    }

    for (let url in skillList) {
        podSkill = await SkillList.find(skillList[url]);
        podSkillList.push(podSkill);
    }
    for (let exp in podSkillList) {
        await podSkillList[exp].loadRelation('skill');
    }

    for (let i in podSkillList) {
        let skills = podSkillList[i].skill;
        for (let j in skills) {
            console.log("Checking skill with URL:", skills[j].url);
            if (skills[j].url === skillUrl) {
                await skills[j].delete();
            alert('Skill deleted successfully. Please refresh the page to see the changes.');
            return;
            }
        }
    }
}

export async function performResumeDeletion(resumeUrl) {
    let podResume;
    let podResumeList = [];
    const allContainers = await ResumeList.find(user.storageUrl);
    resumeList = allContainers.resourceUrls.filter(c => c.includes("resumes"));

    if (!resumeList) {
        return [];
    }

    for (let url in resumeList) {
        podResume = await ResumeList.find(resumeList[url]);
        podResumeList.push(podResume);
    }
    for (let exp in podResumeList) {
        await podResumeList[exp].loadRelation('resume');
    }

    for (let i in podResumeList) {
        let resumes = podResumeList[i].resumes;
        for (let j in resumes) {
            console.log("Checking resume with URL:", resumes[j].url);
            if (resumes[j].url === resumeUrl) {
                await resumes[j].delete();
                alert('Resume deleted successfully. Please refresh the page to see the changes.');
                return;
            }
        }
    }
}

export async function performImageDeletion() {
    
    
    let myImageList = await getSolidDataset(`${user.storageUrl}images/`, { fetch: fetch });
    let items = getThingAll(myImageList);
    items.shift();
    let itemListPromises = [];

    items.forEach( (item) => {
        // itemListPromises.push(getFile(item.url, { fetch: fetch }))
        deleteFile(item.url, { fetch: fetch})
    });


}



export function getAuthenticatedFetch() {
    return fetch;
}


async function fetchUserProfile(webId) {
    const user = await User.find(webId);

    return {
        url: webId,
        name: user?.name || 'Anonymous',

        // WebIds may declare more than one storage url, so in a real application you should
        // ask which one to use if that happens. In this app, in order to keep it simple, we'll
        // just use the first one. If none is declared in the profile, we'll search for it.
        storageUrl: user?.storageUrl || (await findUserStorage(webId)),
    };
}

async function findUserStorage(url) {
    url = url.replace(/#.*$/, '');
    url = url.endsWith('/') ? url + '../' : url + '/../';
    url = new URL(url);

    const response = await fetch(url.href);

    if (response.headers.get('Link')?.includes('<http://www.w3.org/ns/pim/space#Storage>; rel="type"')) return url.href;

    if (url.pathname === '/') return url.href;

    return findUserStorage(url.href);
}