// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const PRODUCTS = [
  { name: "Nasi Goreng Spesial", price: 25000, category: "Makanan", image: "https://placehold.co/400x400/facc15/333?text=Nasi+Goreng", quantity: 100 },
  { name: "Mie Ayam Bakso", price: 18000, category: "Makanan", image: "https://placehold.co/400x400/fb923c/333?text=Mie+Ayam", quantity: 100 },
  { name: "Es Teh Manis", price: 5000, category: "Minuman", image: "https://placehold.co/400x400/f87171/333?text=Es+Teh", quantity: 100 },
  { name: "Kopi Susu Gula Aren", price: 15000, category: "Minuman", image: "https://placehold.co/400x400/a3e635/333?text=Kopi+Susu", quantity: 100 },
  { name: "Kentang Goreng", price: 12000, category: "Snack", image: "https://placehold.co/400x400/fde047/333?text=Kentang", quantity: 100 },
  { name: "Roti Bakar Coklat", price: 15000, category: "Snack", image: "https://placehold.co/400x400/d97706/333?text=Roti+Bakar", quantity: 100 },
  { name: "Ayam Geprek", price: 20000, category: "Makanan", image: "https://placehold.co/400x400/ef4444/333?text=Ayam+Geprek", quantity: 100 },
  { name: "Jus Alpukat", price: 18000, category: "Minuman", image: "https://placehold.co/400x400/84cc16/333?text=Jus+Alpukat", quantity: 100 },
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