var color = {
    border: "rgb(255, 27, 12)",
    background: "rgba(255, 57, 62, 0.3)"
};
var SVGLink_NS = 'http://www.w3.org/1999/xlink';
var SVG_NS = 'http://www.w3.org/2000/svg';
var deg = 180 / Math.PI;

function getColor(index) {   
    var color = {
        border: "rgba(255, 27, 12, 0.6)",
        background: "rgba(255, 57, 62, 0.3)"
    };

    switch(index) {
        case 0:
            color.border = "rgba(27, 255, 12, 0.6)";
            color.background = "rgba(57, 255, 62, 0.3)";
            break;
        case 1:
            color.border = "rgba(27, 12, 255, 0.6)";
            color.background = "rgba(57, 62, 266, 0.3)";
            break;
        default:            
            break;
    }
    return color;
}

function getSvgObjects(layerIndex) {

    var objectsRy = [];

    // Added Items
    var item1 = {
        properties: {
            stroke: getColor(layerIndex).border,
            fill: getColor(layerIndex).background,
            points: "0,-70 66.57395614066074,-21.631189606246316 41.14496766047312,56.63118960624632 -41.144967660473114,56.63118960624632 -66.57395614066075,-21.63118960624631 -1.2858791391047208e-14,-70"
        },//parent: this.g,
        //parent: this.g,
        tagName: 'polygon',
        pos: {
            x: 100,
            y: 100
        }
    }
    objectsRy.push(item1);

    var item2 = {
        properties: {
            stroke: getColor(layerIndex).border,
            fill: getColor(layerIndex).background,
            points: "0,-70 66.57395614066074,-21.631189606246316 41.14496766047312,56.63118960624632 -41.144967660473114,56.63118960624632 -66.57395614066075,-21.63118960624631 -1.2858791391047208e-14,-70"
        },
        //parent: this.g,
        tagName: 'polygon',
        pos: {
            x: 400,
            y: 250
        }
    }

    objectsRy.push(item2);

    var item3 = {
        properties: {
            stroke: getColor(layerIndex).border,
            d: 'M-90,0 a90,50 0 1, 0 0,-1  z',
            fill: getColor(layerIndex).background,
        },
        //parent: this.g,
        tagName: 'path',
        pos: {
            x: 370,
            y: 150
        }
    }
    objectsRy.push(item3);

    return objectsRy;
}

function Element(o, index, svg, layerIndex) {
    this.g = document.createElementNS(SVG_NS, 'g');
    this.g.setAttributeNS(null, 'id', layerIndex+"-"+index);
    svg.appendChild(this.g);

    o.parent = this.g;

    this.el = drawElement(o);
    this.a = 0;
    this.tagName = o.tagName;
    this.color = o.properties.stroke;
    this.background = o.properties.background;
    this.elRect = this.el.getBoundingClientRect();
    this.svgRect = svg.getBoundingClientRect();
    this.Left = this.elRect.left - this.svgRect.left;
    this.Right = this.elRect.right - this.svgRect.left;
    this.Top = this.elRect.top - this.svgRect.top;
    this.Bottom = this.elRect.bottom - this.svgRect.top;

    this.LT = {
        x: 0,
        y: 0
    };
    this.RT = {
        x: this.Right,
        y: this.Top
    };
    this.LB = {
        x: this.Left,
        y: this.Bottom
    };
    this.RB = {
        x: this.Right,
        y: this.Bottom
    };
    this.c = {
        x: (this.elRect.width / 2) + this.Left,
        y: (this.elRect.height / 2) + this.Top
    };
    this.o = {
        x: o.pos.x,
        y: o.pos.y
    };

    this.A = Math.atan2(this.elRect.height / 2, this.elRect.width / 2);

    this.pointsValue = function() { // points for the box
        return (this.Left + "," + this.Top + " " + this.Right + "," + this.Top + " " + this.Right + "," + this.Bottom + " " + this.Left + "," + this.Bottom + " " + this.Left + "," + this.Top);
    }

    var box = {
        properties: {
          points: this.pointsValue(),
          fill: 'none',
          stroke: 'black',
          'stroke-dasharray': '5,5',
          class: 'edge-polyline d-none'
        },
        parent: this.g,
        tagName: 'polyline',        
    }
    
    this.box = drawElement(box);

    var leftTop = {
        properties: {
            cx: this.LT.x,
            cy: this.LT.y,
            r: 6,
            fill: this.color
        },
        parent: this.g,
        tagName: 'circle'
    }

    this.lt = drawElement(leftTop);

    this.update = function() {
        var transf = 'translate(' + this.o.x + ', ' + this.o.y + ')' + ' rotate(' + (this.a * deg) + ')';
        this.el.setAttributeNS(null, 'transform', transf);        
        this.lt.setAttributeNS(null, 'transform', transf);
        this.box.setAttributeNS(null, 'transform', transf);
    }

}

// HELPERS

function oMousePos(svg, evt) {
    var ClientRect = svg.getBoundingClientRect();    
    return { //objeto
        x: Math.round(evt.clientX - ClientRect.left),
        y: Math.round(evt.clientY - ClientRect.top)
    }
}

function drawElement(o) {
    var el = document.createElementNS(SVG_NS, o.tagName);
    for (var name in o.properties) {
        console.log(name);
        if (o.properties.hasOwnProperty(name)) {
            el.setAttributeNS(null, name, o.properties[name]);
        }
    }
    o.parent.appendChild(el);
    return el;
}