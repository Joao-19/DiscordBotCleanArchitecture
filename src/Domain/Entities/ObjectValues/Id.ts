export class Id {
    readonly id: number;
    constructor(id: number) {
        this.id = id;
    }
}

export class SnowflakeId {
    id: string;
    constructor(id: string) {
        this.id = id;
    }

    static fromString(id: string): SnowflakeId {
        return new SnowflakeId(id);
    }
}