package com.github.rasmussaks.hoardr.domain.event

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.time.ZonedDateTime
import javax.persistence.*


interface Event<T> {
    val id: Long
    val type: T
    val data: Map<String, Any?>
}

val OBJECT_MAPPER: ObjectMapper = ObjectMapper()
    .registerModule(KotlinModule.Builder().build())

val EVENT_DATA_TYPE = object : TypeReference<Map<String, Any?>>() {}

@MappedSuperclass
abstract class AbstractEvent<T>(
    @Enumerated(EnumType.STRING)
    override var type: T,
    @Convert(converter = HashMapConverter::class)
    @Suppress("JpaAttributeTypeInspection")
    override val data: Map<String, Any?>
) : Event<T> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    override var id: Long = 0

    var createdDate: ZonedDateTime = ZonedDateTime.now()
}

class HashMapConverter : AttributeConverter<Map<String, Any?>, String> {
    override fun convertToDatabaseColumn(customerInfo: Map<String, Any?>): String {
        return OBJECT_MAPPER.writeValueAsString(customerInfo)
    }

    override fun convertToEntityAttribute(customerInfoJSON: String): Map<String, Any?> {
        return OBJECT_MAPPER.readValue(customerInfoJSON, EVENT_DATA_TYPE)
    }
}
