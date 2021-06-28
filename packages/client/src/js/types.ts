export declare namespace API {   
    export type Paginated<T> = {
        meta: {
            currentPage: number,
            totalPages: number
        },
        items: T[]
    }

    export type PageIndex = {
        url: string
    }
}
