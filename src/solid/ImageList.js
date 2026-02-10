import { SolidContainer } from 'soukai-solid';

import ImageModel from './Image';

export default class ImageList extends SolidContainer {
    imageRelationship() {
        return this.contains(ImageModel);
    }
}