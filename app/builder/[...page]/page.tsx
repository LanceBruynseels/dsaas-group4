'use client'
import { builder } from '@builder.io/react'
import { RenderBuilderContent } from '@/components/builder'
import { useEffect, useState } from 'react'

// your PI key
builder.init('ab2c2ceb389045f397e3deaac91c4b88')

interface PageProps {
    params: {
        page: string[]
    }
}

export default function Page(props: PageProps) {
    const [content, setContent] = useState(null)

    useEffect(() => {
        const path = '/' + (props.params?.page?.join('/') || '')
        builder.get('page', { url: path })
            .promise()
            .then(setContent)
    }, [props.params?.page])

    return content && <RenderBuilderContent content={content} />
}