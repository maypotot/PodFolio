import { SolidContainer } from 'soukai-solid';

import Award from './Award';

export default class AwardList extends SolidContainer {
    awardRelationship() {
        return this.contains(Award);
    }
}