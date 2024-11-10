'use client'
import { BuilderComponent, useIsPreviewing } from '@builder.io/react'
import { builder } from '@builder.io/react'

interface BuilderContentProps {
    content: any
}

export function RenderBuilderContent({ content }: BuilderContentProps) {
    const isPreviewing = useIsPreviewing()

    return (
        <BuilderComponent
            content={content}
            model="page"
        />
    )
}