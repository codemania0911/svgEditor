$( document ).ready(function() {

    // add new Layer
    var layers = [];
    layers.push(addLayer(0));
    layers.push(addLayer(1));
    layers.push(addLayer(2));
    
    // init active color status
    //initActiveColor(0);

    
    // event: Add Color on Layer
    $( '#color-list a' ).click(function() {

        if ($(this).hasClass('btn-color-lg')) {
            $(this).removeClass('btn-color-lg').addClass('btn-color-md');
        } else {
            $(this).removeClass('btn-color-md').addClass('btn-color-lg');
        }
        initActiveColor(0);

    });

    // Add or Remove color item on Active Color Element
    function initActiveColor(layerIndex) {

        $e = $('#selected-color-list');
        $e.empty();

        $selected = $('#color-list .btn-color-lg').clone();
        $selected.removeClass('btn-color-lg').addClass('btn-color-sm');
        $e.append($selected);

        // event: set svg color
        $( '#selected-color-list a' ).click(function() {

            //get active svg
            var id = $('.edge-polyline.d-block').parent().attr('id');
            if (!id)
                return false;            

            var temp = id.split("-");
            var layer = parseInt(temp[0]);
            var index = parseInt(temp[1]);

            layers[layer][index].color = $(this).css('border-color');
            layers[layer][index].background = $(this).css('background-color');

            var $kids = $('#'+id).children().not('.edge-polyline');
            $kids.css('fill', layers[layer][index].background);
            $kids.css('stroke', layers[layer][index].color);
            $('#'+id+" circle:last-child").css('fill', layers[layer][index].color);
        });

    }

    function addLayerElement(layerIndex) {    

        //add new layer
        var tempSvg = `<svg id="editLayer`+layerIndex+`" class="z-index-`+layerIndex+`" width='820' height='446' viewBox='0 0 820 446' layer-index=`+layerIndex+`>
                        <defs>
                        <pattern id="trama" patternUnits="objectBoundingBox" width="2.5%" height="2.5%" patternTransform="rotate(25)" >
                            <line id="linea" y2="1%" />
                        </pattern>
                        </defs>      
                    </svg>`;
        $('#widget').append(tempSvg);

        //add new layer list item
        var tempNavItem = `<li class="nav-item">
                                <a class="nav-link waves-light layerItem" id="tab-layer`+layerIndex+`" data-toggle="tab" href="#tab-content-layer`+layerIndex+`"
                                role="tab" aria-controls="tab-content-layer`+layerIndex+`" aria-selected="false" layer-index=`+layerIndex+`>Layer `+layerIndex+`</a>
                            </li>`;
        $('#layerList').append(tempNavItem);

        //add new layer list item content
        var tempTabContent = `<div class="tab-pane fade" id="tab-content-layer`+layerIndex+`" role="tabpanel" aria-labelledby="tab-layer`+layerIndex+`">
                                <div class="row">
                                <div class="col-auto mr-auto">                    

                                </div>                  
                                <div class="col-auto">
                                    <p class="text-normal d-inline">Edit Layer</p>
                                    <p class="text-normal d-inline">Hide</p>
                                    <p class="text-normal d-inline">Re-Order</p>
                                </div>

                                </div>
                            </div>`;
        $('#tab-content').append(tempTabContent);
    }

    function addLayer(layerIndex) {

        addLayerElement(layerIndex);
        var svg = document.querySelector('#editLayer'+layerIndex);
        var rotating = false;
        var dragging = false;
        var impact = {
            x: 0,
            y: 0
        };
        var m = { //mouse
                x: 0,
                y: 0
            };
        var delta = {
                x: 0,
                y: 0
            };

        var layer = []; // elements array

        var svgObjects = getSvgObjects(layerIndex);

        for (var i = 0; i <  svgObjects.length; i++) {
            var el = new Element( svgObjects[i], i, svg, layerIndex);
            el.update();

            layer.push(el)
        }

        // EVENTS
        svg.addEventListener('mousedown', function(evt) {

            var selectedId = evt.target.parentElement.id;
            if (selectedId == 'widget')
                return;

            var index = parseInt((selectedId.split("-"))[1]);

            if (evt.target.tagName == layer[index].tagName) {
                
                //draw edge on selected svg
                $('.edge-polyline.d-block').removeClass('d-block').addClass('d-none');
                $('#'+selectedId+' .edge-polyline').addClass('d-block').removeClass('d-none');
                layer[index].update();

                dragging = index + 1;
                impact = oMousePos(svg, evt);
                delta.x = layer[index].o.x - impact.x;
                delta.y = layer[index].o.y - impact.y;
            }

            if (evt.target.tagName == 'circle') {
                rotating = index + 1;
            }

        }, false);

        svg.addEventListener('mouseup', function(evt) {
            rotating = false;
            dragging = false;
        }, false);

        svg.addEventListener('mouseleave', function(evt) {
            rotating = false;
            dragging = false;
        }, false);

        svg.addEventListener('mousemove', function(evt) {
            m = oMousePos(svg, evt);

            if (dragging) {
                var index = dragging - 1;
                layer[index].o.x = m.x + delta.x;
                layer[index].o.y = m.y + delta.y;
                layer[index].update();
            }

            if (rotating) {
                var index = rotating - 1;
                layer[index].a = Math.atan2(layer[index].o.y - m.y, layer[index].o.x - m.x) - layer[index].A;
                layer[index].update();
            }
        }, false);
        return layer;
    }

    $( '#layerList .layerItem' ).click(function() {    
        
        if ($(this).hasClass('active'))
            return false;
        
        var $previous = $('#layerList .layerItem.active');    
        var prevIndex = $previous.attr('layer-index');
        if (prevIndex) {
            var $prevLayer = $('#editLayer'+prevIndex);
            $prevLayer.removeClass('z-index-top');
            $prevLayer.addClass('z-index-'+prevIndex);
        } else {
            var $prevLayer = $('#widget .z-index-top'); 
            prevIndex = $prevLayer.attr('layer-index');
            if(prevIndex) {
                $prevLayer.removeClass('z-index-top');
                $prevLayer.addClass('z-index-'+prevIndex);        
            }
        }

        var index = $(this).attr('layer-index');
        var $layer = $('#editLayer'+index);
        $layer.removeClass('z-index-'+index);
        $layer.addClass('z-index-top');

        $('.edge-polyline.d-block').removeClass('d-block').addClass('d-none');

    });
});