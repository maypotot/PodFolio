import { SolidContainer } from 'soukai-solid';

import Task from './Task';

export default class TasksList extends SolidContainer {
    tasksRelationship() {
        return this.contains(Task);
    }
}