package com.github.rasmussaks.hoardr.graphql.input

import com.github.rasmussaks.hoardr.domain.PropertyType

class AddCategoryInput(val name: String, val parentId: Long?)
class AddPropertyInput(val name: String, val type: PropertyType, val categoryId: Long?)
class AddLocationInput(val name: String, val parentId: Long?)
class AddCategoryPropertyInput(val categoryId: Long, val propertyId: Long)
class RemoveCategoryPropertyInput(val categoryId: Long, val propertyId: Long)
class AddItemInput(val name: String?, val locationId: Long, val categoryId: Long)
class SetPropertyValueInput(val itemId: Long, val propertyId: Long, val value: String?)
class SetCategoryParentInput(val categoryId: Long, val parentId: Long?)
class SetLocationParentInput(val locationId: Long, val parentId: Long?)
class DeleteCategoryInput(val categoryId: Long)
class DeleteLocationInput(val locationId: Long)
