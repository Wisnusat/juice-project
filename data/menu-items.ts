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
  tag: string
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
    tag: "savory"
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
    tag: "savory"
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
    tag: "sour"
  },
} 