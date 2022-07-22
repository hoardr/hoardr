package com.github.rasmussaks.hoardr.rest

import com.github.rasmussaks.hoardr.api.CategoryDto
import com.github.rasmussaks.hoardr.api.toDto
import com.github.rasmussaks.hoardr.domain.Category
import com.github.rasmussaks.hoardr.graphql.input.AddCategoryInput
import com.github.rasmussaks.hoardr.service.CategoryService
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/categories")
@Transactional
@CrossOrigin("*")
class CategoryRestController(
    private val categoryService: CategoryService
) {
    @GetMapping
    fun categories(@RequestParam id: Long?, @RequestParam name: String?): Iterable<CategoryDto> {
        return categoryService.findCategories(id, name).map { it.toDto() }
    }

    @PostMapping
    fun addCategory(
        @RequestBody input: AddCategoryInput
    ): Category {
        return categoryService.addCategory(input)
    }

    @PostMapping("/{categoryId}/property/{propertyId}")
    fun addCategoryProperty(
        @PathVariable categoryId: Long,
        @PathVariable propertyId: Long
    ): Category {
        return categoryService.addCategoryProperty(categoryId, propertyId)
    }

    @DeleteMapping("/{categoryId}/property/{propertyId}")
    fun removeCategoryProperty(
        @PathVariable categoryId: Long,
        @PathVariable propertyId: Long
    ): Category {
        return categoryService.removeCategoryProperty(categoryId, propertyId)
    }

    @PostMapping("/{categoryId}/parent/{parentCategoryId}")
    fun setCategoryParent(
        @PathVariable categoryId: Long,
        @PathVariable parentCategoryId: Long
    ): Category {
        return categoryService.setCategoryParent(categoryId, parentCategoryId)
    }

    @DeleteMapping("/{categoryId}/parent")
    fun removeCategoryParent(
        @PathVariable categoryId: Long
    ): Category {
        return categoryService.setCategoryParent(categoryId, null)
    }

    @DeleteMapping("/{categoryId}")
    fun deleteCategory(
        @PathVariable categoryId: Long
    ): Long {
        return categoryService.deleteCategory(categoryId)
    }
}
