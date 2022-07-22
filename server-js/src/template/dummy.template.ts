import {Template} from "./index";

const template: Template = {
    categories: [{
        name: "Electronics",
        children: [{
            name: "Cables",
            properties: ["Length"],
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
                    children: [{
                        name: "3rd shelf",
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
    }],
    items: [{
        name: "HDMI Cable",
        category: "Cables",
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
