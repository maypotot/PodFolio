import { SolidContainer } from 'soukai-solid';

import PersonalInformation from './PersonalInformation';

export default class InformationList extends SolidContainer {
    informationRelationship() {
        return this.contains(PersonalInformation);
    }
}