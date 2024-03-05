/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Clearing database
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.customer.deleteMany({});

  // Create random categories
  for (let i = 0; i < 10; i += 1) {
    await prisma.category.create({
      data: {
        name: faker.commerce.department(),
        description: faker.commerce.productDescription(),
      },
    });
  }

  // Create random products and assign them to random categories
  const categories = await prisma.category.findMany();
  for (let i = 0; i < 50; i += 1) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.datatype.number({ min: 0, max: 100 }),
        category: {
          connect: { id: categories[Math.floor(Math.random() * categories.length)].id },
        },
      },
    });
  }

  // Create random customers
  for (let i = 0; i < 20; i += 1) {
    await prisma.customer.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
    });
  }

  // Create random orders and order items
  const customers = await prisma.customer.findMany();
  const products = await prisma.product.findMany();

  for (const customer of customers) {
    const order = await prisma.order.create({
      data: {
        customer: {
          connect: { id: customer.id },
        },
        total: 0, // initially 0, will be updated later
        status: faker.helpers.arrayElement(['processing', 'shipped', 'delivered']),
      },
    });

    let total = 0;
    for (let j = 0; j < faker.datatype.number({ min: 1, max: 5 }); j += 1) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = faker.datatype.number({ min: 1, max: 3 });
      const price = product.price * quantity;
      total += price;

      await prisma.orderItem.create({
        data: {
          order: {
            connect: { id: order.id },
          },
          product: {
            connect: { id: product.id },
          },
          quantity,
          price,
        },
      });
    }

    // Update the total price of the order
    await prisma.order.update({
      where: { id: order.id },
      data: { total },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
