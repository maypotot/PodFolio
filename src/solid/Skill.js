import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class Skill extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'foaf:Person';
    static fields = {
        Skill: {
            required: true,
            type: FieldType.String,
        },
        SkillIndex: {
            required: true,
            type: FieldType.Number,
        }
    };

}