package com.github.rasmussaks.hoardr.domain

import javax.persistence.*

@Entity
@Table(name = "item_property_value")
class PropertyValue(
    var value: String,
    @ManyToOne(fetch = FetchType.LAZY)
    var property: Property,
    @ManyToOne(fetch = FetchType.LAZY)
    var item: Item
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

}
