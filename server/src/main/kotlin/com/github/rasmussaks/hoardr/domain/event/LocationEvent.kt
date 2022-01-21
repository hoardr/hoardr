package com.github.rasmussaks.hoardr.domain.event

import com.github.rasmussaks.hoardr.domain.Location
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.ManyToOne

@Entity
class LocationEvent(
    @ManyToOne(fetch = FetchType.LAZY)
    var location: Location,
    type: LocationEventType,
    dataObject: Map<String, Any?>
) : AbstractEvent<LocationEventType>(type, dataObject)

enum class LocationEventType {
    CREATED, PARENT_CHANGED, CHILD_LOCATION_REMOVED, CHILD_LOCATION_ADDED,
}

fun Location.event(type: LocationEventType, dataBuildAction: MutableMap<String, Any?>.() -> Unit): LocationEvent {
    return LocationEvent(this, type, buildMap(dataBuildAction))
}

fun Location.createdEvent(): LocationEvent {
    return event(LocationEventType.CREATED) {
        this["name"] = name
        this["parentId"] = parent?.id
    }
}

fun Location.parentChangedEvent(oldParent: Location?, newParent: Location?): LocationEvent {
    return event(LocationEventType.PARENT_CHANGED) {
        this["oldParentId"] = oldParent?.id
        this["newParentId"] = newParent?.id
    }
}

fun Location.childLocationRemovedEvent(child: Location): LocationEvent {
    return event(LocationEventType.CHILD_LOCATION_REMOVED) {
        this["childId"] = child.id
    }
}

fun Location.childLocationAddedEvent(child: Location): LocationEvent {
    return event(LocationEventType.CHILD_LOCATION_ADDED) {
        this["childId"] = child.id
    }
}
