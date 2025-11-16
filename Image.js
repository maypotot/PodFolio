import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class Image extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClasses = ['schema:Image'];

    static fields = {
        Link: {
            required: true,
            type: FieldType.Key,
            rdfProperty: 'schema:image',
        },
    };

}