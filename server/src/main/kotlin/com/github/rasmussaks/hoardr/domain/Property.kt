package com.github.rasmussaks.hoardr.domain

import javax.persistence.*

@Entity
class Property(
    var name: String,
    var type: PropertyType,
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "properties")
    var categories: MutableList<Category> = mutableListOf()
) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0
}

enum class PropertyType {
    TEXT
}
