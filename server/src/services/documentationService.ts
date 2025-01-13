import { Documentation } from '@prisma/client';
import { prisma } from '../config/database';
import { SearchResult } from '../types/search';

export type { Documentation };

interface CreateDocumentationInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdBy: string;
  relatedDocIds?: string[];
}

interface UpdateDocumentationInput {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  relatedDocIds?: string[];
}

export async function createDocumentation(input: CreateDocumentationInput): Promise<Documentation> {
  const { relatedDocIds, ...data } = input;
  
  return prisma.documentation.create({
    data: {
      ...data,
      relatedDocs: relatedDocIds ? {
        connect: relatedDocIds.map(id => ({ id })),
      } : undefined,
    },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
  });
}

export async function getDocumentation(id: string): Promise<Documentation | null> {
  return prisma.documentation.findUnique({
    where: { id },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
  });
}

export async function updateDocumentation(id: string, input: UpdateDocumentationInput): Promise<Documentation> {
  const { relatedDocIds, ...data } = input;

  return prisma.documentation.update({
    where: { id },
    data: {
      ...data,
      relatedDocs: relatedDocIds ? {
        set: relatedDocIds.map(id => ({ id })),
      } : undefined,
    },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
  });
}

export async function deleteDocumentation(id: string): Promise<Documentation> {
  return prisma.documentation.delete({
    where: { id },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
  });
}

export async function searchDocumentation(query: string): Promise<SearchResult[]> {
  try {
    const docs = await prisma.documentation.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      include: {
        user: true,
        relatedDocs: true,
        relatedTo: true,
      },
      orderBy: [
        { title: 'asc' },
      ],
    });

    return docs.map(doc => ({
      id: doc.id,
      type: 'documentation',
      title: doc.title,
      description: doc.content,
      score: 1, // PostgreSQL doesn't provide text search scores directly
      metadata: {
        category: doc.category,
        tags: doc.tags,
        createdBy: doc.user.username,
        relatedDocs: doc.relatedDocs.map(d => d.title),
      },
    }));
  } catch (error) {
    console.error('Search documentation error:', error);
    return [];
  }
}

export async function getDocumentationByUser(userId: string): Promise<Documentation[]> {
  return prisma.documentation.findMany({
    where: {
      createdBy: userId,
    },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getDocumentationByCategory(category: string): Promise<Documentation[]> {
  return prisma.documentation.findMany({
    where: {
      category,
    },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
    orderBy: {
      title: 'asc',
    },
  });
}

export async function getDocumentationByTags(tags: string[]): Promise<Documentation[]> {
  return prisma.documentation.findMany({
    where: {
      tags: {
        hasEvery: tags,
      },
    },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
    orderBy: {
      title: 'asc',
    },
  });
}

export async function getRelatedDocumentation(id: string): Promise<Documentation[]> {
  return prisma.documentation.findMany({
    where: {
      OR: [
        { relatedDocs: { some: { id } } },
        { relatedTo: { some: { id } } },
      ],
    },
    include: {
      user: true,
      relatedDocs: true,
      relatedTo: true,
    },
    orderBy: {
      title: 'asc',
    },
  });
}
