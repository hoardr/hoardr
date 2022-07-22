package com.github.rasmussaks.hoardr.domain

import com.github.rasmussaks.hoardr.domain.event.LocationEvent
import com.github.rasmussaks.hoardr.domain.event.childLocationAddedEvent
import com.github.rasmussaks.hoardr.domain.event.childLocationRemovedEvent
import com.github.rasmussaks.hoardr.domain.event.parentChangedEvent
import javax.persistence.*

@Entity
class Location(
    var name: String,
    @ManyToOne(fetch = FetchType.LAZY)
    var parent: Location? = null
) : BaseEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "parent")
    var children: MutableList<Location> = mutableListOf()

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "location")
    var items: MutableList<Item> = mutableListOf()

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "location", cascade = [CascadeType.ALL])
    @OrderBy
    var events: MutableList<LocationEvent> = mutableListOf()

    @JvmName("setParentLocation")
    fun setParent(newParent: Location?) {
        val oldParent = parent
        if (oldParent?.id != newParent?.id) {
            parent = newParent
            events.add(parentChangedEvent(oldParent, newParent))
            oldParent?.events?.add(oldParent.childLocationRemovedEvent(this))
            newParent?.events?.add(newParent.childLocationAddedEvent(this))
        }
    }

    fun getAllParents(): List<Location> {
        return generateSequence(parent) { it.parent }.toList()
    }

    fun getAllItems(): List<Item> {
        val result = mutableListOf<Item>()
        result.addAll(items)
        children.forEach {
            result.addAll(it.getAllItems())
        }
        return result
    }
}
