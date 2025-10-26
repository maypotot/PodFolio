import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class Project extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'foaf:Person';
    static fields = {
        ProjectName: {
            required: true,
            type: FieldType.String,
        },
        Tools: {
            required: true,
            type: FieldType.String,
        },
        Summary: {
            required: true,
            type: FieldType.String,
        },
        ProjectLink: {
            required: true,
            type: FieldType.String,
        },
    };

}