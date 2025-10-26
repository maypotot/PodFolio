import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class Award extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'foaf:Person';
    static fields = {
        AwardTitle: {
            required: true,
            type: FieldType.String,
        },
        Date: {
            required: true,
            type: FieldType.String,
        },
        Organization: {
            required: true,
            type: FieldType.String,
        },
    };

}