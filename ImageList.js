import { SolidContainer } from 'soukai-solid';

import Image from './Image';

export default class ImageList extends SolidContainer {
    imageRelationship() {
        return this.contains(Image);
    }
}