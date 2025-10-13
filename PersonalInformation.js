import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class PersonalInformation extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'foaf:Person';
    static fields = {
        FullName: {
            required: true,
            type: FieldType.String,
        },
        ProfessionalTitle: {
            required: true,
            type: FieldType.String,
        },
        Summary: {
            required: true,
            type: FieldType.String,
        },
        Email: {
            required: true,
            type: FieldType.String,
        },
        ContactNumber: {
            required: true,
            type: FieldType.String,
        },
        Location: {
            required: true,
            type: FieldType.String,
        },
        WebsiteLink: {
            required: true,
            type: FieldType.String,
        },
    };

}