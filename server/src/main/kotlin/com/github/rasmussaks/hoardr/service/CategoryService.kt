package com.github.rasmussaks.hoardr.service

import com.github.rasmussaks.hoardr.domain.Category
import com.github.rasmussaks.hoardr.domain.QCategory
import com.github.rasmussaks.hoardr.domain.event.childCategoryAddedEvent
import com.github.rasmussaks.hoardr.domain.event.createdEvent
import com.github.rasmussaks.hoardr.graphql.ONE_EQUALS_ONE
import com.github.rasmussaks.hoardr.graphql.input.*
import com.github.rasmussaks.hoardr.storage.CategoryRepository
import com.github.rasmussaks.hoardr.storage.PropertyRepository
import com.querydsl.core.BooleanBuilder
import org.springframework.stereotype.Component

@Component
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val propertyRepository: PropertyRepository,
) {
    fun findCategories(id: Long?, name: String?): Iterable<Category> {
        val predicate = BooleanBuilder(ONE_EQUALS_ONE)
        id?.let { predicate.and(QCategory.category.id.eq(it)) }
        name?.let { predicate.and(QCategory.category.name.lower().like("%${it}%")) }
        return categoryRepository.findAll(predicate.value!!)
    }

    fun addCategory(
        input: AddCategoryInput
    ): Category {
        val parent = input.parentId?.let { categoryRepository.getReferenceById(it) }
        val category = Category(name = input.name, parent = parent)
        category.events.add(category.createdEvent())
        return categoryRepository.save(category).also {
            parent?.events?.add(parent.childCategoryAddedEvent(it))
        }
    }

    fun addCategoryProperty(
        categoryId: Long,
        propertyId: Long
    ): Category {
        val category = categoryRepository.getReferenceById(categoryId)
        val property = propertyRepository.getReferenceById(propertyId)
        category.addProperty(property)
        return categoryRepository.save(category)
    }

    fun setCategoryParent(
        categoryId: Long,
        parentCategoryId: Long?
    ): Category {
        val category = categoryRepository.getReferenceById(categoryId)
        val newParent = parentCategoryId?.let { categoryRepository.getReferenceById(it) }
        category.setParent(newParent)
        return categoryRepository.save(category)
    }

    fun removeCategoryProperty(
        categoryId: Long,
        propertyId: Long
    ): Category {
        val category = categoryRepository.getReferenceById(categoryId)
        val property = propertyRepository.getReferenceById(propertyId)
        category.removeProperty(property)
        return categoryRepository.save(category)
    }

    fun deleteCategory(
        categoryId: Long
    ): Long {
        val category = categoryRepository.getReferenceById(categoryId)
        category.children.forEach {
            it.setParent(null)
        }
        categoryRepository.deleteById(category.id)
        return category.id
    }
}
