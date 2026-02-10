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
        ProfessionalSummary: {
            required: false,
            type: FieldType.String,
        },

        School: {
            required: true,
            type: FieldType.String,
        },
        Degree: {
            required: true,
            type: FieldType.String,
        },
        Program: {
            required: true,
            type: FieldType.String,
        },
        StartDate: {
            required: true,
            type: FieldType.String,
        },
        EndDate: {
            required: true,
            type: FieldType.String,
        },
        RelevantCoursework: {
            required: false,
            type: FieldType.String,
        },
        Honors: {
            required: false,
            type: FieldType.String,
        },
        ThesisTitle: {
            required: false,
            type: FieldType.String,
        },
        ResumeIndex: {
            required: true,
            type: FieldType.Number,
        }

    };

}