const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const supplier = await prisma.supplier.create({
    data: {
      name: 'Ushop Wholesale',
      leadTime: 3,
      minOrderValue: 100,
      deliveryDays: 'Mon, Thu',
      email: 'wholesale@ushop.com',
    },
  });

  await prisma.product.create({
    data: {
      name: 'Fresh Milk 1L',
      barcode: '123456789',
      category: 'Dairy',
      costPrice: 0.8,
      sellingPrice: 1.2,
      currentStock: 10,
      minStockLevel: 5,
      supplierId: supplier.id,
      image: 'https://images.unsplash.com/photo-1563636619-e910ef2a844b?auto=format&fit=crop&q=80&w=200',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
