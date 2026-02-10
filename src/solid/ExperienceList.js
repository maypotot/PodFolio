import { SolidContainer } from 'soukai-solid';

import Experience from './Experience';

export default class ExperienceList extends SolidContainer {
    experienceRelationship() {
        return this.contains(Experience);
    }
}