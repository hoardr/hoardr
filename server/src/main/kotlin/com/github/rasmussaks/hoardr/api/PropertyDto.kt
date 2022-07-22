package com.github.rasmussaks.hoardr.api

import com.github.rasmussaks.hoardr.domain.Property

class PropertyDto(
    val id: Long,
    val name: String,
    val type: String,
)

fun Property.toDto(): PropertyDto {
    return PropertyDto(
        id = this.id,
        name = this.name,
        type = this.type.name
    )
}
