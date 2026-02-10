import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class Reference extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'foaf:Person';
    static fields = {
        Name: {
            required: true,
            type: FieldType.String,
        },
        Position: {
            required: true,
            type: FieldType.String,
        },
        Email: {
            required: true,
            type: FieldType.String,
        },
        ContactNumber: {
            required: false,
            type: FieldType.String,
        },
    };

}