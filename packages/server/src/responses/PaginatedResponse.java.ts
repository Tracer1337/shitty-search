export default class PaginatedResponse<T> {
    private items: T[]
    private page: number
    private itemsPerPage: number
    
    constructor(values: {
        items: T[],
        page: number,
        itemsPerPage: number
    }) {
        this.items = values.items
        this.page = values.page
        this.itemsPerPage = values.itemsPerPage
    }

    private getAmountOfPages() {
        return Math.ceil(this.items.length / this.itemsPerPage)
    }

    private paginate() {
        return this.items.slice(
            this.itemsPerPage * this.page,
            this.itemsPerPage * (this.page + 1)
        )
    }

    toJSON() {
        return {
            meta: {
                currentPage: this.page + 1,
                totalPages: this.getAmountOfPages()
            },
            data: this.paginate()
        }
    }
}
