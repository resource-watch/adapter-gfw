class FieldSerializer {

    static serialize(data: Record<string, any>[]): Record<string, any> {
        return {
            fields: data
        };
    }
}

export default FieldSerializer;
