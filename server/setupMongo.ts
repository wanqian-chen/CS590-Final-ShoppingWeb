import { MongoClient, ObjectId } from 'mongodb'
import { Operator, Customer, MenuItem } from './data'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const operators: Operator[] = [
  {
    _id: "jim",
    name: "Jim",
  },
  {
    _id: "mary",
    name: "Mary",
  },
  {
    _id: "john",
    name: "John"
  }
]

const menuItems: MenuItem[] = [
  {
    itemId: "smoothie",
    ingredientChoices: [
      "strawberry",
      "apple",
      "banana"
    ]
  },
  {
    itemId: "milk",
    ingredientChoices: [
      "whole",
      "low fat"
    ]
  },
  {
    itemId: "coffee",
    ingredientChoices: [
      "latte",
      "america"
    ]
  }
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // set up unique index for upsert -- to make sure a customer cannot have more than one draft order
  db.collection("orders").createIndex(
    { customerId: 1 }, 
    { unique: true, partialFilterExpression: { state: "draft" } }
  )

  // add data
  console.log("inserting operators", await db.collection("operators").insertMany(operators as any))
  console.log("inserting menu", await db.collection("menu").insertMany(menuItems as any))

  process.exit(0)
}

main()
