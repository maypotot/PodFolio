import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class ImageModel extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfProperty = 'schema:image';

    static fields = {
        ImageFile: {
            required: true,
            type: FieldType.Key,
        },
    };

}