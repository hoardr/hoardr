package com.github.rasmussaks.hoardr.domain

import java.time.ZonedDateTime
import javax.persistence.MappedSuperclass

@MappedSuperclass
abstract class BaseEntity {
    var createdDate: ZonedDateTime = ZonedDateTime.now()
    var lastModifiedDate: ZonedDateTime = ZonedDateTime.now()
}
