package com.github.rasmussaks.hoardr.graphql

import com.github.rasmussaks.hoardr.domain.Property
import com.github.rasmussaks.hoardr.graphql.input.AddPropertyInput
import com.github.rasmussaks.hoardr.storage.CategoryRepository
import com.github.rasmussaks.hoardr.storage.PropertyRepository
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional

@Controller
@Transactional
class PropertyController(
    private val propertyRepository: PropertyRepository,
    private val categoryRepository: CategoryRepository,
) {
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
