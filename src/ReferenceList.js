import { SolidContainer } from 'soukai-solid';

import Reference from './Reference';

export default class ReferenceList extends SolidContainer {
    referenceRelationship() {
        return this.contains(Reference);
    }
}