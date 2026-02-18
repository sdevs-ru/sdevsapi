export class Role {
    constructor(
        public readonly id: string,
        public code: string,      // ADMIN (уникальный)
        public name: string,      // Administrator (display)
        public readonly isSystem: boolean = false,
    ) { }

    rename(name: string) {
        if (this.isSystem) {
            throw new Error('System role cannot be renamed');
        }
        this.name = name;
    }
}
