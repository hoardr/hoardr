package com.github.rasmussaks.hoardr.graphql

import com.github.rasmussaks.hoardr.domain.Category
import com.github.rasmussaks.hoardr.graphql.input.*
import com.github.rasmussaks.hoardr.service.CategoryService
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional

@Controller
@Transactional
class CategoryController(
    private val categoryService: CategoryService,
) {
    @QueryMapping
    fun categories(@Argument id: Long?, @Argument name: String?): Iterable<Category> {
        return categoryService.findCategories(id, name)
    }

    @MutationMapping
    fun addCategory(
        @Argument input: AddCategoryInput
    ): Category {
        return categoryService.addCategory(input)
    }

    @MutationMapping
    fun addCategoryProperty(
        @Argument input: AddCategoryPropertyInput
    ): Category {
        return categoryService.addCategoryProperty(input.categoryId, input.propertyId)
    }

    @MutationMapping
    fun setCategoryParent(
        @Argument input: SetCategoryParentInput
    ): Category {
        return categoryService.setCategoryParent(input.categoryId, input.parentId)
    }

    @MutationMapping
    fun removeCategoryProperty(
        @Argument input: RemoveCategoryPropertyInput
    ): Category {
        return categoryService.removeCategoryProperty(input.categoryId, input.propertyId)
    }

    @MutationMapping
    fun deleteCategory(
        @Argument input: DeleteCategoryInput
    ): Long {
        return categoryService.deleteCategory(input.categoryId)
    }
}
