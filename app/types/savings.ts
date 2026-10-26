export interface Deposit {
    id: string
    amount: number
    note: string
    createdAt: string
}

export interface Goal {
    id: string
    name: string
    target: number
    deadline: string | null
    createdAt: string
    deposits: Deposit[]
}
