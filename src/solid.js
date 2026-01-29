import { fetch, getDefaultSession, handleIncomingRedirect, login, logout } from '@inrupt/solid-client-authn-browser';
import { saveFileInContainer, getSourceUrl, getFile, getSolidDataset, getThingAll, removeThing, deleteFile} from "@inrupt/solid-client";

import User from './User';
import InformationList from './InformationList';
import ExperienceList from './ExperienceList';
import ProjectList from './ProjectList';
import AwardList from './AwardList';
import TrainingList from './TrainingList';
import ReferenceList from './ReferenceList';
import ImageList from './ImageList';
import WebsiteList from './WebsiteList';
import SkillList from './SkillList';


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
    if (!infoList) {
        infoList = await InformationList.at(user.storageUrl).create({ url: `${user.storageUrl}information/` });
    }

    const information = infoList.relatedInformation.create(info);
    return information;
}

export async function performExperienceCreation(exp) {
    if (!experienceList) {
        experienceList = await ExperienceList.at(user.storageUrl).create({ url: `${user.storageUrl}experience/` });
    }

    const experience = experienceList.relatedExperience.create(exp);
    return experience;
}

export async function performProjectCreation(project) {
    if (!projectList) {
        projectList = await ProjectList.at(user.storageUrl).create({ url: `${user.storageUrl}projects/` });
    }

    const newProject = projectList.relatedProjects.create(project);
    return newProject;
}

export async function performAwardCreation(award) {
    if (!awardList) {
        awardList = await AwardList.at(user.storageUrl).create({ url: `${user.storageUrl}awards/` });
    }

    const newAward = awardList.relatedAward.create(award);
    return newAward;
}

export async function performTrainingCreation(training) {
    if (!trainingList) {
        trainingList = await TrainingList.at(user.storageUrl).create({ url: `${user.storageUrl}training/` });
    }

    const newTraining = trainingList.relatedTraining.create(training);
    return newTraining;
}

export async function performReferenceCreation(reference) {
    if (!referenceList) {
        referenceList = await ReferenceList.at(user.storageUrl).create({ url: `${user.storageUrl}references/` });
    }

    const newReference = referenceList.relatedReference.create(reference);
    return newReference;
}

export async function performWebsiteCreation(website) {
    if (!websiteList) {
        websiteList = await WebsiteList.at(user.storageUrl).create({ url: `${user.storageUrl}websites/` });
    }

    const newWebsite = websiteList.relatedWebsite.create(website);
    return newWebsite;
}

export async function performSkillCreation(skill) {
    if (!skillList) {
        skillList = await SkillList.at(user.storageUrl).create({ url: `${user.storageUrl}skills/` });
    }

    const newSkill = skillList.relatedSkill.create(skill);
    return newSkill;
}

async function uploadImage(file) {
  try {
    const savedFile = await saveFileInContainer(
      `${user.storageUrl}images/`,           // Container URL
      file,                         // File 
      { slug: file.name, contentType: file.type, fetch: fetch }
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
    infoList = await InformationList.find(`${user.storageUrl}information/`);

    if (!infoList) {
        return [];
    }

    await infoList.loadRelation('information');

    return infoList.information;
}

export async function loadExperience() {
    experienceList = await ExperienceList.find(`${user.storageUrl}experience/`);

    if (!experienceList) {
        return [];
    }

    await experienceList.loadRelation('experience');

    return experienceList.experience;
}

export async function loadProject() {
    projectList = await ProjectList.find(`${user.storageUrl}projects/`);

    if (!projectList) {
        return [];
    }

    await projectList.loadRelation('projects');

    return projectList.projects;
}

export async function loadAward() {
    awardList = await AwardList.find(`${user.storageUrl}awards/`);

    if (!awardList) {
        return [];
    }

    await awardList.loadRelation('award');

    return awardList.award;
}

export async function loadTraining() {
    trainingList = await TrainingList.find(`${user.storageUrl}training/`);

    if (!trainingList) {
        return [];
    }

    await trainingList.loadRelation('training');

    return trainingList.training;
}

export async function loadReference() {
    referenceList = await ReferenceList.find(`${user.storageUrl}references/`);

    if (!referenceList) {
        return [];
    }

    await referenceList.loadRelation('reference');

    return referenceList.reference;
}


export async function loadImage() {
    imageList = await ImageList.find(`${user.storageUrl}images/`);

    if (!imageList) {
        return [];
    }

    await imageList.loadRelation('image');
    return imageList.image;
}

export async function loadWebsite() {
    websiteList = await WebsiteList.find(`${user.storageUrl}websites/`);

    if (!websiteList) {
        return [];
    }

    await websiteList.loadRelation('website');
    return websiteList.website;
}

export async function loadSkill() {
    skillList = await SkillList.find(`${user.storageUrl}skills/`);

    if (!skillList) {
        return [];
    }

    await skillList.loadRelation('skill');
    return skillList.skill;
}

// Updating Information
export async function performUpdateInformation(infoUrl, inputInfo) {
    const info = infoList?.information.find((info) => info.url === infoUrl);

    await info.update({ FullName: inputInfo.FullName
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
}


export async function performUpdateExperience(expUrl, inputExp) {
    const exp = experienceList?.experience.find((exp) => exp.url === expUrl);

    await exp.update({ 
        PositionTitle: inputExp.PositionTitle,
        Organization: inputExp.Organization,
        Duration: inputExp.Duration,
        Description: inputExp.Description
     });
}

export async function performUpdateProject(projectUrl, inputProject) {
    const proj = projectList?.projects.find((project) => project.url === projectUrl);

    await proj.update({ 
        ProjectName: inputProject.ProjectName,
        Tools: inputProject.Tools,
        Summary: inputProject.ProjectSummary,
        ProjectLink: inputProject.ProjectLink
     });
}

export async function performUpdateAward(awardUrl, inputAward) {
    const award = awardList?.award.find((award) => award.url === awardUrl);

    await award.update({ 
        AwardTitle: inputAward.AwardTitle,
        Date: inputAward.Date,
        Organization: inputAward.Organization
     });
}

export async function performUpdateTraining(trainingUrl, inputTraining) {
    const training = trainingList?.training.find((training) => training.url === trainingUrl);

    await training.update({ 
        TrainingTitle: inputTraining.TrainingTitle,
        Organization: inputTraining.Organization,
        YearEarned: inputTraining.YearEarned,
        YearExpire: inputTraining.YearExpire
     });
}

export async function performUpdateReference(referenceUrl, inputReference) {
    const reference = referenceList?.reference.find((reference) => reference.url === referenceUrl);

    await reference.update({ 
        Name: inputReference.Name,
        Position: inputReference.Position,
        Email: inputReference.Email,
        ContactNumber: inputReference.ContactNumber
     });
}

export async function performUpdateImage(imageUrl, inputImage) {
    const image = imageList?.image.find((image) => image.url === imageUrl);

    await image.update({ 
        Link: inputImage.Link,
     });
}

// Deletion
export async function performInformationDeletion(infoUrl) {
    await infoList?.relatedInformation.delete(infoUrl);
    alert('Information deleted successfully. Please refresh the page to see the changes.');
}

export async function performExperienceDeletion(expUrl) {
    await experienceList?.relatedExperience.delete(expUrl);
    alert('Experience deleted successfully. Please refresh the page to see the changes.');
}

export async function performProjectDeletion(projectUrl) {
    await projectList?.relatedProjects.delete(projectUrl);
    alert('Project deleted successfully. Please refresh the page to see the changes.');
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