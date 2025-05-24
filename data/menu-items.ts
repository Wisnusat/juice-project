export interface Topping {
  id: string
  name: string
  image: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  fullDescription: string
  weight: string
  calories: string
  price: number
  vitamins: string
  image: string
  rating: number
  toppings: Topping[]
}

export const menuItems: Record<string, MenuItem> = {
  "waldorf-salad": {
    id: "waldorf-salad",
    name: "Waldorf Salad",
    description: "Apel merah, anggur merah & hijau, seledri, kenari, yogurt, mayones rendah lemak.",
    fullDescription:
      "Dibalut saus creamy yang lembut, memadukan manisnya apel dan anggur segar dengan kerenyahan seledri dan kenari panggang. Setiap suapan menghadirkan rasa segar, gurih.",
    weight: "250 g",
    calories: "300 kcal",
    price: 80000,
    vitamins: "Vit C, A, E",
    image: "/assets/waldorf_salad.svg",
    rating: 4.5,
    toppings: [
      { id: "walnut", name: "Walnut", image: "/assets/toppings/walnut.png", price: 5000 },
      { id: "onion", name: "Red Onion", image: "/assets/toppings/onion.png", price: 3000 },
      { id: "tomato", name: "Cherry Tomato", image: "/assets/toppings/tomato.png", price: 4000 },
      { id: "spinach", name: "Spinach", image: "/assets/toppings/spinach.png", price: 3000 },
      { id: "pineapple", name: "Pineapple", image: "/assets/toppings/pineapple.png", price: 5000 },
    ],
  },
  "greek-salad": {
    id: "greek-salad",
    name: "Greek Salad",
    description: "Tomat, mentimun, paprika, bawang merah, zaitun hitam, keju feta, olive oil",
    fullDescription:
      "Kombinasi segar tomat ranum, mentimun renyah, paprika manis, bawang merah, zaitun hitam, dan keju feta yang gurih. Disiram olive oil extra virgin yang memberikan aroma khas mediterania.",
    weight: "280 g",
    calories: "220 kcal",
    price: 85000,
    vitamins: "Vit A, C, K",
    image: "/assets/greek_salad.png",
    rating: 4.7,
    toppings: [
      { id: "feta", name: "Extra Feta", image: "/assets/toppings/feta.png", price: 8000 },
      { id: "onion", name: "Red Onion", image: "/assets/toppings/onion.png", price: 3000 },
      { id: "olive", name: "Kalamata Olive", image: "/assets/toppings/olive.png", price: 6000 },
      { id: "cucumber", name: "Cucumber", image: "/assets/toppings/cucumber.png", price: 3000 },
      { id: "pepper", name: "Bell Pepper", image: "/assets/toppings/pepper.png", price: 4000 },
    ],
  },
  "italian-pasta-salad": {
    id: "italian-pasta-salad",
    name: "Italian Pasta Salad",
    description: "Pasta, tomat ceri, paprika, bawang merah, mozzarella, kemangi, zaitun.",
    fullDescription:
      "Pasta al dente dipadukan dengan tomat ceri segar, paprika warna-warni, bawang merah, mozzarella lembut, daun kemangi aromatik, dan zaitun. Dressing Italian herbs memberikan cita rasa khas Italia yang menyegarkan.",
    weight: "300 g",
    calories: "350 kcal",
    price: 90000,
    vitamins: "Vit A, C",
    image: "/assets/pasta_salad.svg",
    rating: 4.6,
    toppings: [
      { id: "mozzarella", name: "Mozzarella", image: "/assets/toppings/cheese.png", price: 7000 },
      { id: "onion", name: "Red Onion", image: "/assets/toppings/onion.png", price: 3000 },
      { id: "tomato", name: "Cherry Tomato", image: "/assets/toppings/tomato.png", price: 4000 },
      { id: "basil", name: "Fresh Basil", image: "/assets/toppings/basil.png", price: 3000 },
      { id: "olive", name: "Black Olive", image: "/assets/toppings/olive.png", price: 5000 },
    ],
  },
} 