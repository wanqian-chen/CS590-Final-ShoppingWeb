// export const possibleIngredients = [
//   "strawberry",
//   "milk",
//   "banana",
// ]


export interface MenuItem {
  itemId: string
  ingredientChoices: string[]
}

export interface DraftOrder {
  customerId: string
  // ingredients?: string[]
  allOrders?: object
}

export interface Order extends DraftOrder {
  _id: string
  state: "draft" | "queued" | "blending" | "done"
  operatorId?: string
  order: object
}

export interface Customer {
  _id: string
  name: string
}

export interface CustomerWithOrders extends Customer {
  orders: Order[]
}

export interface Operator {
  _id: string
  name: string
}