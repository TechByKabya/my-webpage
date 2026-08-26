import type { Post, Project, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs, relationTo } = props

  const limit = limitFromProps || 3
  const isProjects = relationTo === 'projects'

  let posts: Post[] = []
  let projects: Project[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    if (isProjects) {
      const fetchedProjects = await payload.find({
        collection: 'projects',
        depth: 1,
        limit,
      })
      projects = fetchedProjects.docs as Project[]
    } else {
      const flattenedCategories = categories?.map((category) => {
        if (typeof category === 'object') return category.id
        else return category
      })

      const fetchedPosts = await payload.find({
        collection: 'posts',
        depth: 1,
        limit,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? {
              where: {
                categories: {
                  in: flattenedCategories,
                },
              },
            }
          : {}),
      })
      posts = fetchedPosts.docs as Post[]
    }
  } else {
    if (selectedDocs?.length) {
      if (isProjects) {
        projects = selectedDocs.map((doc) => {
          if (typeof doc.value === 'object') return doc.value as Project
        }).filter(Boolean) as Project[]
      } else {
        posts = selectedDocs.map((doc) => {
          if (typeof doc.value === 'object') return doc.value as Post
        }).filter(Boolean) as Post[]
      }
    }
  }

  return (
    <div className="my-24" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-12">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      
      {isProjects ? (
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                {project.coverImage && typeof project.coverImage !== 'string' && typeof project.coverImage !== 'number' && (
                  <img 
                    src={project.coverImage.url || ''} 
                    alt={project.title} 
                    className="w-full h-48 object-cover border-b border-white/10"
                  />
                )}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                  <div className="flex gap-4 pt-2">
                    {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                        Live Demo &rarr;
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank" className="text-xs font-medium text-gray-300 hover:text-white">
                        GitHub &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full w-full p-12 rounded-2xl bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center text-center">
                <p className="text-gray-400">No projects yet.</p>
                <p className="text-sm text-gray-500">Add some in the CMS admin dashboard!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <CollectionArchive posts={posts} />
      )}
    </div>
  )
}
