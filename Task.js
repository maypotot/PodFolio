import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

const STATUS_COMPLETED = 'https://schema.org/CompletedActionStatus';
const STATUS_POTENTIAL = 'https://schema.org/PotentialActionStatus';

export default class Task extends SolidModel {
    static rdfContext = 'https://schema.org/';
    static rdfsClass = 'Action';
    static fields = {
        description: {
            required: true,
            type: FieldType.String,
        },
        status: {
            type: FieldType.Key,
            rdfProperty: 'actionStatus',
        },
    };

    get done() {
        return this.status === STATUS_COMPLETED;
    }

    async toggle(done) {
        if (typeof done === 'boolean') {
            done = !done;
        }

        if (done ?? this.done) {
            await this.update({ status: STATUS_POTENTIAL });

            return;
        }

        await this.update({ status: STATUS_COMPLETED });
    }
}