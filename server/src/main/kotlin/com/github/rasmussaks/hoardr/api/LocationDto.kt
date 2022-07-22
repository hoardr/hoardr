package com.github.rasmussaks.hoardr.api

import com.github.rasmussaks.hoardr.domain.Location
import com.github.rasmussaks.hoardr.domain.event.LocationEvent
import java.time.Instant

class LocationDto(
    val id: Long,
    val name: String,
    val parent: LocationReference?,
    val children: List<LocationReference>,
    val items: List<ItemReference>,
    val events: List<LocationEventDto>
)

class LocationEventDto(
    val item: LocationReference,
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

fun LocationEvent.toDto(): LocationEventDto {
    return LocationEventDto(
        item = this.location.toReference(),
        type = this.type.name,
        data = this.data,
        id = this.id,
        createdDate = this.createdDate.toInstant()
    )
}

fun Location.toDto(): LocationDto {
    return LocationDto(
        id = this.id,
        name = this.name,
        parent = this.parent?.toReference(),
        children = this.children.map { it.toReference() },
        items = this.items.map { it.toReference() },
        events = this.events.map { it.toDto() }
    )
}

fun Location.toReference(): LocationReference {
    return LocationReference(id = this.id)
}

class LocationReference(
    val id: Long
)
