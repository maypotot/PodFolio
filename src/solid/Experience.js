import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class Experience extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'foaf:Person';
    static fields = {
        PositionTitle: {
            required: true,
            type: FieldType.String,
        },
        Organization: {
            required: true,
            type: FieldType.String,
        },
        Duration: {
            required: true,
            type: FieldType.String,
        },
        Description: {
            required: true,
            type: FieldType.String,
        },
        ExperienceLocation: {
            required: true,
            type: FieldType.String,
        },
        ExperienceIndex: {
            required: true,
            type: FieldType.Number,
        }
    };

}