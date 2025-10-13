import { fetch, getDefaultSession, handleIncomingRedirect, login, logout } from '@inrupt/solid-client-authn-browser';

import User from './User';
import TasksList from './TasksList';
import InformationList from './InformationList';

let list, user;
let infoList;

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

export async function performTaskCreation(description) {
    // Data discovery mechanisms are still being defined in Solid, but so far it is clear that
    // applications should not hard-code the url of their containers like we are doing in this
    // example.
    //
    // In a real application, you should use one of these two alternatives:
    //
    // - The Type index. This is the one that most applications are using in practice today:
    //   https://soukai.js.org/guide/advanced/interoperability.html#type-indexes
    //
    // - SAI, or Solid App Interoperability. This one is still being defined:
    //   https://solid.github.io/data-interoperability-panel/specification/

    if (!list) {
        list = await TasksList.at(user.storageUrl).create({ url: `${user.storageUrl}tasks/` });
    }

    const task = list.relatedTasks.create({ description });
    return task;
}

export async function performTaskUpdate(taskUrl, done) {
    const task = list?.tasks.find((task) => task.url === taskUrl);

    await task.toggle(done);
}

export async function performTaskDeletion(taskUrl) {
    await list?.relatedTasks.delete(taskUrl);
}

export async function loadTasks() {
    // In a real application, you shouldn't hard-code the path to the container like we're doing here.
    // Read more about this in the comments on the performTaskCreation function.
    list = await TasksList.find(`${user.storageUrl}tasks/`);

    if (!list) {
        return [];
    }

    await list.loadRelation('tasks');

    return list.tasks;
}

export async function performInformationCreation(info) {
    if (!infoList) {
        infoList = await InformationList.at(user.storageUrl).create({ url: `${user.storageUrl}information/` });
    }

    const information = infoList.relatedInformation.create(info);
    return information;
}

export async function loadInformation() {
    infoList = await InformationList.find(`${user.storageUrl}information/`);

    if (!infoList) {
        return [];
    }

    await infoList.loadRelation('information');

    return infoList.information;
}

export async function performUpdateFullName(infoUrl, inputName) {
    const info = infoList?.information.find((info) => info.url === infoUrl);

    await info.update({ FullName: inputName });
}

export async function performInformationDeletion(infoUrl) {
    await infoList?.relatedInformation.delete(infoUrl);
    alert('Information deleted successfully. Please refresh the page to see the changes.');
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