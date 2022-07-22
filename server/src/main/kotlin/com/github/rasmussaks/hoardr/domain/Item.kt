package com.github.rasmussaks.hoardr.domain

import com.github.rasmussaks.hoardr.domain.event.ItemEvent
import com.github.rasmussaks.hoardr.domain.event.propertyValueUpdatedEvent
import com.github.rasmussaks.hoardr.storage.PropertyValueRepository
import javax.persistence.*

@Entity
class Item(
    var name: String,
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

    fun setPropertyValue(property: Property, newValue: String?, propertyValueRepository: PropertyValueRepository) {
        val propertyValue = propertyValues.find { it.property.id == property.id }
        val oldValue = propertyValue?.value
        if (propertyValue == null && newValue == null) {
            return
        }
        if (propertyValue == null) {
            propertyValues.add(PropertyValue(newValue!!, property, this))
        } else {
            if (newValue.isNullOrEmpty()) {
                propertyValues.removeIf { it.id == propertyValue.id }
                propertyValueRepository.delete(propertyValue)
            } else {
                propertyValue.value = newValue
            }
        }
        events.add(this.propertyValueUpdatedEvent(oldValue, newValue, property))
    }
}
