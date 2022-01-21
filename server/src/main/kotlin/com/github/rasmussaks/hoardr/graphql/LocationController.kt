package com.github.rasmussaks.hoardr.graphql

import com.github.rasmussaks.hoardr.domain.Location
import com.github.rasmussaks.hoardr.domain.QLocation
import com.github.rasmussaks.hoardr.domain.event.createdEvent
import com.github.rasmussaks.hoardr.domain.event.childLocationAddedEvent
import com.github.rasmussaks.hoardr.graphql.input.AddLocationInput
import com.github.rasmussaks.hoardr.graphql.input.DeleteLocationInput
import com.github.rasmussaks.hoardr.graphql.input.SetLocationParentInput
import com.github.rasmussaks.hoardr.storage.LocationRepository
import com.querydsl.core.BooleanBuilder
import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional

@Controller
@Transactional
class LocationController(
    private val locationRepository: LocationRepository,
) {
    @QueryMapping
    fun locations(@Argument id: Long?, @Argument name: String?): Iterable<Location> {
        val predicate = BooleanBuilder(ONE_EQUALS_ONE)
        id?.let { predicate.and(QLocation.location.id.eq(it)) }
        name?.let { predicate.and(QLocation.location.name.lower().like("%${it}%")) }
        return locationRepository.findAll(predicate.value!!)
    }

    @MutationMapping
    fun addLocation(
        @Argument input: AddLocationInput
    ): Location {
        val parent = input.parentId?.let { locationRepository.getReferenceById(it) }
        val location = Location(name = input.name)
        location.events.add(location.createdEvent())
        location.setParent(parent)
        return locationRepository.save(location).also {
            parent?.events?.add(parent.childLocationAddedEvent(it))
        }
    }

    @MutationMapping
    fun setLocationParent(
        @Argument input: SetLocationParentInput
    ): Location {
        val location = locationRepository.getReferenceById(input.locationId)
        val newParent = input.parentId?.let { locationRepository.getReferenceById(it) }
        location.setParent(newParent)
        return locationRepository.save(location)
    }

    @MutationMapping
    fun deleteLocation(
        @Argument input: DeleteLocationInput
    ): Long {
        val category = locationRepository.getReferenceById(input.locationId)
        locationRepository.deleteById(category.id)
        return category.id
    }
}
