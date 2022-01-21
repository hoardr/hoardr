package com.github.rasmussaks.hoardr

import com.github.rasmussaks.hoardr.domain.PropertyType
import org.junit.jupiter.api.Test

class HoardrApplicationTests : BaseIntTest() {
    @Test
    fun addTestData() {
        val serialProperty = addProperty("Serial", PropertyType.TEXT)

        val electronics = addCategoryProperty(addCategory("Electronics"), serialProperty)
        val cable = addCategory("Cables", electronics)
        val hdmiCable = addCategory("HDMI Cables", cable)
        addCategory("DisplayPort Cables", cable)
        addCategory("Ethernet Cables", cable)
        val phone = addCategory("Phones", electronics)

        val bedroom = addLocation("Bedroom")
        val shelf = addLocation("Shelf", bedroom)

        addItem("OnePlus 8 Pro", shelf, phone)

        val longCable = addItem("Long HDMI Cable", shelf, hdmiCable)
        val shortCable = addItem("Short HDMI Cable", shelf, hdmiCable)

        setPropertyValue(longCable, serialProperty, "abc-123")

        var nested = addCategory("Nested 1")
        val rootNested = nested
        (2 until 20).forEach {
            nested = addCategory("Nested $it", nested)
        }
        addItem("Nested item", shelf, nested)
        addCategoryProperty(rootNested, addProperty("Root property", PropertyType.TEXT))
    }
}
