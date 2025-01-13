import { prisma } from '../config/database';
import { Documentation as PrismaDocumentation, Prisma } from '@prisma/client';

export type Documentation = PrismaDocumentation;
type DocumentationCreateInput = Prisma.DocumentationUncheckedCreateInput;
type DocumentationUpdateInput = Prisma.DocumentationUncheckedUpdateInput;
type DocumentationWhereInput = Prisma.DocumentationWhereInput;

export const Documentation = {
  create: async (data: DocumentationCreateInput): Promise<Documentation> => {
    return prisma.documentation.create({
      data,
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  findById: async (id: string): Promise<Documentation | null> => {
    return prisma.documentation.findUnique({
      where: { id },
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  findByTitle: async (title: string): Promise<Documentation | null> => {
    return prisma.documentation.findFirst({
      where: { title },
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  findMany: async (where: DocumentationWhereInput = {}): Promise<Documentation[]> => {
    return prisma.documentation.findMany({
      where,
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  update: async (id: string, data: DocumentationUpdateInput): Promise<Documentation> => {
    return prisma.documentation.update({
      where: { id },
      data,
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  delete: async (id: string): Promise<Documentation> => {
    return prisma.documentation.delete({
      where: { id },
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  findByCategory: async (category: string): Promise<Documentation[]> => {
    return prisma.documentation.findMany({
      where: { category },
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  findByTags: async (tags: string[]): Promise<Documentation[]> => {
    return prisma.documentation.findMany({
      where: {
        tags: {
          hasEvery: tags
        }
      },
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  },

  search: async (query: string): Promise<Documentation[]> => {
    return prisma.documentation.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } }
        ]
      },
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true
      }
    });
  }
};
