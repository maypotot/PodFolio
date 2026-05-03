import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

export default class Resume extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'schema:CreativeWork';
    static fields = {
        ResumeTitle: {
            required: true,
            type: FieldType.String,
        },
        InformationIndex: {
            required: true,
            type: FieldType.Number,
        },
        WebsiteIndexes: {
            required: false,
            type: FieldType.Array,
            items: { type: FieldType.Number },
        },
        ProjectIndexes: {
            required: false,
            type: FieldType.Array,
            items: { type: FieldType.Number },
        },
        ExperienceIndexes: {
            required: false,
            type: FieldType.Array,
            items: { type: FieldType.Number },
        },
        SkillsIndexes: {
            required: false,
            type: FieldType.Array,
            items: { type: FieldType.Number },
        },
    };
}