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

import PersonalInformation from './solid/PersonalInformation';
import Experience from './solid/Experience';
import Project from './solid/Project';
import Award from './solid/Award';
import Training from './solid/Training';
import Reference from './solid/Reference';
import Image from './solid/Image';
import Website from './solid/Website';
import Skill from './solid/Skill';

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
    return await PersonalInformation.at(`${user.storageUrl}information/`).create(info);
}

export async function performExperienceCreation(exp) {
    return await Experience.at(`${user.storageUrl}experience/`).create(exp);
}

export async function performProjectCreation(project) {
    return await Project.at(`${user.storageUrl}projects/`).create(project);
}

export async function performAwardCreation(award) {
    return await Award.at(`${user.storageUrl}awards/`).create(award);
}

export async function performTrainingCreation(training) {
    return await Training.at(`${user.storageUrl}training/`).create(training);
}

export async function performReferenceCreation(reference) {
    return await Reference.at(`${user.storageUrl}references/`).create(reference);
}

export async function performWebsiteCreation(website) {
    return await Website.at(`${user.storageUrl}websites/`).create(website);
}

export async function performSkillCreation(skill) {
    return await Skill.at(`${user.storageUrl}skills/`).create(skill);
}

export async function performResumeCreation(resume) {
    return await Resume.at(`${user.storageUrl}resumes/`).create(resume);
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
    let podInfoList = [];
    try {
        const personalInfos = await PersonalInformation.at(`${user.storageUrl}information/`).all();
        const podInfo = {
            information: personalInfos,
            url: `${user.storageUrl}information/`
        };
        podInfoList.push(podInfo);
        infoList = [`${user.storageUrl}information/`];
    } catch (error) {
        console.warn("Error loading information:", error);
    }
    return podInfoList;
}

export async function loadExperience() {
    let podExperienceList = [];
    try {
        const experiences = await Experience.at(`${user.storageUrl}experience/`).all();
        const podExperience = {
            experience: experiences,
            url: `${user.storageUrl}experience/`
        };
        podExperienceList.push(podExperience);
        experienceList = [`${user.storageUrl}experience/`];
    } catch (error) {
        console.warn("Error loading experience:", error);
    }
    return podExperienceList;
}

export async function loadProject() {
    let podProjectList = [];
    try {
        const projects = await Project.at(`${user.storageUrl}projects/`).all();
        const podProject = {
            projects: projects,
            url: `${user.storageUrl}projects/`
        };
        podProjectList.push(podProject);
        projectList = [`${user.storageUrl}projects/`];
    } catch (error) {
        console.warn("Error loading projects:", error);
    }
    return podProjectList;
}

export async function loadAward() {
    let podAwardList = [];
    try {
        const awards = await Award.at(`${user.storageUrl}awards/`).all();
        const podAward = {
            award: awards,
            url: `${user.storageUrl}awards/`
        };
        podAwardList.push(podAward);
        awardList = [`${user.storageUrl}awards/`];
    } catch (error) {
        console.warn("Error loading awards:", error);
    }
    return podAwardList;
}

export async function loadTraining() {
    let podTrainingList = [];
    try {
        const trainings = await Training.at(`${user.storageUrl}training/`).all();
        const podTraining = {
            training: trainings,
            url: `${user.storageUrl}training/`
        };
        podTrainingList.push(podTraining);
        trainingList = [`${user.storageUrl}training/`];
    } catch (error) {
        console.warn("Error loading training:", error);
    }
    return podTrainingList;
}

export async function loadReference() {
    let podReferenceList = [];
    try {
        const references = await Reference.at(`${user.storageUrl}references/`).all();
        const podReference = {
            reference: references,
            url: `${user.storageUrl}references/`
        };
        podReferenceList.push(podReference);
        referenceList = [`${user.storageUrl}references/`];
    } catch (error) {
        console.warn("Error loading references:", error);
    }
    return podReferenceList;
}


export async function loadImage() {
    let podImageList = [];
    try {
        const images = await Image.at(`${user.storageUrl}images/`).all();
        const podImage = {
            image: images,
            url: `${user.storageUrl}images/`
        };
        podImageList.push(podImage);
        imageList = [`${user.storageUrl}images/`];
    } catch (error) {
        console.warn("Error loading images:", error);
    }
    return podImageList;
}

export async function loadWebsite() {
    let podWebsiteList = [];
    try {
        const websites = await Website.at(`${user.storageUrl}websites/`).all();
        const podWebsite = {
            website: websites,
            url: `${user.storageUrl}websites/`
        };
        podWebsiteList.push(podWebsite);
        websiteList = [`${user.storageUrl}websites/`];
    } catch (error) {
        console.warn("Error loading websites:", error);
    }
    return podWebsiteList;
}

export async function loadSkill() {
    let podSkillList = [];
    try {
        const skills = await Skill.at(`${user.storageUrl}skills/`).all();
        const podSkill = {
            skill: skills,
            url: `${user.storageUrl}skills/`
        };
        podSkillList.push(podSkill);
        skillList = [`${user.storageUrl}skills/`];
    } catch (error) {
        console.warn("Error loading skills:", error);
    }
    return podSkillList;
}

export async function loadResumes() {
    try {
        const resumes = await Resume.at(`${user.storageUrl}resumes/`).all();
        return resumes;
    } catch (error) {
        console.warn("Error loading resumes:", error);
        return [];
    }
}

// Updating Information
export async function performUpdateInformation(infoUrl, inputInfo) {
    try {
        const information = await PersonalInformation.find(infoUrl);
        if (information) {
            await information.update({
                FullName: inputInfo.FullName,
                ProfessionalTitle: inputInfo.ProfessionalTitle,
                Summary: inputInfo.Summary,
                Email: inputInfo.Email,
                ContactNumber: inputInfo.ContactNumber,
                Location: inputInfo.Location,
                WebsiteLink: inputInfo.WebsiteLink,
                ProfessionalSummary: inputInfo.ProfessionalSummary,
                School: inputInfo.School,
                Degree: inputInfo.Degree,
                Program: inputInfo.Program,
                StartDate: inputInfo.StartDate,
                EndDate: inputInfo.EndDate,
                RelevantCoursework: inputInfo.RelevantCoursework,
                Honors: inputInfo.Honors,
                ThesisTitle: inputInfo.ThesisTitle
            });
            alert('Information updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating information:", error);
    }
}


export async function performUpdateExperience(expUrl, inputExp) {
    try {
        const experience = await Experience.find(expUrl);
        if (experience) {
            await experience.update({ 
                PositionTitle: inputExp.PositionTitle,
                Organization: inputExp.Organization,
                Duration: inputExp.Duration,
                Description: inputExp.Description
             });
            alert('Experience updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating experience:", error);
    }
}

export async function performUpdateProject(projectUrl, inputProject) {
    try {
        const project = await Project.find(projectUrl);
        if (project) {
            await project.update({ 
                ProjectName: inputProject.ProjectName,
                Tools: inputProject.Tools,
                Summary: inputProject.ProjectSummary,
                ProjectLink: inputProject.ProjectLink
             });
            alert('Project updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating project:", error);
    }
}

export async function performUpdateAward(awardUrl, inputAward) {
    try {
        const award = await Award.find(awardUrl);
        if (award) {
            await award.update({ 
                AwardTitle: inputAward.AwardTitle,
                Date: inputAward.Date,
                Organization: inputAward.Organization
             });
            alert('Award updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating award:", error);
    }
}

export async function performUpdateTraining(trainingUrl, inputTraining) {
    try {
        const training = await Training.find(trainingUrl);
        if (training) {
            await training.update({ 
                TrainingTitle: inputTraining.TrainingTitle,
                Organization: inputTraining.Organization,
                YearEarned: inputTraining.YearEarned,
                YearExpire: inputTraining.YearExpire
             });
            alert('Training updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating training:", error);
    }
}

export async function performUpdateReference(referenceUrl, inputReference) {
    try {
        const reference = await Reference.find(referenceUrl);
        if (reference) {
            await reference.update({ 
                Name: inputReference.Name,
                Position: inputReference.Position,
                Email: inputReference.Email,
                ContactNumber: inputReference.ContactNumber
             });
            alert('Reference updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating reference:", error);
    }
}

export async function performUpdateImage(imageUrl, inputImage) {
    try {
        const image = await Image.find(imageUrl);
        if (image) {
            await image.update({ 
                Link: inputImage.Link,
             });
            alert('Image updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating image:", error);
    }
}

export async function performUpdateWebsite(websiteUrl, inputWebsite) {
    try {
        const website = await Website.find(websiteUrl);
        if (website) {
            await website.update({ 
                WebsiteLink: inputWebsite.WebsiteLink,
            });
            alert('Website updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating website:", error);
    }
}

export async function performUpdateSkill(skillUrl, inputSkill) {
    try {
        const skill = await Skill.find(skillUrl);
        if (skill) {
            await skill.update({ 
                Skill: inputSkill.Skill,
             });
            alert('Skill updated successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating skill:", error);
    }
}


export async function performUpdateResume(resumeUrl, inputResume) {
    try {
        const resume = await Resume.find(resumeUrl);
        if (resume) {
            await resume.delete();
            alert('Resume deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error updating resume:", error);
    }
}

// Deletion
export async function performInformationDeletion(infoUrl) {
    try {
        const information = await PersonalInformation.find(infoUrl);
        if (information) {
            await information.delete();
            alert('Information deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting information:", error);
    }
}

export async function performExperienceDeletion(expUrl) {
    try {
        const experience = await Experience.find(expUrl);
        if (experience) {
            await experience.delete();
            alert('Experience deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting experience:", error);
    }
}

export async function performProjectDeletion(projectUrl) {
    try {
        const project = await Project.find(projectUrl);
        if (project) {
            await project.delete();
            alert('Project deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting project:", error);
    }
}

export async function performAwardDeletion(awardUrl) {
    try {
        const award = await Award.find(awardUrl);
        if (award) {
            await award.delete();
            alert('Award deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting award:", error);
    }
}

export async function performTrainingDeletion(trainingUrl) {
    try {
        const training = await Training.find(trainingUrl);
        if (training) {
            await training.delete();
            alert('Training deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting training:", error);
    }
}

export async function performReferenceDeletion(referenceUrl) {
    try {
        const reference = await Reference.find(referenceUrl);
        if (reference) {
            await reference.delete();
            alert('Reference deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting reference:", error);
    }
}

export async function performWebsiteDeletion(websiteUrl) {
    try {
        const website = await Website.find(websiteUrl);
        if (website) {
            await website.delete();
            alert('Website deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting website:", error);
    }
}

export async function performSkillDeletion(skillUrl) {
    try {
        const skill = await Skill.find(skillUrl);
        if (skill) {
            await skill.delete();
            alert('Skill deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting skill:", error);
    }
}

export async function performResumeDeletion(resumeUrl) {
    try {
        const resume = await Resume.find(resumeUrl);
        if (resume) {
            await resume.delete();
            alert('Resume deleted successfully. Please refresh the page to see the changes.');
        }
    } catch (error) {
        console.error("Error deleting resume:", error);
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