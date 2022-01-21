package com.github.rasmussaks.hoardr.graphql

import com.github.rasmussaks.hoardr.domain.Category
import com.github.rasmussaks.hoardr.domain.QCategory
import com.github.rasmussaks.hoardr.domain.event.createdEvent
import com.github.rasmussaks.hoardr.domain.event.childCategoryAddedEvent
import com.github.rasmussaks.hoardr.graphql.input.*
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
class CategoryController(
    private val categoryRepository: CategoryRepository,
    private val propertyRepository: PropertyRepository,
) {
    @QueryMapping
    fun categories(@Argument id: Long?, @Argument name: String?): Iterable<Category> {
        val predicate = BooleanBuilder(ONE_EQUALS_ONE)
        id?.let { predicate.and(QCategory.category.id.eq(it)) }
        name?.let { predicate.and(QCategory.category.name.lower().like("%${it}%")) }
        return categoryRepository.findAll(predicate.value!!)
    }

    @MutationMapping
    fun addCategory(
        @Argument input: AddCategoryInput
    ): Category {
        val parent = input.parentId?.let { categoryRepository.getReferenceById(it) }
        val category = Category(name = input.name, parent = parent)
        category.events.add(category.createdEvent())
        return categoryRepository.save(category).also {
            parent?.events?.add(parent.childCategoryAddedEvent(it))
        }
    }

    @MutationMapping
    fun addCategoryProperty(
        @Argument input: AddCategoryPropertyInput
    ): Category {
        val category = categoryRepository.getReferenceById(input.categoryId)
        val property = propertyRepository.getReferenceById(input.propertyId)
        if (category.properties.none { it.id == property.id }) {
            category.addProperty(property)
            return categoryRepository.save(category)
        }
        return category
    }

    @MutationMapping
    fun setCategoryParent(
        @Argument input: SetCategoryParentInput
    ): Category {
        val category = categoryRepository.getReferenceById(input.categoryId)
        val newParent = input.parentId?.let { categoryRepository.getReferenceById(it) }
        category.setParent(newParent)
        return categoryRepository.save(category)
    }

    @MutationMapping
    fun removeCategoryProperty(
        @Argument input: RemoveCategoryPropertyInput
    ): Category {
        val category = categoryRepository.getReferenceById(input.categoryId)
        val property = propertyRepository.getReferenceById(input.propertyId)
        category.removeProperty(property)
        return categoryRepository.save(category)
    }

    @MutationMapping
    fun deleteCategory(
        @Argument input: DeleteCategoryInput
    ): Long {
        val category = categoryRepository.getReferenceById(input.categoryId)
        category.children.forEach {
            it.setParent(null)
        }
        categoryRepository.deleteById(category.id)
        return category.id
    }
}
