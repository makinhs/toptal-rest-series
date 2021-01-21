export interface CRUD {
    list: (limit: number, page: number) => Promise<any>,
    create: (resource: any) => Promise<any>,
    updateById: (id: string, resource: any) => Promise<string>,
    readById: (resourceId: any) => Promise<any>,
    deleteById: (resourceId: any) => Promise<string>,
    patchById: (id: string, resource: any) => Promise<string>,
}