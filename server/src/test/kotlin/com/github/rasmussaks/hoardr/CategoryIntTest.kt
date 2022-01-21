package com.github.rasmussaks.hoardr

import org.junit.jupiter.api.Test

class CategoryIntTest : BaseIntTest() {
    @Test
    fun addingNewCategory_AddsCreatedEvent() {
        val result = webGraphQlTester.queryName("addCategory")
            .variable("input", mapOf("name" to "Electronics"))
            .execute()
        result.errors().verify()
        result.path("addCategory.name").isEqualTo("Electronics")
        result.path("addCategory.events[0].type").isEqualTo("CREATED")
        result.path("addCategory.events[0].id").isNotEqualTo(0)
    }
}
