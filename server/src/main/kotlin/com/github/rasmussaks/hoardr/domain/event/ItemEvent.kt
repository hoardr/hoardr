package com.github.rasmussaks.hoardr.domain.event

import com.github.rasmussaks.hoardr.domain.Item
import com.github.rasmussaks.hoardr.domain.Property
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.ManyToOne

@Entity
class ItemEvent(
    @ManyToOne(fetch = FetchType.LAZY)
    var item: Item,
    type: ItemEventType,
    dataObject: Map<String, Any?>
) : AbstractEvent<ItemEventType>(type, dataObject)

enum class ItemEventType {
    CREATED, PROPERTY_VALUE_UPDATED
}

fun Item.event(type: ItemEventType, dataBuildAction: MutableMap<String, Any?>.() -> Unit): ItemEvent {
    return ItemEvent(this, type, buildMap(dataBuildAction))
}

fun Item.createdEvent(): ItemEvent {
    return event(ItemEventType.CREATED) {
        this["categoryId"] = category.id
        this["locationId"] = location.id
        this["name"] = name
    }
}

fun Item.propertyValueUpdatedEvent(oldValue: String?, newValue: String?, property: Property): ItemEvent {
    return event(ItemEventType.PROPERTY_VALUE_UPDATED) {
        this["propertyId"] = property.id
        this["oldValue"] = oldValue
        this["newValue"] = newValue
    }
}
