import { SolidContainer } from 'soukai-solid';

import Website from './Website';

export default class WebsiteList extends SolidContainer {
    websiteRelationship() {
        return this.contains(Website);
    }
}