import { bootSolidModels, SolidEngine } from 'soukai-solid';
import { setEngine } from 'soukai';

import {
    restoreSession,
    getLoginUrl,
    performLogin,
    performLogout,
    performTaskCreation,
    performTaskDeletion,
    performTaskUpdate,
    performInformationCreation,
    loadInformation,
    loadTasks,
    performUpdateFullName,
    getAuthenticatedFetch,
    performInformationDeletion
} from './solid';

async function main() {
    bootSolidModels();
    setEngine(new SolidEngine(getAuthenticatedFetch()));

    const user = await restoreSession();

    document.getElementById('loading').setAttribute('hidden', '');

    if (!user) {
        document.getElementById('auth-guest').removeAttribute('hidden');

        return;
    }

    document.getElementById('username').innerHTML = `<a href="${user.url}" target="_blank">${user.name}</a>`;
    document.getElementById('auth-user').removeAttribute('hidden');

    const information = await loadInformation();

    for (const info of information) {
        appendInformation(info);
    }
}

function login() {
    const loginUrl = getLoginUrl();

    if (!loginUrl) return;

    performLogin(loginUrl);
}

async function logout() {
    document.getElementById('logout-button').setAttribute('disabled', '');

    await performLogout();

    document.getElementById('auth-guest').removeAttribute('hidden');
    document.getElementById('auth-user').setAttribute('hidden', '');
    document.getElementById('logout-button').removeAttribute('disabled');
}

async function createTask() {
    const description = prompt('Task description');

    if (!description) return;

    const task = await performTaskCreation(description);
    console.log(task);

    appendTaskItem(task);
}

async function createInformation() {
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

    const information = await performInformationCreation({
        FullName,
        ProfessionalTitle,
        Summary,
        Email,
        ContactNumber,
        Location,
        WebsiteLink,
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

    appendInformation(information);
}

async function updateTask(taskUrl, button) {
    const done = button.innerText === 'Complete';
    button.setAttribute('disabled', '');

    await performTaskUpdate(taskUrl, done);

    button.removeAttribute('disabled');
    button.innerText = done ? 'Undo' : 'Complete';
}

async function deleteTask(taskUrl, taskElement, button) {
    button.setAttribute('disabled', '');

    await performTaskDeletion(taskUrl);

    taskElement.remove();
}

function appendTaskItem(task) {
    const taskItem = document.createElement('li');

    taskItem.innerHTML = `
        <button
            type="button"
            onclick="deleteTask('${task.url}', this.parentElement, this)"
        >
            Delete
        </button>
        <button
            type="button"
            onclick="updateTask('${task.url}', this)"
            style="width:100px"
        >
            ${task.done ? 'Undo' : 'Complete'}
        </button>
        <span>${task.description}</span>
    `;

    document.getElementById('tasks').appendChild(taskItem);
}

function appendInformation(info) {
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
            onclick="updateFullName('${info.url}')"
        >
            Update Full Name
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

function updateFullName(infoUrl) {
    const FullName = prompt('New Full Name: ');
    performUpdateFullName(infoUrl, FullName);
}

function deleteInformation(infoUrl) {
    performInformationDeletion(infoUrl);
}

main();

window.login = login;
window.logout = logout;
window.createInformation = createInformation;
window.updateFullName = updateFullName;
window.deleteInformation = deleteInformation;
window.onunhandledrejection = (error) => alert(`Error: ${error.reason?.message}`);