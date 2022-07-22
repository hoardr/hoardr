package com.github.rasmussaks.hoardr.domain

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import javax.persistence.*

@Entity
@Table(name = "item_property_value")
class PropertyValue(
    var value: String,
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("categories")
    var property: Property,
    @ManyToOne(fetch = FetchType.LAZY)
    var item: Item
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

}
