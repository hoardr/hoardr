package com.github.rasmussaks.hoardr

import com.github.rasmussaks.hoardr.domain.PropertyType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.graphql.tester.AutoConfigureWebGraphQlTester
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.graphql.test.tester.WebGraphQlTester

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
@AutoConfigureWebGraphQlTester
class BaseIntTest {
    @Autowired
    protected lateinit var webGraphQlTester: WebGraphQlTester

    fun addCategory(name: String, parentId: Long? = null): Long {
        return webGraphQlTester.queryName("addCategory")
            .variable("input", mapOf("name" to name, "parentId" to parentId))
            .execute()
            .get("addCategory.id")
    }

    fun addProperty(name: String, type: PropertyType): Long {
        return webGraphQlTester.queryName("addProperty")
            .variable("input", mapOf("name" to name, "type" to type))
            .execute()
            .get("addProperty.id")
    }

    fun addCategoryProperty(categoryId: Long, propertyId: Long): Long {
        return webGraphQlTester.queryName("addCategoryProperty")
            .variable("input", mapOf("categoryId" to categoryId, "propertyId" to propertyId))
            .execute()
            .get("addCategoryProperty.id")
    }

    fun addLocation(name: String, parentId: Long? = null): Long {
        return webGraphQlTester.queryName("addLocation")
            .variable("input", mapOf("name" to name, "parentId" to parentId))
            .execute()
            .get("addLocation.id")
    }

    fun addItem(name: String?, locationId: Long, categoryId: Long): Long {
        return webGraphQlTester.queryName("addItem")
            .variable("input", mapOf("name" to name, "locationId" to locationId, "categoryId" to categoryId))
            .execute()
            .get("addItem.id")
    }

    fun setPropertyValue(itemId: Long, propertyId: Long, value: String): Long {
        return webGraphQlTester.queryName("setPropertyValue")
            .variable("input", mapOf("itemId" to itemId, "propertyId" to propertyId, "value" to value))
            .execute()
            .get("setPropertyValue.id")
    }
}
