import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const dummyProducts = [
  {
    name: "iPhone 14 Pro",
    category: "Electronics",
    price: 999.99,
    description: "Latest iPhone with dynamic island and amazing camera system",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "Nike Air Max",
    category: "Sports",
    price: 129.99,
    salePrice: 99.99,
    saleEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    description: "Comfortable running shoes with air cushioning",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "The Alchemist",
    category: "Books",
    price: 14.99,
    description: "International bestseller by Paulo Coelho",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "Smart LED TV",
    category: "Electronics",
    price: 699.99,
    salePrice: 599.99,
    saleEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    description: "55-inch 4K Smart LED TV with HDR",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "Garden Tools Set",
    category: "Home & Garden",
    price: 49.99,
    description: "Complete set of essential garden tools",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "LEGO Star Wars Set",
    category: "Toys",
    price: 79.99,
    description: "Build your own Millennium Falcon",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "Face Serum",
    category: "Beauty",
    price: 29.99,
    description: "Anti-aging vitamin C serum",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "Car Wash Kit",
    category: "Automotive",
    price: 39.99,
    salePrice: 29.99,
    saleEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    description: "Complete car cleaning and detailing kit",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "Organic Coffee Beans",
    category: "Food",
    price: 19.99,
    description: "Premium organic coffee beans from Ethiopia",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
  {
    name: "Yoga Mat",
    category: "Sports",
    price: 24.99,
    description: "Non-slip eco-friendly yoga mat",
    imageUrl:
      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    createdAt: new Date(),
  },
];

export async function seedProducts() {
  try {
    for (const product of dummyProducts) {
      await addDoc(collection(db, "products"), product);
    }
    console.log("Successfully seeded products!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}
