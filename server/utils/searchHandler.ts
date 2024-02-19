
const getLimit = (limit: unknown): number => {
    if (typeof limit !== "number" || limit > 100 || limit < 0) {
        // defaults to 10 if not meet the criteria
        return 10
    }

    return limit
}

export {
    getLimit
}