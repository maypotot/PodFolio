import { SolidContainer } from 'soukai-solid';

import Project from './Project';

export default class ProjectsList extends SolidContainer {
    projectsRelationship() {
        return this.contains(Project);
    }
}