package com.github.rasmussaks.hoardr.domain.event

import com.github.rasmussaks.hoardr.domain.Category
import com.github.rasmussaks.hoardr.domain.Property
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.ManyToOne

@Entity
class CategoryEvent(
    @ManyToOne(fetch = FetchType.LAZY)
    var category: Category,
    type: CategoryEventType,
    dataObject: Map<String, Any?>
) : AbstractEvent<CategoryEventType>(type, dataObject)

enum class CategoryEventType {
    CREATED, PROPERTY_ADDED, PROPERTY_REMOVED, PARENT_CHANGED, CHILD_CATEGORY_REMOVED, CHILD_CATEGORY_ADDED
}

fun Category.event(type: CategoryEventType, dataBuildAction: MutableMap<String, Any?>.() -> Unit): CategoryEvent {
    return CategoryEvent(this, type, buildMap(dataBuildAction))
}

fun Category.createdEvent(): CategoryEvent {
    return event(CategoryEventType.CREATED) {
        this["name"] = name
        this["parentId"] = parent?.id
    }
}

fun Category.propertyAddedEvent(property: Property): CategoryEvent {
    return event(CategoryEventType.PROPERTY_ADDED) {
        this["propertyId"] = property.id
    }
}

fun Category.propertyRemovedEvent(property: Property): CategoryEvent {
    return event(CategoryEventType.PROPERTY_REMOVED) {
        this["propertyId"] = property.id
    }
}

fun Category.parentChangedEvent(oldParent: Category?, newParent: Category?): CategoryEvent {
    return event(CategoryEventType.PARENT_CHANGED) {
        this["oldParentId"] = oldParent?.id
        this["newParentId"] = newParent?.id
    }
}

fun Category.childCategoryRemovedEvent(child: Category): CategoryEvent {
    return event(CategoryEventType.CHILD_CATEGORY_REMOVED) {
        this["childId"] = child.id
    }
}

fun Category.childCategoryAddedEvent(child: Category): CategoryEvent {
    return event(CategoryEventType.CHILD_CATEGORY_ADDED) {
        this["childId"] = child.id
    }
}
