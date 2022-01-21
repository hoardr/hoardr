package com.github.rasmussaks.hoardr

import org.springframework.graphql.test.tester.GraphQlTester
import org.springframework.graphql.test.tester.WebGraphQlTester

inline fun <reified D : Any> GraphQlTester.PathSpec.isEqualTo(expected: D): GraphQlTester.EntitySpec<*, *> {
    return this.entity(D::class.java).isEqualTo<GraphQlTester.EntitySpec<*, *>>(expected)
}

inline fun <reified D : Any> GraphQlTester.PathSpec.isNotEqualTo(expected: D): GraphQlTester.EntitySpec<*, *> {
    return this.entity(D::class.java).isNotEqualTo<GraphQlTester.EntitySpec<*, *>>(expected)
}

inline fun <reified T> WebGraphQlTester.WebResponseSpec.get(path: String): T {
    return this.path(path).entity(T::class.java).get()
}
