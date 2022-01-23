package com.github.rasmussaks.hoardr.graphql

import com.github.rasmussaks.hoardr.domain.Item
import com.github.rasmussaks.hoardr.domain.QItem
import com.github.rasmussaks.hoardr.domain.event.createdEvent
import com.github.rasmussaks.hoardr.graphql.input.AddItemInput
import com.github.rasmussaks.hoardr.graphql.input.SetPropertyValueInput
import com.github.rasmussaks.hoardr.storage.*
import com.querydsl.core.BooleanBuilder
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional

@Controller
@Transactional
class ItemController(
    private val itemRepository: ItemRepository,
    private val categoryRepository: CategoryRepository,
    private val locationRepository: LocationRepository,
    private val propertyRepository: PropertyRepository,
    private val propertyValueRepository: PropertyValueRepository,
) {
    @QueryMapping
    fun items(@Argument id: Long?, @Argument name: String?, @Argument categoryId: Long?): Iterable<Item> {
        val predicate = BooleanBuilder(ONE_EQUALS_ONE)
        id?.let { predicate.and(QItem.item.id.eq(it)) }
        name?.let { predicate.and(QItem.item.name.lower().like("%${it}%")) }
        categoryId?.let { predicate.and(QItem.item.category.id.eq(it)) }
        return itemRepository.findAll(predicate.value!!)
    }

    @MutationMapping
    fun addItem(@Argument input: AddItemInput): Item {
        val item = Item(
            name = input.name,
            category = categoryRepository.getReferenceById(input.categoryId),
            location = locationRepository.getReferenceById(input.locationId)
        )
        item.events.add(item.createdEvent())
        return itemRepository.save(item)
    }

    @MutationMapping
    fun setPropertyValue(@Argument input: SetPropertyValueInput): Item {
        val item = itemRepository.getReferenceById(input.itemId)
        val property = propertyRepository.getReferenceById(input.propertyId)
        item.setPropertyValue(property, input.value, propertyValueRepository)
        return itemRepository.save(item)
    }
}
