import { SolidContainer } from 'soukai-solid';

import Training from './Training';

export default class TrainingList extends SolidContainer {
    trainingRelationship() {
        return this.contains(Training);
    }
}