export class WFMEvent {
    constructor(
        public type: string,
        public amount: string,
        public category: number,
        public description: string,
        public date: string,
        public id?: number,
        public catName?: string
    ) {}
}