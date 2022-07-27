import {Template} from "./index";

const template: Template = {
    categories: [{
        name: "Electronics",
        description: "All sorts of electronic devices and gadgets",
        properties: ["Manufacturer"],
        children: [{
            name: "Cables",
            description: "Cables that connect devices together",
            properties: ["Length"],
        }, {
            name: "Computers",
            properties: ["Serial"],
            children: [{
                name: "Laptops",
                description: "Portable computing devices",
                properties: ["Screen diagonal"]
            }]
        }]
    }],
    locations: [{
        name: "House",
        children: [{
            name: "Second floor",
            children: [{
                name: "Bedroom",
                children: [{
                    name: "Bookshelf",
                    description: "Brown bookshelf left of the door",
                    children: [{
                        name: "3rd shelf",
                        description: "Third shelf from the bottom",
                        children: [{
                            name: "Bin 2"
                        }]
                    }]
                }]
            }]
        }]
    },{
        name: "Garage",
        children: [{
            name: "Red toolbox",
            children: [{
                name: "2nd drawer"
            }]
        }]
    }],
    properties: [{
        name: "Length",
        type: "NUMBER"
    },{
        name: "Screen diagonal",
        type: "NUMBER"
    }, {
        name: "Serial",
        type: "TEXT"
    }, {
        name: "Manufacturer",
        type: "TEXT"
    }],
    items: [{
        name: "HDMI Cable",
        category: "Cables",
    }, {
        name: "Lenovo laptop",
        category: "Laptops"
    }, {
        name: "Capacitor",
        description: "Just a regular old capacitor",
        category: "Electronics"
    }, {
        name: "Desktop computer",
        category: "Computers"
    }],
    stock: [{
        item: "HDMI Cable",
        location: "2nd drawer",
        quantity: 2
    },{
        item: "HDMI Cable",
        location: "3rd shelf",
        quantity: 1
    }]
}

export default template
