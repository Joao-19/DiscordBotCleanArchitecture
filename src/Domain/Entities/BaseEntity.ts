import  { Id, SnowflakeId } from "./ObjectValues/Id.js";

class BaseEntity<Identifier extends Id | SnowflakeId> {
    id: Identifier;
    constructor(id: Identifier) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}


export default BaseEntity;