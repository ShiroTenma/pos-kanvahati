// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const PRODUCTS = [
  { name: "Nasi Goreng Spesial", price: 25000, category: "Makanan", image: "🍛" },
  { name: "Mie Ayam Bakso", price: 18000, category: "Makanan", image: "🍜" },
  { name: "Es Teh Manis", price: 5000, category: "Minuman", image: "🍹" },
  { name: "Kopi Susu Gula Aren", price: 15000, category: "Minuman", image: "☕" },
  { name: "Kentang Goreng", price: 12000, category: "Snack", image: "🍟" },
  { name: "Roti Bakar Coklat", price: 15000, category: "Snack", image: "🍞" },
  { name: "Ayam Geprek", price: 20000, category: "Makanan", image: "🍗" },
  { name: "Jus Alpukat", price: 18000, category: "Minuman", image: "🥑" },
];

async function main() {
  console.log('Mulai mengisi data...');
  for (const product of PRODUCTS) {
    await prisma.product.create({
      data: product,
    })
  }
  console.log('Selesai!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })