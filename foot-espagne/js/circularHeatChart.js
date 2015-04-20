function circularHeatChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    innerRadius = 90,
    numSegments = 60,
    segmentHeight = 20,
    domain = null,
    ampleurDecalage = 10,
    accessor = function(d) {return d;},
    competitions = ["cdm","euro","c1","c3"]
    radialLabels = segmentLabels = [];

    function chart(selection) {

        selection.each(function(data) {
            var svg = d3.select(this);

                    var offset = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;
                    g = svg.append("g")
                        .classed("circular-heat", true)
                        .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

                    var autoDomain = false;
                    if (domain === null) {
                        domain = d3.extent(data, accessor);
                        autoDomain = true;
                    }
                    var color = d3.scale.linear().domain(domain).range(range);
                    if(autoDomain)
                        domain = null;


    


                   
                   /* ir_u = innerRadius + j * segmentHeight;
                    or_u = innerRadius + (j+1) * segmentHeight;*/

                    g.selectAll("path").data(datum)
                        .enter().append("path")
                        .attr("id", function(d, i) { return i;})
                        .attr("d", d3.svg.arc().innerRadius(function(d,i){ return ir(d,i) }).outerRadius(function(d,i){ return or(d,i)}).startAngle(function(d,i){ return sa(d,i) }).endAngle(function(d,i){ return ea(d,i) }))
                        .attr("fill", function(d) { 
                            if(couleurs[d[3]]) {
                                return couleurs[d[3]] } 
                                else {
                                    return "#ccc";
                                }
                            });

                
      
            // Unique id so that the text path defs are unique - is there a better way to do this?
            var id = d3.selectAll(".circular-heat")[0].length;

            //Radial labels
            var lsa = 0; //Label start angle
            var labels = svg.append("g")
                .classed("labels", true)
                .classed("radial", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.selectAll("def")
                .data(radialLabels).enter()
                .append("def")
                .append("path")
                .attr("id", function(d, i) {return "radial-label-path-"+id+"-"+i;})
                .attr("d", function(d, i) {
                    var r = innerRadius + ((i + 0.2) * segmentHeight);
                    return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) + 
                            " a" + r + " " + r + " 0 1 1 -1 0";
                });

            labels.selectAll("text")
                .data(radialLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", function(d, i) {return "#radial-label-path-"+id+"-"+i;})
                .style("font-size", 0.6 * segmentHeight + 'px')
                .text(function(d) {return d;});

            //Segment labels
            var segmentLabelOffset = 2;
            var r = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight + segmentLabelOffset;
            labels = svg.append("g")
                .classed("labels", true)
                .classed("segment", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.append("def")
                .append("path")
                .attr("id", "segment-label-path-"+id)
                .attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

            labels.selectAll("text")
                .data(datum).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", "#segment-label-path-"+id)
                .attr("transform", "rotate(90)")
                .attr("startOffset", function(d, i) {
                    return ampleurDecalage*50/(numSegments+ampleurDecalage) + i * 100 / (numSegments+ampleurDecalage) + "%";
                })
                .text(function(d) { if(Number(d[2])%2 == 0) return d[2];});
        });

    }

    /* Arc functions */
    ir = function(d, i) {
        niveau = competitions.indexOf(d[1]) + 1
        console.log(niveau)
         return innerRadius + niveau * segmentHeight;
       /* return innerRadius + Math.floor(i/numSegments) * segmentHeight;*/
    }
    or = function(d, i) {
        return innerRadius + (niveau+1)*segmentHeight;
    }
   
    var decalage = 0;
    sa = function(d, i) { 

        if(i%(numSegments) == 0 && i != 0) {
            decalage += ampleurDecalage*(2*Math.PI) / (numSegments+ampleurDecalage);
        }
        return (i * 2 * Math.PI) / (numSegments+ampleurDecalage) + decalage + (ampleurDecalage*Math.PI)/(numSegments+ampleurDecalage);
    }
    ea = function(d, i) {
        return ((((i + 1) * 2 * Math.PI)) / (numSegments+ampleurDecalage) + decalage + (ampleurDecalage*Math.PI)/(numSegments+ampleurDecalage));
    }
    label = function(d, i) {
        return ((((i + 1) * 2 * Math.PI)) / (numSegments+ampleurDecalage) + decalage + (ampleurDecalage*Math.PI)/(numSegments+ampleurDecalage));
    }

     /* Anciennes fonctions */
/*    ir = function(d, i) {
        return innerRadius + Math.floor(i/numSegments) * segmentHeight;
    }
    or = function(d, i) {
        return innerRadius + segmentHeight + Math.floor(i/numSegments) * segmentHeight;
    }
   
    var decalage = 0;
    sa = function(d, i) { 
        if(i%(numSegments) == 0 && i != 0) {
            decalage += ampleurDecalage*(2*Math.PI) / (numSegments+ampleurDecalage);
        }
        return (i * 2 * Math.PI) / (numSegments+ampleurDecalage) + decalage + (ampleurDecalage*Math.PI)/(numSegments+ampleurDecalage);
    }
    ea = function(d, i) {
        return ((((i + 1) * 2 * Math.PI)) / (numSegments+ampleurDecalage) + decalage + (ampleurDecalage*Math.PI)/(numSegments+ampleurDecalage));
    }
    label = function(d, i) {
        return ((((i + 1) * 2 * Math.PI)) / (numSegments+ampleurDecalage) + decalage + (ampleurDecalage*Math.PI)/(numSegments+ampleurDecalage));
    }*/


    function deg(d){
        return d*180/Math.PI;
    }

    /* Configuration getters/setters */
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.innerRadius = function(_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
        return chart;
    };

    chart.numSegments = function(_) {
        if (!arguments.length) return numSegments;
        numSegments = _;
        return chart;
    };

    chart.segmentHeight = function(_) {
        if (!arguments.length) return segmentHeight;
        segmentHeight = _;
        return chart;
    };

    chart.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return chart;
    };

    chart.range = function(_) {
        if (!arguments.length) return range;
        range = _;
        return chart;
    };

    chart.radialLabels = function(_) {
        if (!arguments.length) return radialLabels;
        if (_ == null) _ = [];
        radialLabels = _;
        return chart;
    };

    chart.segmentLabels = function(_) {
        if (!arguments.length) return segmentLabels;
        if (_ == null) _ = [];
        segmentLabels = _;
        return chart;
    };

    chart.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return chart;
    };

    return chart;
}
