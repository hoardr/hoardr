package com.github.rasmussaks.hoardr.domain

import com.github.rasmussaks.hoardr.domain.event.ItemEvent
import com.github.rasmussaks.hoardr.domain.event.propertyValueUpdatedEvent
import javax.persistence.*

@Entity
class Item(
    var name: String? = null,
    val quantity: Long = 1,
    @ManyToOne(fetch = FetchType.LAZY)
    var category: Category,
    @ManyToOne(fetch = FetchType.LAZY)
    var location: Location,
) : BaseEntity() {
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "item", cascade = [CascadeType.ALL])
    var propertyValues: MutableList<PropertyValue> = mutableListOf()
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "item", cascade = [CascadeType.ALL])
    var events: MutableList<ItemEvent> = mutableListOf()
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @Transient
    fun getAllCategories(): List<Category> {
        return generateSequence(category) { it.parent }.toList()
    }

    @Transient
    fun getAllProperties(): List<ItemProperty> {
        return generateSequence(category) { it.parent }
            .flatMap { it.properties.map { p -> ItemProperty(this, p, it) } }
            .toList()
    }

    fun setPropertyValue(property: Property, newValue: String) {
        val propertyValue = propertyValues.find { it.id == property.id }
        if (propertyValue == null) {
            propertyValues.add(PropertyValue(newValue, property, this))
        } else {
            propertyValue.value = newValue
        }
        events.add(this.propertyValueUpdatedEvent(propertyValue?.value, newValue, property))
    }
}
