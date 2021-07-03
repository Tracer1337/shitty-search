export declare namespace API {
    export type PerformanceResponse<T> = {
        meta: {
            duration: number,
            size: number
        },
        data: T
    }

    export type PaginatedResponse<T> = {
        meta: {
            currentPage: number,
            totalPages: number
        },
        data: T[]
    }

    export type PageIndex = {
        url: string,
        title: string
    }

    export type SearchResponse = PerformanceResponse<PaginatedResponse<PageIndex>>
}
