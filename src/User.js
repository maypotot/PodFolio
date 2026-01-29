import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

export default class User extends SolidModel {
    static rdfContexts = {
        default: 'http://xmlns.com/foaf/0.1/',
        pim: 'http://www.w3.org/ns/pim/space#',
    };
    static rdfsClass = 'Person';
    static fields = {
        name: FieldType.String,
        storageUrl: {
            type: FieldType.Key,
            rdfProperty: 'pim:storage',
        },
    };
}