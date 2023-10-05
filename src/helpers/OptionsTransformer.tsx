
export class OptionsTransformer {
    obj: {[key: string]: any};
    constructor(obj: Object) {
        this.obj = obj;
    }
    get() {
        const out = [];
        for (const key in this.obj) {
            if (this.obj.hasOwnProperty(key)) {
              const label = this.obj[key];
              out.push({value: key, label: label});
            }
        }
        return out;
    };
};
