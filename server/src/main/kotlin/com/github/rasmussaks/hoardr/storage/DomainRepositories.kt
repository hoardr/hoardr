package com.github.rasmussaks.hoardr.storage

import com.github.rasmussaks.hoardr.domain.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.graphql.data.GraphQlRepository

@GraphQlRepository
interface CategoryRepository : JpaRepository<Category, Long>, QuerydslPredicateExecutor<Category>

@GraphQlRepository
interface PropertyRepository : JpaRepository<Property, Long>, QuerydslPredicateExecutor<Property>

@GraphQlRepository
interface ItemRepository : JpaRepository<Item, Long>, QuerydslPredicateExecutor<Item>

@GraphQlRepository
interface LocationRepository : JpaRepository<Location, Long>, QuerydslPredicateExecutor<Location>

@GraphQlRepository
interface PropertyValueRepository : JpaRepository<PropertyValue, Long>, QuerydslPredicateExecutor<PropertyValue>
