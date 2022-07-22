package com.github.rasmussaks.hoardr.api

import com.github.rasmussaks.hoardr.domain.Category
import com.github.rasmussaks.hoardr.domain.event.CategoryEvent
import java.time.Instant

class CategoryDto(
    val id: Long,
    val name: String,
    val parent: CategoryReference?,
    val children: List<CategoryReference>,
    val events: List<CategoryEventDto>,
    val properties: List<PropertyDto>
)

class CategoryEventDto(
    val item: CategoryReference,
    type: String,
    data: Map<String, Any?>,
    id: Long,
    createdDate: Instant
) : BaseEventDto(
    type = type,
    data = data,
    id = id,
    createdDate = createdDate
)

fun CategoryEvent.toDto(): CategoryEventDto {
    return CategoryEventDto(
        item = this.category.toReference(),
        type = this.type.name,
        data = this.data,
        id = this.id,
        createdDate = this.createdDate.toInstant()
    )
}

fun Category.toDto(): CategoryDto {
    return CategoryDto(
        id = this.id,
        name = this.name,
        parent = this.parent?.toReference(),
        children = this.children.map { it.toReference() },
        events = this.events.map { it.toDto() },
        properties = this.properties.map { it.toDto() }
    )
}

fun Category.toReference(): CategoryReference {
    return CategoryReference(id = this.id)
}

class CategoryReference(
    val id: Long
)
