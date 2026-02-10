import { SolidContainer } from 'soukai-solid';

import Skill from './Skill';

export default class SkillList extends SolidContainer {
    skillRelationship() {
        return this.contains(Skill);
    }
}