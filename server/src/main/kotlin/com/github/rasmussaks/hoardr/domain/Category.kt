package com.github.rasmussaks.hoardr.domain

import com.github.rasmussaks.hoardr.domain.event.*
import javax.persistence.*

@Entity
class Category(
    var name: String,
    @ManyToOne(fetch = FetchType.LAZY)
    var parent: Category? = null
) : BaseEntity() {
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "parent")
    var children: MutableList<Category> = mutableListOf()

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "category_property",
        joinColumns = [JoinColumn(name = "category_id")],
        inverseJoinColumns = [JoinColumn(name = "property_id")]
    )
    var properties: MutableList<Property> = mutableListOf()

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "category", cascade = [CascadeType.ALL])
    @OrderBy
    var events: MutableList<CategoryEvent> = mutableListOf()

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "category")
    var items: MutableList<Item> = mutableListOf()

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    fun addProperty(property: Property) {
        properties.add(property)
        events.add(propertyAddedEvent(property))
    }

    fun removeProperty(property: Property) {
        if (properties.any { it.id == property.id }) {
            properties.removeIf { it.id == property.id }
            events.add(propertyRemovedEvent(property))
        }
    }

    @JvmName("setParentCategory")
    fun setParent(newParent: Category?) {
        val oldParent = parent
        if (oldParent?.id != newParent?.id) {
            parent = newParent
            events.add(parentChangedEvent(oldParent, newParent))
            oldParent?.events?.add(oldParent.childCategoryRemovedEvent(this))
            newParent?.events?.add(newParent.childCategoryAddedEvent(this))
        }
    }

    fun getAllParents(): List<Category> {
        return generateSequence(parent) { it.parent }.toList()
    }

    fun getAllItems(): List<Item> {
        val result = mutableListOf<Item>()
        result.addAll(items)
        children.forEach {
            result.addAll(it.getAllItems())
        }
        return result
    }
}

