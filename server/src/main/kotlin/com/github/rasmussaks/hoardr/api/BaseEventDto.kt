package com.github.rasmussaks.hoardr.api

import java.time.Instant

abstract class BaseEventDto(
    val type: String,
    val data: Map<String, Any?>,
    val id: Long,
    val createdDate: Instant
)
