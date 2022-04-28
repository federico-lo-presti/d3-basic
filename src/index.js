
import * as d3 from 'd3'
import 'modern-normalize'
import '@accurat/tachyons-lite'
import 'tachyons-extra'
import './reset.css'
import './style.css'



var w = 900;
var h = 450;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
        11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .rangeRound([0, w])
        .paddingInner(0.05);

var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, h]);


var svg = d3.select("#root")
      .append("svg")
      .attr("id", "mySvg")
      .attr("width", w)
      .attr("height", h);

var button = d3.select("#root")
      .append("button")
      .text("Add value!")
      

/* var button2 = d3.select("#root")
      .append("button")
      .text("Shuffle!")


d3.select("button")
  .on("click", () => {
      dataset.forEach((datum)=> {
        var maxValue = 25;
        var newNumber = Math.floor(Math.random() * maxValue);	

        datum = newNumber;
      })
}) */

//Create rectangles
svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", (d, i) =>  {
    return xScale(i);
  })
  .attr("y", (d) => {
    return h - yScale(d);
  })
  .attr("width", xScale.bandwidth())
  .attr("height", (d) => {
    return yScale(d);
  })
  .attr("fill", (d) => {
    return "rgb(0, 0, " + Math.round(d * 10) + ")";
  });

//Create labels
svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .text((d) => {
    return d;
  })
  .attr("text-anchor", "middle")
  .attr("x", (d, i) => {
    return xScale(i) + xScale.bandwidth() / 2;
  })
  .attr("y", (d) => {
    return h - yScale(d) + 14;
  })
  .attr("font-family", "arial")
  .attr("font-size", "12px")
  .attr("fill", "white");


  
//Add new random data			
d3.select("button")
  .on("click", () => {

    //Map random value
    var maxValue = 25;
    var newNumber = Math.floor(Math.random() * maxValue);	
    dataset.push(newNumber);			 			 		
    
    //Update scale domains
    xScale.domain(d3.range(dataset.length));	
    yScale.domain([0, d3.max(dataset)]);		

    
    var bars = svg.selectAll("rect")			
      .data(dataset);	// ---> Re-bind data to existing bars, return the 'update' selection
                              
    //Enter…
    bars.enter()	//---> References the enter selection (a subset of the update selection)
      .append("rect")
      .attr("x", w)	
      .attr("y", (d) => {	
        return h - yScale(d);
      })
      .attr("width", xScale.bandwidth())	
      .attr("height", (d) => {			
        return yScale(d);
      })
      .attr("fill", (d) => {			
        return "rgb(0, 0, " + Math.round(d * 10) + ")";
      })
      .merge(bars)							//Merges the enter selection with the update selection
      .transition()							//Initiate a transition on all elements in the update selection (all rects)
      .duration(500)
      .attr("x", (d, i) => {				//Set new x position
        return xScale(i);
      })
      .attr("y", (d) => {				//Set new y position
        return h - yScale(d);
      })
      .attr("width", xScale.bandwidth())		
      .attr("height", (d) => {			
        return yScale(d);
      });


    var labels = svg.selectAll("text")
          .data(dataset);
    
    labels.enter()
      .append("text")
      .text((d) => {
        return d;
      })
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("fill", (d) => {
        if (d < 0.07 * maxValue)
          {	return "black"	}    // ---> Dark/white label threshold  !!!
        else {	return "white"	}
      })
      .attr("x", (d, i) => {
        return w + xScale.bandwidth() / 2;
      })
      .attr("y", (d) => {
        if (d < 0.07 * maxValue)
        {	return h - yScale(d) - 7	}
        else 
        {	return h - yScale(d) + 14;	}
      })
      .merge(labels)
      .transition()
      .duration(500)
      .attr("x", (d, i) => { //Set new x position, based on the updated xScale
        return xScale(i) + xScale.bandwidth() / 2;
      })
  });
