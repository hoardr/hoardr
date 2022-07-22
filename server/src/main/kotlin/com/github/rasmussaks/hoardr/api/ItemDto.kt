package com.github.rasmussaks.hoardr.api

import com.github.rasmussaks.hoardr.domain.Item
import com.github.rasmussaks.hoardr.domain.event.ItemEvent
import java.time.Instant

class ItemDto(
    val id: Long,
    val name: String,
    val quantity: Long,
    val category: CategoryReference,
    val location: LocationReference,
    val events: List<ItemEventDto>,
)

class ItemEventDto(
    val item: ItemReference,
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

fun ItemEvent.toDto(): ItemEventDto {
    return ItemEventDto(
        item = this.item.toReference(),
        type = this.type.name,
        data = this.data,
        id = this.id,
        createdDate = this.createdDate.toInstant()
    )
}

fun Item.toDto(): ItemDto {
    return ItemDto(
        id = this.id,
        name = this.name,
        quantity = this.quantity,
        category = this.category.toReference(),
        location = this.location.toReference(),
        events = this.events.map { it.toDto() }
    )
}

fun Item.toReference(): ItemReference {
    return ItemReference(
        id = this.id
    )
}


class ItemReference(
    val id: Long
)
