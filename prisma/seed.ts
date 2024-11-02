import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      // Create the user first
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.firstName(),
          status: 'active',
        },
      });

      // Create posts for the user
      await Promise.all(
        Array.from({ length: Math.floor(Math.random() * 13) + 1 }).map(
          async () => {
            const techTitle = faker.helpers.arrayElement([
              'Understanding the Basics of Next.js for Beginners',
              'The Power of TypeScript in Modern Web Development',
              'How to Improve Your React Performance with Hooks',
              'Exploring the World of Microservices with Node.js',
              'Building Scalable Applications Using Prisma and PostgreSQL',
              'Top 10 JavaScript Frameworks to Learn in 2024',
              'A Guide to Authentication in Next.js with JWT',
              'Mastering CSS Grid and Flexbox for Responsive Design',
              'SEO Tips for Improving Visibility on Your Tech Blog',
              'An Introduction to GraphQL with Apollo Client',
              'Building REST APIs with Express and NestJS',
              'Using Docker for Efficient Development and Deployment',
              'Best Practices for State Management in React',
            ]);

            const techMetaDescription = faker.helpers.arrayElement([
              'Learn the essentials of Next.js and how it simplifies server-side rendering in React applications.',
              'Explore how TypeScript enhances code quality and scalability in JavaScript projects.',
              'Discover tips on optimizing your React components with Hooks to boost app performance.',
              'Understand the key concepts behind microservices and their advantages in Node.js applications.',
              'Get insights on how to build scalable backend services using Prisma ORM with PostgreSQL.',
              'A quick overview of popular JavaScript frameworks every developer should know in 2024.',
              'Step-by-step guide to implementing JWT-based authentication in Next.js.',
              'Learn to design responsive web layouts using CSS Grid and Flexbox.',
              'Essential SEO techniques to increase the reach and engagement of your tech blog.',
              'Introduction to GraphQL with Apollo Client for data-fetching in modern web apps.',
              'Comprehensive guide to building RESTful APIs with Express and NestJS.',
              'Optimize your development workflow with Docker for better application deployment.',
              'Effective state management techniques in React using modern libraries and best practices.',
            ]);

            const techContent = faker.helpers.arrayElement([
              'In this article, we dive into Next.js, a React framework for server-rendered applications. Learn how to set up a basic project, create pages, and fetch data from APIs.',
              'TypeScript is gaining popularity among JavaScript developers. This post explains why TypeScript is powerful, covering its static typing, interfaces, and how it integrates with popular frameworks.',
              'React performance can be significantly improved by using hooks like `useMemo` and `useCallback`. In this post, we share insights and code snippets to optimize your applications.',
              'Microservices allow you to build scalable, decoupled applications. Here, we explain microservice architecture and how to implement it using Node.js and Docker.',
              'Prisma offers a powerful ORM for Node.js developers. This tutorial walks you through connecting Prisma to PostgreSQL and using it to manage your database schema.',
              'JavaScript frameworks evolve constantly. This guide highlights the top frameworks, their use cases, and why they’re worth learning in the upcoming year.',
              'JWT (JSON Web Tokens) offers a secure way to handle authentication. We cover implementing JWT authentication in Next.js and protecting routes with middleware.',
              'Creating responsive layouts is essential in web development. This tutorial covers the differences between CSS Grid and Flexbox and when to use each.',
              'SEO is vital for blog visibility. We go over tips and tools you can use to optimize your blog content, making it more accessible to search engines.',
              'GraphQL offers flexibility over traditional REST APIs. This guide introduces you to GraphQL and how to use Apollo Client in your web applications.',
              'REST APIs are standard in backend development. Learn how to set up a RESTful API using Express.js and manage it efficiently with NestJS for better scalability.',
              'Docker simplifies development and deployment by containerizing applications. Here’s a beginner’s guide to using Docker in your development process.',
              'State management is a core aspect of React applications. We discuss common state management libraries and show examples of their use in complex apps.',
            ]);

            const post = await prisma.post.create({
              data: {
                title: techTitle,
                slug: faker.lorem.slug(),
                metaDescription: techMetaDescription,
                content: techContent,
                published: faker.datatype.boolean(),
                authorId: user.id, // Link post to the user
              },
            });

            // Create comments for the post
            await Promise.all(
              Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map(
                async () => {
                  await prisma.comment.create({
                    data: {
                      content: faker.lorem.sentence(),
                      status: 'approved',
                      postId: post.id, // Link comment to the post
                      userId: user.id, // Link comment to the user
                    },
                  });
                },
              ),
            );

            return post;
          },
        ),
      );

      return user;
    }),
  );

  console.log({ users });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
