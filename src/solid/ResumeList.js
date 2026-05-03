import { SolidContainer } from 'soukai-solid';

import Resume from './Resume';

export default class ResumeList extends SolidContainer {
    resumeRelationship() {
        return this.contains(Resume);
    }
}