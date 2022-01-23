package com.github.rasmussaks.hoardr.graphql

import com.github.rasmussaks.hoardr.domain.Property
import com.github.rasmussaks.hoardr.domain.QProperty
import com.github.rasmussaks.hoardr.graphql.input.AddPropertyInput
import com.github.rasmussaks.hoardr.storage.CategoryRepository
import com.github.rasmussaks.hoardr.storage.PropertyRepository
import com.querydsl.core.BooleanBuilder
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional

@Controller
@Transactional
class PropertyController(
    private val propertyRepository: PropertyRepository,
    private val categoryRepository: CategoryRepository,
) {
    @QueryMapping
    fun properties(@Argument id: Long?, @Argument name: String?): Iterable<Property> {
        val predicate = BooleanBuilder(ONE_EQUALS_ONE)
        id?.let { predicate.and(QProperty.property.id.eq(it)) }
        name?.let { predicate.and(QProperty.property.name.lower().like("%${it}%")) }
        return propertyRepository.findAll(predicate.value!!)
    }

    @MutationMapping
    fun addProperty(
        @Argument input: AddPropertyInput
    ): Property {
        val property = propertyRepository.save(
            Property(
                name = input.name,
                type = input.type
            )
        )
        if (input.categoryId != null) {
            val category = categoryRepository.getReferenceById(input.categoryId)
            category.addProperty(property)
            categoryRepository.save(category)
        }
        return property
    }
}
